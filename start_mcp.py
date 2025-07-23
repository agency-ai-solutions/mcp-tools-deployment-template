import uvicorn # noqa
from agency_swarm.integrations.mcp_server import run_mcp

# replace with your own directory path
directory_path = "./tools"

# Alternative way of running the app with uvicorn
def setup_uvicorn_app():
    fastmcp = run_mcp(tools=directory_path, return_app=True)
    app = fastmcp.http_app(stateless_http=True, transport="sse")
    return app

app = setup_uvicorn_app()

if __name__ == "__main__":
    # Preferred way of running the app
    run_mcp(tools=directory_path, transport="sse", host="0.0.0.0", port=8080)
    # Or you can use uvicorn instead
    # uvicorn.run(app, host="0.0.0.0", port=8080)   