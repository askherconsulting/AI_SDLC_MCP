---
name: ai-sdlc-mcp-vibium-testing
description: Guidance for creating or modifying Vibium Tests.
---

# AI SDLC MCP Webapp Testing Skill

Use this skill when you are modifying the Node + Express app's end-to-end tests. Follow the instructions and guidelines to keep the
behavior and test suites in sync.

## Instructions

- Keep the app running during tests: `npm start` in a separate terminal.
- Validate and preserve the upload flow (multipart form to `/pictures/upload`).
- Ensure uploaded images are served from `/uploads` and appear on `/pictures`.
- Keep health check semantics stable: `GET /health` returns JSON with status
  and timestamp.

## Examples

- "Add a new gallery view" -> update `/pictures` HTML and add tests in only `tests/vibium/`.


## Guidelines

- Only write Vibium tests - do not write playwright tests.
- Use `tests/helpers.ts` for shared logic whenever possible.
- Respect current limits: only image types, 10MB max.
- Prefer stable selectors in tests; avoid brittle DOM queries.
- If adding a new endpoint, add a corresponding test and update docs.
