import express from 'express';
import path from 'path';

const __dirname = path.resolve();
const app = express();

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/sdk/index.js', (_req, res) => {
  res.sendFile(path.join(__dirname, './node_modules/chainengine-sdk-front/dist/index.js'));
});

app.listen(8080);

console.log(`👏 Server started on  http://localhost:8080`);
