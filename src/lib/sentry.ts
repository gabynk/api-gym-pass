import { env } from '@/env';
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    Sentry.fastifyIntegration(),
    Sentry.httpIntegration(),
    Sentry.prismaIntegration(),
  ],
  environment: env.NODE_ENV,
  sendDefaultPii: true,
});

export { Sentry };