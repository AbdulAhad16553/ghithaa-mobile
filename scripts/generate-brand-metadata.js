const fs = require('fs');
const path = require('path');

const {
  compositeImagesAsync,
  generateFaviconAsync,
  generateImageAsync,
  generateImageBackgroundAsync,
} = require('@expo/image-utils');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const WORDMARK = path.join(ASSETS, 'splash', 'ghithaa-wordmark.png');
const BRAND = path.join(ASSETS, 'brand', 'ghithaa-logo.png');
const SPLASH_BG = '#2C666E';
const ICON_BG = '#2C666E';

async function squareIcon({ size, logoSrc, logoWidth, backgroundColor }) {
  const background = await generateImageBackgroundAsync({
    width: size,
    height: size,
    backgroundColor,
  });

  const { source: logo } = await generateImageAsync(
    { projectRoot: ROOT, cacheType: 'metadata-brand' },
    {
      src: logoSrc,
      width: logoWidth,
      height: Math.round(logoWidth / (764 / 256)),
      resizeMode: 'contain',
      backgroundColor: 'transparent',
    },
  );

  const x = Math.round((size - logoWidth) / 2);
  const y = Math.round((size - Math.round(logoWidth / (764 / 256))) / 2);

  return compositeImagesAsync({ background, foreground: logo, x, y });
}

async function write(fileName, buffer) {
  const target = path.join(ASSETS, fileName);
  await fs.promises.writeFile(target, buffer);
  console.log('wrote', fileName);
}

async function main() {
  const icon1024 = await squareIcon({
    size: 1024,
    logoSrc: WORDMARK,
    logoWidth: 760,
    backgroundColor: ICON_BG,
  });
  await write('icon.png', icon1024);
  await write('splash-icon.png', icon1024);

  const adaptiveFg = await squareIcon({
    size: 1024,
    logoSrc: WORDMARK,
    logoWidth: 700,
    backgroundColor: 'transparent',
  });
  await write('android-icon-foreground.png', adaptiveFg);

  const adaptiveBg = await generateImageBackgroundAsync({
    width: 1024,
    height: 1024,
    backgroundColor: SPLASH_BG,
  });
  await write('android-icon-background.png', adaptiveBg);

  const mono = await generateImageAsync(
    { projectRoot: ROOT, cacheType: 'metadata-brand-mono' },
    {
      src: WORDMARK,
      width: 512,
      height: Math.round(512 / (764 / 256)),
      resizeMode: 'contain',
      backgroundColor: 'transparent',
    },
  );
  await write('android-icon-monochrome.png', mono.source);

  const favicon = await generateFaviconAsync(icon1024);
  await write('favicon.png', favicon);

  const webIcon = await generateImageAsync(
    { projectRoot: ROOT, cacheType: 'metadata-brand-web' },
    {
      src: BRAND,
      width: 320,
      height: Math.round(320 / (404 / 125)),
      resizeMode: 'contain',
      backgroundColor: 'transparent',
    },
  );
  await write('web-icon.png', webIcon.source);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
