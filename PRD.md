# MCP Tools Template - Product Requirements Document

## Overview

The MCP Tools Template is a comprehensive framework for developing Model Context Protocol (MCP) tools using Agency Swarm's MCP integration. This template provides developers with a standardized approach to create, test, and deploy MCP-compatible tools that can be consumed by AI agents and applications.

## Product Vision

Enable developers to rapidly create high-quality, production-ready MCP tools with minimal setup while maintaining protocol compatibility and best practices.

## Target Users

- **AI Developers** building MCP-compatible tools
- **DevOps Engineers** deploying MCP servers
- **System Integrators** connecting AI agents to external services
- **Open Source Contributors** extending MCP tool capabilities

## Core Requirements

### 1. Functional Requirements

#### 1.1 Tool Development Framework
- **Function-based tool creation** using `@function_tool` decorator
- **Async function support** for non-blocking operations
- **Pydantic model integration** for argument validation
- **Legacy class-based tool support** for backward compatibility
- **Type hint enforcement** for better code clarity

#### 1.2 MCP Server Management
- **Directory-based tool discovery** from configurable paths
- **Multiple transport protocols**: streamable-http, http, sse, stdio
- **HTTP server integration** with uvicorn support
- **Port configuration** (default: 8000)
- **Authentication support** via APP_TOKEN environment variable

#### 1.3 Tool Organization
- **Flexible tool structure**: directory-based or single-file
- **Logical grouping** (e.g., `file_tools/`, `api_tools/`)
- **Single directory path limitation** for tool discovery
- **Automatic tool registration** from specified directories

#### 1.4 Testing & Validation
- **Individual tool testing** with `if __name__ == "__main__":` blocks
- **Local testing** via stdio transport
- **Complex function testing** with async context setup
- **Error handling validation** and exception management

### 2. Technical Requirements

#### 2.1 Framework Dependencies
- **Agency Swarm MCP Integration**: `agency_swarm.integrations.mcp_server`
- **Python Version**: 3.12+ for optimal performance
- **Pydantic**: For data validation and serialization
- **AsyncIO**: For asynchronous operation support

#### 2.2 Transport Protocols
- **Primary**: streamable-http (recommended for production)
- **Secondary**: http, sse for web-based integration
- **Local**: stdio for direct process integration
- **Alternative**: uvicorn for custom HTTP server setup

#### 2.3 Deployment Options
- **Docker containerization** with Python 3.12 slim base
- **Non-root user execution** for security
- **Port exposure** on 8000 (configurable)
- **Environment variable support** for configuration