import app from './src/app.js';
import { config } from './src/config/env.js';
import {startScheduler} from "./src/scheduler/index.ts";

const PORT = config.PORT;

app.listen(PORT, async () => {
  console.log(`StatusPing API running on port ${PORT}`);
  await startScheduler();
});
