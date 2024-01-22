const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const consoleColor = '\x1b[36m%s\x1b[0m';
const outputFile = new fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a',
});

process.on('exit', () => {
  console.log(consoleColor, 'Goodbye, my friend!');
});

console.log(consoleColor, 'Enter your text:');

rl.on('line' || 'SIGINT', (data) => {
  String(data).trim() !== 'exit'
    ? outputFile.write(`${data}\n`)
    : process.exit();
});
