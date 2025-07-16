import uvicorn # noqa
from agency_swarm.integrations.mcp_server import run_mcp

# replace with your own directory path
directory_path = "./example_tools"

# Alternative way of running the app with uvicorn
def setup_uvicorn_app():
    fastmcp = run_mcp(tools=directory_path, return_app=True)
    app = fastmcp.http_app(stateless_http=True, transport="streamable-http")
    return app

app = setup_uvicorn_app()

if __name__ == "__main__":
    # Preferred way of running the app
    run_mcp(tools=directory_path, transport="streamable-http", host="0.0.0.0", port=8000)
    # Or you can use uvicorn instead
    # uvicorn.run(app, host="0.0.0.0", port=8000)   