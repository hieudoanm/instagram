import { getImages } from '@instagram/sdk';
import { createServer } from 'node:http';

const imageUrlToBase64 = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get('content-type');
    const blob: Blob = await response.blob();
    const buffer: ArrayBuffer = await blob.arrayBuffer();
    const base64: string = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image:', error);
    return null;
  }
};

const server = createServer((request, response) => {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

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

        const { browser, images: imageUrls = [] } = await getImages(url);
        await browser.close();
        console.log('imageUrls', imageUrls);

        const images = [];
        for (const imageUrl of imageUrls) {
          const image = await imageUrlToBase64(imageUrl);
          images.push(image);
        }

        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify({ error: null, images }));
      } catch (error) {
        console.error(error);
        response.writeHead(400, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify({ error, images: [] }));
      }
    });
  } else {
    response.writeHead(404, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT: number = parseInt(process.env.PORT ?? '8080') ?? 8080;

// starts a simple http server locally on port 3000
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on 127.0.0.1:${PORT}`);
});
