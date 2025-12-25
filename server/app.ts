import express from 'express';
import os from 'os';
import cors from 'cors';
import client from 'prom-client';

const app = express();
const port = 3000;

const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['method', 'route', 'status'],
});

register.registerMetric(httpDuration);

app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    end({ status: res.statusCode });
  });
  next();
});

app.get('/info', cors(), (req, res) => {
  const cpu = [];
  cpu.push(os.cpus());

  setTimeout(() => {
    cpu.push(os.cpus());

    res.json({
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: cpu,
      uptime: os.uptime(),
    });
  }, 1000);
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`);
});
