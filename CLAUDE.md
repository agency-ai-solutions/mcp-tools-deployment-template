# MCP Tools Project Instructions

This is an MCP (Model Context Protocol) tools deployment template. When working in this project, follow these guidelines:

## Project Structure
```
mcp-tools-template/
├── .cursor/rules/        # Cursor-specific rules (reference but don't modify)
├── tools/               # All MCP tools go here
├── server/              # MCP server files (do not modify)
├── requirements.txt     # Python dependencies
├── .env                # Environment variables
└── README.md
```

## Tool Development Guidelines

1. **Creating New Tools**:
   - Place all tools in the `tools/` directory
   - Name files exactly as the tool class name with `.py` extension
   - Follow the Agency Swarm BaseTool pattern
   - Always load environment variables with `load_dotenv()`
   - Include test cases in `if __name__ == "__main__":` blocks

2. **Before Creating Tools**:
   - Check `.cursor/rules/workflow.mdc` for detailed workflow
   - Look for `.cursor/rules/PRD.md` for requirements
   - Ensure virtual environment is activated
   - Verify all required environment variables are in `.env`

3. **Testing**:
   - Always test tools by running: `python tools/ToolName.py`
   - Ensure all tools work before marking complete

4. **Best Practices**:
   - Never hardcode API keys - use environment variables
   - Use descriptive docstrings for tool purposes
   - Comment code with clear step-by-step explanations
   - Prefer Python SDK packages over raw API calls

## Commands to Remember
- Activate venv: `source venv/bin/activate`
- Install deps: `pip install -r requirements.txt`
- Test tool: `python tools/ToolName.py`