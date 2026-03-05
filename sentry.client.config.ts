import * as Sentry from "@sentry/astro";

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.PUBLIC_BUILD_ENV,
    release: import.meta.env.PUBLIC_SENTRY_RELEASE,
  });
}
