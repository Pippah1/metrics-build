import express from 'express';
import os from 'os';
import cors from 'cors';
const app = express();
const port = 3000;

app.get('/metrics', cors(), (req, res) => {
  const cpu = [];

  cpu.push(os.cpus());

  setTimeout(() => {
    cpu.push(os.cpus());

    const metrics = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: cpu,
      uptime: os.uptime(),
    };
    res.json(metrics);

  }, 1000);
});

app.listen(port, '0.0.0.0', () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
