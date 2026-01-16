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
   - Pictures page: http://localhost:3000/pictures
   - Health check: http://localhost:3000/health

## Testing

This project supports testing with both **Playwright** and **Vibium** browser automation frameworks.

### Running Tests

**Run all tests (both frameworks):**
```bash
npm test
```

**Run only Playwright tests:**
```bash
npm run test:playwright
```

**Run only Vibium tests:**
```bash
npm run test:vibium
```

**Run both frameworks sequentially:**
```bash
npm run test:all
```

### First-Time Setup for Playwright

If you encounter errors when running Playwright tests, you may need to install the browser binaries:

```bash
npx playwright install
```

The tests will automatically display a helpful message if browsers are not installed.

> **Note:** The server must be running before executing tests. Start it with `npm start` in a separate terminal.

For more details about the test structure, see [tests/README.md](tests/README.md).

## Endpoints

- `GET /` - Home dashboard with navigation and status summary
- `GET /pictures` - Image gallery with upload form
- `POST /pictures/upload` - Upload endpoint for image files
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

### Setup Instructions

1. The configuration file (`.cursor/mcp.json`) is excluded from version control (see `.gitignore`) as it contains local development settings.

2. **For GitHub MCP Server:**
   - Create a GitHub Personal Access Token with appropriate permissions
   - Add the token to the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable in `.cursor/mcp.json`

3. **Restart Cursor** after making any changes to the MCP configuration for the changes to take effect.

All MCP servers will be automatically available when using Cursor with MCP support.