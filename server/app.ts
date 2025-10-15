import express from 'express';
import os from 'os';
const app = express();
const port = 3000;

app.get('/metrics', (req, res) => {
  const metrics = {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpus: os.cpus().length,
    uptime: os.uptime(),
  };
  res.json(metrics);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
