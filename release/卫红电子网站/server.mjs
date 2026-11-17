import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
};
const address = 'http://127.0.0.1:4173';

const server = createServer(async (request, response) => {
  if (request.method === 'POST' && request.url.split('?')[0] === '/__restart') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }).end('{"restarting":true}');
    restartLater();
    return;
  }

  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  try {
    const { pathname } = new URL(request.url, address);
    const path = decodeURIComponent(pathname);
    if (path.includes('\\') || path.includes('\0')) {
      response.writeHead(400).end();
      return;
    }
    const file = resolve(root, `.${path}${path.endsWith('/') ? 'index.html' : ''}`);
    if (!file.startsWith(resolve(root) + sep)) {
      response.writeHead(404).end();
      return;
    }
    const type = contentTypes[extname(file)];
    if (!type) {
      response.writeHead(404).end();
      return;
    }
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': type, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    const status = error instanceof URIError ? 400
      : ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500;
    response.writeHead(status).end();
  }
});

let listenRetries = 40;
function restartLater() {
  setTimeout(() => {
    spawn(process.execPath, [fileURLToPath(import.meta.url)], {
      detached: true, stdio: 'ignore', cwd: process.cwd(),
    }).unref();
    setTimeout(() => process.exit(0), 250);
  }, 100);
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && listenRetries-- > 0) {
    setTimeout(() => {
      server.close();
      server.listen(4173, '127.0.0.1');
    }, 250);
    return;
  }
  console.error(error.code === 'EADDRINUSE' ? '本地端口 4173 已被占用。' : error.message);
  process.exitCode = 1;
});
server.listen(4173, '127.0.0.1', () => console.log(`上海卫红网站已启动  ${address}/`));
