import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from 'dotenv';

dotenv.config();

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan(
  {
    name: 'My First Transaction',
  },
  () => {},
);

Sentry.profiler.stopProfiler();
