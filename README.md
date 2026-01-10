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
