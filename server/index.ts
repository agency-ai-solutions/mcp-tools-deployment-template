import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

interface McpJson {
  mcpServers: Record<
    string,
    {
      command: string;
      args?: string[];
      env?: Record<string, string>;
    }
  >;
}

interface ServerDef {
  name: string;
  cmdString: string;
  env: Record<string, string>;
}

/* -------------------------------------------------
 *  Load mcp.json
 * -------------------------------------------------*/
const MCP_JSON_PATH = path.resolve(process.cwd(), "mcp.json");

if (!fs.existsSync(MCP_JSON_PATH)) {
  throw new Error(
    `mcp.json not found at ${MCP_JSON_PATH}. Create one with the format: 
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "mcp-server"],
      "env": { "API_KEY": "value" }
    }
  }
}`
  );
}

const rawJson = fs.readFileSync(MCP_JSON_PATH, "utf-8");
let config: McpJson;
try {
  config = JSON.parse(rawJson);
} catch (err) {
  throw new Error(`Invalid JSON in mcp.json: ${(err as Error).message}`);
}

if (!config.mcpServers || Object.keys(config.mcpServers).length === 0) {
  throw new Error("mcp.json contains no servers under `mcpServers`.");
}

/* -------------------------------------------------
 *  Prepare server definitions
 * -------------------------------------------------*/
const servers: ServerDef[] = Object.entries(config.mcpServers).map(
  ([name, spec]) => {
    const cmdParts = [spec.command, ...(spec.args ?? [])];
    return {
      name: name.toLowerCase(),
      cmdString: cmdParts.join(" "),
      env: spec.env ?? {}
    };
  }
);

/* -------------------------------------------------
 *  Config
 * -------------------------------------------------*/
const BASE_INTERNAL_PORT = parseInt(
  process.env.BASE_INTERNAL_PORT ?? "8100",
  10
);
const PORT = parseInt(process.env.PORT ?? "8080", 10);
const PYTHON_SERVER_PORT = parseInt(process.env.PYTHON_SERVER_PORT ?? "8000", 10);

const app = express();

/* -------------------------------------------------
 *  Launch Python MCP server for local tools
 * -------------------------------------------------*/
const pythonChild = spawn("python", ["server/start_mcp.py"], { 
  stdio: "inherit",
  env: { ...process.env },
  cwd: process.cwd()
});

pythonChild.on("exit", code =>
  console.error(
    `Python MCP server exited with code ${code ?? "unknown"}`
  )
);

pythonChild.on("error", err =>
  console.error(`Failed to start Python MCP server: ${err.message}`)
);

/* -------------------------------------------------
 *  Track child processes for cleanup
 * -------------------------------------------------*/
const childProcesses: any[] = [pythonChild];

/* -------------------------------------------------
 *  Launch Supergateway for each server
 * -------------------------------------------------*/
servers.forEach((srv, idx) => {
  const gatewayPort = BASE_INTERNAL_PORT + idx;

  const sgArgs = [
    "-y",
    "supergateway",
    "--stdio",
    srv.cmdString,
    "--port",
    gatewayPort.toString(),
    "--baseUrl",
    `http://localhost:${gatewayPort}/${srv.name}`,
    "--ssePath",
    "/sse",
    "--messagePath",
    "/message",
    "--logLevel",
    "none"
  ];

  const childEnv = { ...process.env, ...srv.env };
  const child = spawn("npx", sgArgs, { stdio: "inherit", env: childEnv });

  childProcesses.push(child);

  child.on("exit", code =>
    console.error(
      `Supergateway for ${srv.name} exited with code ${code ?? "unknown"}`
    )
  );

  child.on("error", err =>
    console.error(`Failed to start supergateway for ${srv.name}: ${err.message}`)
  );

  /* Reverse proxy mapping */
  app.use(
    `/${srv.name}`,
    createProxyMiddleware({
      target: `http://localhost:${gatewayPort}`,
      changeOrigin: true,
      pathRewrite: p => p.replace(`/${srv.name}`, ""),
      ws: true
    })
  );
});

app.use(
  createProxyMiddleware({
    target: `http://localhost:${PYTHON_SERVER_PORT}`,
    changeOrigin: true,
    ws: true,
    context: (pathname: string) => pathname.startsWith('/sse'),
    pathRewrite: (path: string) => {
      // Replace /sse with /sse/ only if it's exactly /sse (not /sse/)
      // This regex ensures query params are preserved
      return path.replace(/^\/sse(?=\?|$)/, '/sse/');
    }
  } as any)
);

// Proxy /messages to Python server
app.use(
  createProxyMiddleware({
    target: `http://localhost:${PYTHON_SERVER_PORT}`,
    changeOrigin: true,
    context: (pathname: string) => pathname.startsWith('/messages'),
    pathRewrite: (path: string) => {
      // Replace /messages with /messages/ only if it's exactly /messages
      return path.replace(/^\/messages(?=\?|$)/, '/messages/');
    }
  } as any)
);

/* -------------------------------------------------
 *  Cleanup on exit
 * -------------------------------------------------*/
process.on("SIGINT", () => {
  console.log("\nShutting down servers...");
  childProcesses.forEach(child => {
    if (child && !child.killed) {
      child.kill();
    }
  });
  process.exit(0);
});

process.on("SIGTERM", () => {
  childProcesses.forEach(child => {
    if (child && !child.killed) {
      child.kill();
    }
  });
  process.exit(0);
});

/* -------------------------------------------------
 *  Info endpoint
 * -------------------------------------------------*/
app.get("/", (_, res) =>
  res.json({
    status: "ok",
    localTools: {
      sse: "/sse",
      message: "/messages",
      description: "Python MCP server for local tools"
    },
    servers: servers.map(s => ({
      name: s.name,
      sse: `/${s.name}/sse`,
      message: `/${s.name}/message`
    }))
  })
);

app.listen(PORT, () =>
  console.log(
    `✅ Multi-MCP proxy running on :${PORT}\n` +
      `• Local tools: /sse  |  /messages  (Python server on :${PYTHON_SERVER_PORT})\n` +
      servers
        .map(
          s =>
            `• ${s.name}: /${s.name}/sse  |  /${s.name}/message`
        )
        .join("\n")
  )
);