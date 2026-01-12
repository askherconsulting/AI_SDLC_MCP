# AI SDLC MCP

A minimal Node + Express web application with a health check endpoint. Created in under an hour.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser:
   - Main page: http://localhost:3000
   - Health check: http://localhost:3000/health

## Endpoints

- `GET /` - Simple welcome page
- `GET /health` - Health check endpoint (returns JSON with status and timestamp)

## MCP Server Configuration

This project includes configurations for multiple MCP (Model Context Protocol) servers. All configurations are located in `.cursor/mcp.json` for easy management.

### Configured MCP Servers

1. **GitHub MCP Server**
   - Package: `@modelcontextprotocol/server-github`
   - Command: `npx -y @modelcontextprotocol/server-github`
   - Environment Variables: `GITHUB_PERSONAL_ACCESS_TOKEN` (required - add your token)

2. **Playwright MCP Server**
   - Package: `@playwright/mcp@latest`
   - Command: `npx -y @playwright/mcp@latest`
   - Provides browser automation capabilities

3. **Vibium MCP Server**
   - Package: `vibium`
   - Command: `npx -y vibium mcp`
   - Type: `stdio`
   - Provides browser automation features

4. **WordPress MCP Server**
   - Package: `@modelcontextprotocol/server-wordpress`
   - Command: `npx -y @modelcontextprotocol/server-wordpress`
   - Environment Variables:
     - `WORDPRESS_URL` (required - your WordPress site URL)
     - `WORDPRESS_USERNAME` (required - your WordPress username)
     - `WORDPRESS_APPLICATION_PASSWORD` (required - WordPress application password)

### Setup Instructions

1. The configuration file (`.cursor/mcp.json`) is excluded from version control (see `.gitignore`) as it contains local development settings.

2. **For GitHub MCP Server:**
   - Create a GitHub Personal Access Token with appropriate permissions
   - Add the token to the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable in `.cursor/mcp.json`

3. **For WordPress MCP Server:**
   - Add your WordPress site URL, username, and application password to the respective environment variables in `.cursor/mcp.json`
   - Note: Use an Application Password, not your regular WordPress password

4. **Restart Cursor** after making any changes to the MCP configuration for the changes to take effect.

All MCP servers will be automatically available when using Cursor with MCP support.