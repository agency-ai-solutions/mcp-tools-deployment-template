# MCP Tools Template

A template for quickly creating MCP tools using AI IDEs and deploying them to production in just a few clicks!

## 🚀 Step-by-Step Guide

### Prerequisites
- Python 3.12+
- Git

## Step 0: Copy Template

Copy this GitHub template by clicking the "Use this template" button on the top right of the page.

## Step 1: Create a Virtual Environment

**In Cursor, Windsur, or VS Code:**

1. Open the Command Palette:
   - On Mac: `Cmd + Shift + P`
   - On Windows: `Ctrl + Shift + P`
2. Type and select: **Python: Select Interpreter**
3. Click: **+ Create Virtual Environment**
4. Choose: **Venv** as the environment type

**In Terminal:**
```bash
python -m venv venv
source venv/bin/activate
```

## Step 2: Create Tools Just by Chatting With AI

Prompt your AI IDE to create the tools for you in chat. **Make sure to include `./.cursor/rules/workflow.mdc`** in the context. (Included by default only in Cursor). 

For example:

```
Please create a tool that fetches the transcripts from a YouTube video. @workflow.mdc
```

Answer the clarifying questions and keep iterating until the tools are created and working as expected.

Make sure to add any requested env variables to the `./.env` file.

## Step 3: Deploy to Production

1. Visit [railway.com](https://railway.com).
2. Create a new project and select Deploy from GitHub.
3. Connect and select the GitHub repository you created in step 1.
4. Click Deploy.


## Step 4: Copy Your Railway Deployment URL

1. Go to Settings > Networking
2. Click "Generate Domain"
3. Select port 8080 if needed
4. Copy the generated URL.

Your MCP tools will be accessible at `https://<railway-domain>/sse`

## Step 5: Connect MCP Servers to Agencii

1. Navigate to [Agencii tools page](https://agencii.ai/tools/). 
2. Click "New Tool"
3. Select "MCP"
4. Enter the URL of your MCP server
5. Click "Sync Tools"
6. Click "Save"
7. Add your tool to an agent.


## 📚 Reference Documentation

- **[Agency Swarm MCP Integration](https://github.com/VRSEN/agency-swarm)** - Framework documentation
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Official MCP specification
