import { getImages } from '@instagram/common';
import { createServer } from 'node:http';

const server = createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/download') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    request.on('end', async () => {
      try {
        console.log('Received Data:', body);
        const jsonData = JSON.parse(body); // Parse JSON
        console.log('Received JSON:', jsonData);
        const { url = '' } = jsonData;

        const { browser, images = [] } = await getImages(url);
        await browser.close();
        console.log('images', images);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: null, images }));
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error, images: [] }));
      }
    });
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT: number = parseInt(process.env.PORT || '8080') ?? 8080;

// starts a simple http server locally on port 3000
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on 127.0.0.1:${PORT}`);
});
