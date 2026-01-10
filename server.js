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
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
  }
  .container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  }
  h1 {
    margin-top: 0;
    font-size: 2.5em;
  }
  p {
    font-size: 1.2em;
    line-height: 1.6;
  }
  .endpoint {
    background: rgba(255, 255, 255, 0.2);
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    font-family: 'Courier New', monospace;
  }
  nav {
    margin-bottom: 20px;
  }
  nav a {
    color: white;
    text-decoration: none;
    margin-right: 20px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    transition: background 0.3s;
  }
  nav a:hover {
    background: rgba(255, 255, 255, 0.3);
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
      <div class="container">
        <nav>
          <a href="/">Home</a>
          <a href="/pictures">Pictures</a>
        </nav>
        <h1>Welcome to AI SDLC MCP</h1>
        <p>This is a minimal Node + Express web application.</p>
        <div class="endpoint">
          <strong>Health Check:</strong> <a href="/health" style="color: #fff;">/health</a>
        </div>
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
        .upload-section {
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        input[type="file"] {
          padding: 10px;
          border-radius: 8px;
          border: 2px dashed rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
        }
        input[type="file"]::file-selector-button {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          cursor: pointer;
          margin-right: 10px;
        }
        button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .gallery-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.3s;
        }
        .gallery-item:hover {
          transform: scale(1.05);
        }
        .gallery-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        .message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          background: rgba(76, 175, 80, 0.3);
        }
        .error {
          background: rgba(244, 67, 54, 0.3);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <nav>
          <a href="/">Home</a>
          <a href="/pictures">Pictures</a>
        </nav>
        <h1>Welcome to the Pictures page</h1>
        
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
