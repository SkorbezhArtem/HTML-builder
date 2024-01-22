const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const charset = 'utf-8';
const filePath = path.join(__dirname, fileName);

const readStream = fs.createReadStream(filePath, charset);

readStream.on('readable', () => {
  let chunk;
  while ((chunk = readStream.read()) !== null) {
    console.log('\x1b[36m%s\x1b[0m', chunk.trim());
  }
});

readStream.on('error', (error) => {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `Error reading the file: ${error.message}`,
  );
});
