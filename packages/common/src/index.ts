import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import readline from 'node:readline';
import figlet from 'figlet';
import puppeteer, { Browser } from 'puppeteer';

const addZero = (i: number): string => (i > 9 ? `${i}` : `0${i}`);

const downloadImage = async ({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) => {
  const response = await fetch(url);
  if (!response.ok) console.error(`Failed to fetch: ${response.statusText}`);
  const buffer = await response.arrayBuffer(); // Convert to buffer
  writeFileSync(filename, Buffer.from(buffer));
};

const readlineSync = async (question: string): Promise<string> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${question}: `, (answer: string) => {
      resolve(answer);
      rl.close();
    });
  });
};

const createFolder = (folderPath: string) => {
  if (existsSync(folderPath)) {
    rmSync(folderPath, { recursive: true, force: true });
    console.info('Folder removed!');
  }

  // Create the folder again
  mkdirSync(folderPath);
  console.info('Folder created again!');
};

export const getImages = async (
  instagramURL: string
): Promise<{ browser: Browser; images: string[] }> => {
  // Open Page
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const [url] = instagramURL.split('?');
  const embedURL: string = url.at(-1) === '/' ? `${url}embed` : `${url}/embed`;
  console.info(embedURL);
  await page.goto(embedURL, { waitUntil: 'networkidle2', timeout: 60000 });
  // Check Next Button
  let buttonExists: boolean =
    (await page.$('button[aria-label="Next"]')) !== null;
  console.info('Check if button exists', buttonExists);
  while (buttonExists) {
    await page.waitForSelector('[aria-label="Next"]', { visible: true });
    await page.click('[aria-label="Next"]');
    buttonExists = (await page.$('button[aria-label="Next"]')) !== null;
    console.info('Check if button exists', buttonExists);
  }
  console.info('Done checking if button exists');
  // Get all Images
  const images = await page.evaluate(() => {
    const imageElements: NodeListOf<HTMLImageElement> =
      document.querySelectorAll('.Content.EmbedFrame img');
    const images: string[] = [];
    for (const imageElement of imageElements) {
      images.push(imageElement.src);
    }
    console.log();
    return images;
  });
  console.info('images');
  return { browser, images };
};

export const validate = (url: string): boolean => {
  const pattern: RegExp =
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+\/?$/;
  return pattern.test(url);
};

export const download = async () => {
  // Input
  figlet('Instagram CLI');
  const instagramURL: string = await readlineSync('Instagram URL');
  const instagramFolder: string = await readlineSync('Instagram Folder');

  const validated = validate(instagramURL);

  if (!validated) {
    throw new Error('Invalid URL');
  }

  // Download
  createFolder(instagramFolder);
  const data = await getImages(instagramURL);
  const { browser, images = [] } = data;
  console.log(images);
  for (let i = 0; i < images.length; i++) {
    const image: string = images[i];
    if (image.includes('data:image')) {
      const imageString: string = image.replace('data:image/png;base64,', '');
      const buffer: Buffer<ArrayBuffer> = Buffer.from(imageString, 'base64');
      writeFileSync(`./temp/${addZero(i)}.png`, buffer);
    } else if (image.includes('http')) {
      await downloadImage({ url: image, filename: `./temp/${addZero(i)}.jpg` });
    }
  }
  await browser.close();
  process.exit(0);
};
