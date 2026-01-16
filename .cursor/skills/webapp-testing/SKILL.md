---
name: ai-sdlc-mcp-webapp
description: Guidance for working on the Node+Express app with health checks,
  image uploads, and Playwright/Vibium tests.
---

# AI SDLC MCP Webapp Skill

Use this skill when you are modifying the Node + Express app, its upload flow,
or its end-to-end tests. Follow the instructions and guidelines to keep the
behavior and test suites in sync.

## Instructions

- Keep the app running during tests: `npm start` in a separate terminal.
- Validate and preserve the upload flow (multipart form to `/pictures/upload`).
- Ensure uploaded images are served from `/uploads` and appear on `/pictures`.
- Keep health check semantics stable: `GET /health` returns JSON with status
  and timestamp.

## Examples

- "Add a new gallery view" -> update `/pictures` HTML and add tests in both
  `tests/playwright/` and `tests/vibium/`.
- "Tighten upload validation" -> update the multer `fileFilter`, then add a
  failing upload test (wrong type or size) in both frameworks.
- "Change the health payload" -> update the endpoint and both test suites to
  match the new JSON shape.

## Guidelines

- Keep Playwright and Vibium tests in feature parity.
- Use `tests/helpers.ts` for shared logic whenever possible.
- Respect current limits: only image types, 10MB max.
- Prefer stable selectors in tests; avoid brittle DOM queries.
- If adding a new endpoint, add a corresponding test and update docs.
