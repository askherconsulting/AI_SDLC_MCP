const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable strict routing to enforce exact path matching
app.set('case sensitive routing', true);
app.set('strict routing', true);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Shared styles for consistent look
const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
  :root {
    color-scheme: dark;
    --bg: #07070f;
    --ink: #e7f6ff;
    --muted: #8fb2c9;
    --neon: #4bf7ff;
    --neon-2: #f88cff;
    --panel: rgba(8, 10, 20, 0.78);
    --panel-strong: rgba(14, 18, 32, 0.92);
    --border: rgba(75, 247, 255, 0.45);
    --border-soft: rgba(231, 246, 255, 0.16);
    --shadow: 0 24px 70px rgba(4, 5, 12, 0.7);
    --chrome: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(190, 214, 230, 0.95) 20%,
      rgba(120, 140, 165, 0.95) 45%,
      rgba(230, 240, 250, 0.98) 65%,
      rgba(90, 108, 130, 0.92) 85%,
      rgba(245, 250, 255, 0.98) 100%
    );
    --chrome-dark: linear-gradient(
      135deg,
      rgba(40, 52, 70, 0.9) 0%,
      rgba(130, 150, 175, 0.85) 25%,
      rgba(16, 24, 40, 0.95) 55%,
      rgba(185, 205, 225, 0.8) 80%,
      rgba(30, 40, 60, 0.9) 100%
    );
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Space Mono', monospace;
    margin: 0;
    min-height: 100vh;
    color: var(--ink);
    background:
      radial-gradient(circle at 15% 10%, rgba(75, 247, 255, 0.2), transparent 40%),
      radial-gradient(circle at 85% 20%, rgba(248, 140, 255, 0.18), transparent 45%),
      linear-gradient(135deg, rgba(7, 7, 15, 0.96), rgba(8, 10, 20, 0.92)),
      var(--bg);
    position: relative;
  }
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(75, 247, 255, 0.09) 1px, transparent 1px),
      linear-gradient(90deg, rgba(75, 247, 255, 0.09) 1px, transparent 1px);
    background-size: 60px 60px;
    opacity: 0.35;
    pointer-events: none;
    z-index: -2;
  }
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    background-image: repeating-linear-gradient(
      0deg,
      rgba(231, 246, 255, 0.04),
      rgba(231, 246, 255, 0.04) 1px,
      transparent 1px,
      transparent 3px
    );
    opacity: 0.35;
    pointer-events: none;
    z-index: -1;
  }
  a {
    color: inherit;
  }
  .page-shell {
    max-width: 1120px;
    margin: 0 auto;
    padding: 28px 20px 70px;
  }
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }
  .brand {
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-transform: uppercase;
    letter-spacing: 0.28em;
    font-size: 0.68rem;
    color: var(--muted);
  }
  .brand strong {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.7rem;
    letter-spacing: 0.14em;
    color: var(--ink);
    text-shadow: 0 0 14px rgba(75, 247, 255, 0.45);
  }
  .nav {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .nav a {
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid rgba(231, 246, 255, 0.3);
    background: linear-gradient(120deg, rgba(20, 24, 36, 0.7), rgba(12, 14, 28, 0.9));
    box-shadow:
      inset 0 1px 0 rgba(231, 246, 255, 0.2),
      inset 0 -1px 0 rgba(12, 18, 32, 0.8);
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .nav a:hover {
    transform: translateY(-1px);
    border-color: rgba(75, 247, 255, 0.6);
    box-shadow: 0 0 16px rgba(75, 247, 255, 0.25);
  }
  .container {
    background: var(--panel);
    border-radius: 26px;
    padding: 34px;
    border: 1px solid rgba(231, 246, 255, 0.22);
    box-shadow: var(--shadow);
    backdrop-filter: blur(18px);
    position: relative;
    overflow: hidden;
  }
  .container::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(120deg, rgba(255, 255, 255, 0.05), transparent 45%),
      radial-gradient(circle at 20% 10%, rgba(75, 247, 255, 0.12), transparent 35%);
    pointer-events: none;
    z-index: 0;
  }
  .container > * {
    position: relative;
    z-index: 1;
  }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 26px;
    align-items: stretch;
  }
  h1,
  h2,
  h3 {
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
  }
  h1 {
    margin: 12px 0 10px;
    font-size: 2.6rem;
    text-shadow: 0 0 18px rgba(248, 140, 255, 0.35);
  }
  h2 {
    margin: 0 0 12px;
    font-size: 1.4rem;
  }
  p {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--muted);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid rgba(231, 246, 255, 0.55);
    background: var(--chrome-dark);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #dfefff;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.08);
  }
  .hero-panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .panel {
    background: var(--panel-strong);
    border: 1px solid rgba(231, 246, 255, 0.2);
    border-radius: 18px;
    padding: 18px;
    box-shadow:
      inset 0 0 0 1px rgba(248, 140, 255, 0.06),
      inset 0 1px 0 rgba(231, 246, 255, 0.16);
  }
  .panel-title {
    margin: 0 0 10px;
    font-size: 1.05rem;
  }
  .route {
    background: rgba(12, 18, 32, 0.75);
    border: 1px dashed rgba(231, 246, 255, 0.4);
    padding: 12px 14px;
    border-radius: 12px;
    font-size: 0.9rem;
    box-shadow: inset 0 0 8px rgba(231, 246, 255, 0.08);
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }
  .meta-item {
    border: 1px solid rgba(231, 246, 255, 0.22);
    border-radius: 14px;
    padding: 12px;
    background: rgba(8, 12, 24, 0.65);
  }
  .meta-item strong {
    display: block;
    font-size: 1.05rem;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 18px;
  }
  .button,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    border-radius: 12px;
    border: 1px solid rgba(231, 246, 255, 0.65);
    background: var(--chrome);
    color: #0b111a;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
  }
  .button:hover,
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(75, 247, 255, 0.35);
  }
  .button.ghost {
    background: var(--chrome-dark);
    color: #dfefff;
  }
  .section-title {
    margin-top: 28px;
    font-size: 1.2rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 18px;
  }
  .card {
    background: rgba(9, 13, 28, 0.78);
    border: 1px solid rgba(231, 246, 255, 0.22);
    border-radius: 18px;
    padding: 18px;
    box-shadow: inset 0 0 0 1px rgba(75, 247, 255, 0.08);
  }
  .upload-section {
    background: rgba(9, 13, 28, 0.85);
    padding: 20px;
    border-radius: 18px;
    border: 1px solid rgba(231, 246, 255, 0.28);
    margin: 26px 0 20px;
  }
  .upload-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  input[type="file"] {
    padding: 12px;
    border-radius: 12px;
    border: 2px dashed rgba(231, 246, 255, 0.45);
    background: rgba(8, 12, 24, 0.7);
    color: var(--ink);
    cursor: pointer;
  }
  input[type="file"]::file-selector-button {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    background: var(--chrome);
    color: #0b111a;
    cursor: pointer;
    margin-right: 10px;
    font-weight: 600;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  .gallery-item {
    background: rgba(9, 13, 28, 0.82);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(231, 246, 255, 0.22);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .gallery-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 30px rgba(75, 247, 255, 0.18);
  }
  .gallery-item img {
    width: 100%;
    height: auto;
    display: block;
  }
  .message {
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    background: rgba(75, 247, 255, 0.18);
    border: 1px solid rgba(75, 247, 255, 0.4);
  }
  .error {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
  }
  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }
    .meta-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .container {
      padding: 24px;
    }
  }
  @media (max-width: 600px) {
    .app-header {
      flex-direction: column;
      align-items: flex-start;
    }
    .meta-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Simple page at root
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI SDLC MCP</title>
      <style>${sharedStyles}</style>
    </head>
    <body>
      <div class="page-shell">
        <header class="app-header">
          <div class="brand">
            Retro Lab
            <strong>AI SDLC MCP</strong>
          </div>
          <nav class="nav">
            <a href="/">Home</a>
            <a href="/pictures">Pictures</a>
          </nav>
        </header>
        <main class="container">
          <section class="hero">
            <div>
              <span class="badge">Retro-Future Node Core</span>
              <h1>Welcome to AI SDLC MCP</h1>
              <p>Monitor health telemetry, route status, and image intake from a single neon console built for rapid preflight checks.</p>
              <div class="cta-row">
                <a class="button" href="/pictures">Launch gallery</a>
                <a class="button ghost" href="/health">Run health scan</a>
              </div>
              <div class="meta-grid">
                <div class="meta-item">
                  <strong>10MB</strong>
                  Payload cap
                </div>
                <div class="meta-item">
                  <strong>4</strong>
                  Formats online
                </div>
                <div class="meta-item">
                  <strong>2</strong>
                  Core routes
                </div>
              </div>
            </div>
            <div class="hero-panel">
              <div class="panel">
                <h3 class="panel-title">Telemetry port</h3>
                <p>Verify system status in JSON before any automated launch sequence.</p>
                <div class="route">
                  <strong>GET</strong> <a href="/health">/health</a>
                </div>
              </div>
              <div class="panel">
                <h3 class="panel-title">Payload intake</h3>
                <p>Single-file uploads land in local storage and sync instantly to the gallery wall.</p>
                <div class="route">
                  <strong>POST</strong> /pictures/upload
                </div>
              </div>
            </div>
          </section>
          <h2 class="section-title">Mission modules</h2>
          <div class="grid">
            <div class="card">
              <h3>Docking control</h3>
              <p>Accept only JPG, PNG, GIF, and WEBP assets with clear caps for stable intake.</p>
            </div>
            <div class="card">
              <h3>Visual telemetry</h3>
              <p>Review media instantly in a bright gallery grid without leaving the console.</p>
            </div>
            <div class="card">
              <h3>Test ready</h3>
              <p>Health route stays reliable for Playwright and Vibium preflight runs.</p>
            </div>
          </div>
        </main>
      </div>
    </body>
    </html>
  `);
});

// Pictures page
app.get('/pictures', (req, res) => {
  // Get list of uploaded images
  const images = fs.readdirSync(uploadsDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .map(file => `/uploads/${file}`);
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pictures - AI SDLC MCP</title>
      <style>
        ${sharedStyles}
      </style>
    </head>
    <body>
      <div class="page-shell">
        <header class="app-header">
          <div class="brand">
            Retro Lab
            <strong>AI SDLC MCP</strong>
          </div>
          <nav class="nav">
            <a href="/">Home</a>
            <a href="/pictures">Pictures</a>
          </nav>
        </header>
        <main class="container">
          <section class="hero">
            <div>
              <span class="badge">Media Gallery</span>
              <h1>Welcome to the Pictures page</h1>
              <p>Upload assets with confidence and review the full set in a continuous grid. Each image stores locally and appears instantly.</p>
              <div class="meta-grid">
                <div class="meta-item">
                  <strong>1</strong>
                  Single payload
                </div>
                <div class="meta-item">
                  <strong>Auto</strong>
                  Auto refresh
                </div>
                <div class="meta-item">
                  <strong>Safe</strong>
                  Image-only filter
                </div>
              </div>
            </div>
            <div class="hero-panel">
              <div class="panel">
                <h3 class="panel-title">Supported formats</h3>
                <p>JPG, PNG, GIF, and WEBP files up to 10MB each.</p>
                <div class="route">Tip: drag files into the picker to upload faster.</div>
              </div>
              <div class="panel">
                <h3 class="panel-title">Gallery behavior</h3>
                <p>Every upload refreshes instantly so you can validate image quality and staging.</p>
              </div>
            </div>
          </section>
          <div class="upload-section">
            <h2>Upload Pictures</h2>
            <form class="upload-form" action="/pictures/upload" method="POST" enctype="multipart/form-data">
              <input type="file" name="picture" accept="image/*" required>
              <button type="submit">Upload Picture</button>
            </form>
          </div>
          <div class="gallery">
            ${images.length > 0 
              ? images.map(img => `<div class="gallery-item"><img src="${img}" alt="Uploaded picture"></div>`).join('')
              : '<p>No pictures uploaded yet. Upload your first picture above!</p>'
            }
          </div>
        </main>
      </div>
    </body>
    </html>
  `);
});

// Handle picture upload
app.post('/pictures/upload', upload.single('picture'), (req, res) => {
  if (!req.file) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="3;url=/pictures">
        <title>Upload Error</title>
        <style>${sharedStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="message error">Error: No file uploaded or invalid file type. Redirecting...</div>
        </div>
      </body>
      </html>
    `);
  }
  res.redirect('/pictures');
});

// Export for Vercel serverless functions
module.exports = app;

// Start server locally (only if not in Vercel environment)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
