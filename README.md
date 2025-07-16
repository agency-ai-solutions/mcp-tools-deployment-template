# MCP Tools Template

A comprehensive framework for developing **Model Context Protocol (MCP) tools** using Agency Swarm's MCP integration. This template provides developers with a standardized approach to create, test, and deploy MCP-compatible tools that can be consumed by AI agents and applications.

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Git

### Installation
```bash
pip install -r requirements.txt
```

### Run the MCP Server
```bash
python start_mcp.py
```
This will start an mcp server with several testing tools that will be available at http://0.0.0.0:8000/mcp/
To test locally, you can add this server to the openai agent's mcp_servers list.
To use HostedMCPTool, you'll need to make this url publically available. Easiest way is to use [ngrok](https://ngrok.com/downloads/mac-os) (for exposing local MCP server during development)

## 🐳 Docker Deployment

### Build and Run
```bash
# Build container
docker build -t mcp-tools-template .

# Run container
docker run -p 8000:8000 mcp-tools-template

# Run with environment variables (to use auth)
docker run -p 8000:8000 -e APP_TOKEN=your-token mcp-tools-template
```

### Docker Configuration
- **Base Image**: Python 3.12 slim
- **Port**: 8000 (configurable)
- **Security**: Non-root user execution
- **Transport**: streamable-http by default

## 📋 Examples in Repository

### Current Example Tools

1. **`get_current_time`** - Returns current time for specified timezone
   - Uses Pydantic model for validation
   - Handles timezone conversion
   - Comprehensive error handling

2. **`get_unique_id`** - Returns a unique identifier
   - Simple function without arguments
   - Demonstrates basic tool structure

3. **`list_directory`** - Lists contents of current directory
   - File system operations example
   - Error handling for permissions

4. **`GetSecretWordTool`** - Legacy class-based tool example
   - Shows backward compatibility
   - Not recommended for new development

## 🔍 Development Guidelines

### Best Practices
- **Always use function-based tools** with `@function_tool` decorator
- **Define Pydantic models** for complex arguments with field validators if needed
- **Use clear, descriptive docstrings** - they become tool descriptions for MCP clients
- **Handle exceptions gracefully** and return error messages as strings
- **Return string responses** that are meaningful to the client
- **Use type hints** for better code clarity

### Tool Organization
- Place tools in logical directories (`file_tools/`, `api_tools/`, etc.)
- Currently supports single directory path for tool discovery
- Update `directory_path` in `start_mcp.py` to point to your tools directory

### Error Handling
- Always wrap tool logic in try/catch blocks
- Return meaningful error messages as strings
- Don't let tools crash the MCP server

## 📚 Reference Documentation

- **[PRD.md](PRD.md)** - Product Requirements Document with detailed specifications
- **[Agency Swarm MCP Integration](https://github.com/VRSEN/agency-swarm)** - Framework documentation
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Official MCP specification
