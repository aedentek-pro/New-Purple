import { createServer } from 'http';
import { createApp } from './app';
import { connectDatabase } from './config/db';
import { env } from './config/env';

const bootstrap = async () => {
  await connectDatabase();
  const app = createApp();
  const server = createServer(app);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

void bootstrap();

