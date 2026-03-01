import express from 'express';
import { requestLogger } from './middleware/requestLogger.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { servicesRouter } from './modules/services/index.ts';
import { checksRouter } from './modules/checks/index.ts';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/services', servicesRouter);
app.use('/api/checks', checksRouter);

app.use(errorHandler);

export default app;