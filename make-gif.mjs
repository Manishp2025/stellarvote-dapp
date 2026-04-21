import GIFEncoder from 'gif-encoder-2';
import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const INPUT_DIR = 'C:\\Users\\harsh\\OneDrive\\Desktop\\stellar-demo-screenshots';
const OUTPUT = 'C:\\Users\\harsh\\OneDrive\\Desktop\\stellar-vote-demo.gif';

const files = [
  '01-landing.png',
  '02-after-connect.png',
  '03-voted.png',
  '04-champion-added.png',
  '05-final.png',
].map(f => path.join(INPUT_DIR, f));

(async () => {
  console.log('Reading first image for dimensions...');
  const first = await Jimp.read(files[0]);
  const width = first.bitmap.width;
  const height = first.bitmap.height;

  const encoder = new GIFEncoder(width, height, 'neuquant', true);
  const writeStream = fs.createWriteStream(OUTPUT);
  encoder.createReadStream().pipe(writeStream);

  encoder.start();
  encoder.setRepeat(0);  // 0 = loop forever
  encoder.setDelay(2000); // 2 seconds per frame
  encoder.setQuality(10);

  for (const file of files) {
    console.log('Adding frame:', path.basename(file));
    const img = await Jimp.read(file);
    encoder.addFrame(img.bitmap.data);
  }

  encoder.finish();
  console.log('\n✅ GIF saved to:', OUTPUT);
  console.log('Upload this to Imgur or Google Drive to get a shareable link!');
})();
