import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default defineConfig({
  server: {
    port: 5173,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 1. Endpoint to upload and save a new HTML website
        if (req.method === 'POST' && req.url === '/api/upload') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const filename = data.filename;
              const htmlContent = data.html;

              if (!filename || !htmlContent) {
                throw new Error("Missing filename or html content.");
              }

              // Sanitize filename: allow letters, numbers, hyphens, underscores, and dots
              const safeName = filename.replace(/[^a-zA-Z0-9\-_.]/g, '');
              if (!safeName.endsWith('.html')) {
                throw new Error("Only .html files are permitted.");
              }

              const projectsDir = path.join(process.cwd(), 'public/projects');
              if (!fs.existsSync(projectsDir)) {
                fs.mkdirSync(projectsDir, { recursive: true });
              }

              const filePath = path.join(projectsDir, safeName);

              // Save the website code
              fs.writeFileSync(filePath, htmlContent);
              console.log(`[Server] Saved new website file: ${filePath}`);

              // Execute screenshot script in the background to capture the first frame
              exec(`node screenshot.js`, (err, stdout, stderr) => {
                if (err) {
                  console.error('[Server] Screenshot capture error:', err.message);
                } else {
                  console.log('[Server] Screenshot previews updated successfully.');
                }
              });

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, filename: safeName }));
            } catch (err) {
              console.error('[Server] Upload error:', err.message);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } 
        // 2. Endpoint to fetch the current list of website files dynamically
        else if (req.method === 'GET' && req.url === '/api/projects') {
          try {
            const projectsDir = path.join(process.cwd(), 'public/projects');
            if (fs.existsSync(projectsDir)) {
              const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.html'));
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(files));
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify([]));
            }
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        } 
        else {
          next();
        }
      });
    }
  }
});
