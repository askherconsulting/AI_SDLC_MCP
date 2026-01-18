const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

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
  :root {
    color-scheme: dark;
    --bg: #0b1020;
    --panel: rgba(255, 255, 255, 0.08);
    --panel-strong: rgba(255, 255, 255, 0.16);
    --border: rgba(255, 255, 255, 0.18);
    --text: #f8fafc;
    --muted: #cbd5f5;
    --accent: #7c9dff;
    --accent-2: #a855f7;
    --success: #22c55e;
    --danger: #ef4444;
    --shadow: 0 20px 50px rgba(15, 23, 42, 0.35);
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top left, rgba(124, 157, 255, 0.25), transparent 55%),
      radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.25), transparent 45%),
      var(--bg);
    color: var(--text);
  }
  body::before {
    content: "";
    position: fixed;
    inset: -20% -10% auto;
    height: 45vh;
    background: linear-gradient(120deg, rgba(124, 157, 255, 0.15), rgba(168, 85, 247, 0.1));
    filter: blur(80px);
    z-index: -1;
  }
  a {
    color: inherit;
  }
  .page-shell {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px 60px;
  }
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 32px;
  }
  .brand {
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: var(--muted);
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
    background: var(--panel);
    border: 1px solid var(--border);
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .nav a:hover {
    background: var(--panel-strong);
    border-color: rgba(124, 157, 255, 0.4);
  }
  .container {
    background: var(--panel);
    border-radius: 24px;
    padding: 32px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    backdrop-filter: blur(14px);
  }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    gap: 24px;
    align-items: stretch;
  }
  h1 {
    margin: 12px 0;
    font-size: 2.4rem;
  }
  h2 {
    margin: 0 0 12px;
    font-size: 1.4rem;
  }
  p {
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--muted);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(124, 157, 255, 0.15);
    border: 1px solid rgba(124, 157, 255, 0.35);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .hero-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 18px;
  }
  .card h3 {
    margin: 0 0 8px;
    font-size: 1.1rem;
  }
  .endpoint {
    background: rgba(124, 157, 255, 0.18);
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px dashed rgba(124, 157, 255, 0.5);
    font-family: 'Courier New', monospace;
  }
  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }
  .button,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    border-radius: 12px;
    border: 1px solid rgba(124, 157, 255, 0.4);
    background: linear-gradient(135deg, rgba(124, 157, 255, 0.35), rgba(168, 85, 247, 0.35));
    color: var(--text);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .button:hover,
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(124, 157, 255, 0.25);
  }
  .button.ghost {
    background: transparent;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .stat {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px;
  }
  .stat strong {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  .section-title {
    margin-top: 28px;
    font-size: 1.2rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 20px;
  }
  .upload-section {
    background: rgba(255, 255, 255, 0.08);
    padding: 20px;
    border-radius: 16px;
    border: 1px solid var(--border);
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
    border: 2px dashed rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
    cursor: pointer;
  }
  input[type="file"]::file-selector-button {
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    background: rgba(124, 157, 255, 0.35);
    color: var(--text);
    cursor: pointer;
    margin-right: 10px;
  }
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  .gallery-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: transform 0.3s;
  }
  .gallery-item:hover {
    transform: translateY(-4px);
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
    background: rgba(34, 197, 94, 0.2);
    border: 1px solid rgba(34, 197, 94, 0.4);
  }
  .error {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
  }
  @media (max-width: 900px) {
    .hero {
      grid-template-columns: 1fr;
    }
    .stats {
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
    .stats {
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
          <div class="brand">AI SDLC MCP</div>
          <nav class="nav">
            <a href="/">Home</a>
            <a href="/pictures">Pictures</a>
          </nav>
        </header>
        <main class="container">
          <section class="hero">
            <div>
              <span class="badge">Express + Node</span>
              <h1>Welcome to AI SDLC MCP</h1>
              <p>Ship, test, and validate uploads with a clean Express baseline. The UI keeps the focus on health checks and media workflows.</p>
              <div class="cta-row">
                <a class="button" href="/pictures">Browse pictures</a>
                <a class="button ghost" href="/health">Health check</a>
              </div>
            </div>
            <div class="hero-card">
              <div class="card">
                <h3>System status</h3>
                <p>Verify the service is online before uploading. The endpoint returns JSON with status and timestamp.</p>
                <div class="endpoint">
                  <strong>Health Check:</strong> <a href="/health">/health</a>
                </div>
              </div>
              <div class="stats">
                <div class="stat">
                  <strong>10MB</strong>
                  <span>Upload limit</span>
                </div>
                <div class="stat">
                  <strong>4</strong>
                  <span>Image formats</span>
                </div>
                <div class="stat">
                  <strong>2</strong>
                  <span>Core routes</span>
                </div>
              </div>
            </div>
          </section>
          <h2 class="section-title">What you can do</h2>
          <div class="grid">
            <div class="card">
              <h3>Upload media</h3>
              <p>Collect JPG, PNG, GIF, and WEBP files and review them instantly on the Pictures page.</p>
            </div>
            <div class="card">
              <h3>Monitor health</h3>
              <p>Hit the JSON endpoint to confirm the API is running before automated tests.</p>
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
          <div class="brand">AI SDLC MCP</div>
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
              <p>Upload and review images in one place. Each file is saved to local storage and instantly appears in the gallery.</p>
            </div>
            <div class="hero-card">
              <div class="card">
                <h3>Supported formats</h3>
                <p>JPG, PNG, GIF, and WEBP files up to 10MB each.</p>
                <div class="endpoint">Tip: drag files into the picker to upload faster.</div>
              </div>
              <div class="stats">
                <div class="stat">
                  <strong>1</strong>
                  <span>File per upload</span>
                </div>
                <div class="stat">
                  <strong>Auto</strong>
                  <span>Gallery refresh</span>
                </div>
                <div class="stat">
                  <strong>Safe</strong>
                  <span>Image-only filter</span>
                </div>
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
