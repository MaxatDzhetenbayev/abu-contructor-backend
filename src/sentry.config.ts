import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { ConfigService } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot({ isGlobal: true });
const configService = new ConfigService();

const sentryDsn = configService.get<string>("SENTRY_DSN");

Sentry.init({
  dsn: sentryDsn,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0
});

Sentry.profiler.startProfiler();

Sentry.startSpan(
  {
    name: "My First Transaction"
  },
  () => {
  }
);

Sentry.profiler.stopProfiler();