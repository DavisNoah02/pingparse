import app from './src/app.js';
import { config } from './src/config/env.js';

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`StatusPing API running on port ${PORT}`);
});