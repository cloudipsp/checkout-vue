import {
  init,
  browserTracingIntegration,
  replayIntegration,
  setTag,
  captureMessage as msg,
} from '@sentry/vue'

const enable = SENTRY_DSN && DOMAIN === location.hostname

export const install = router => Vue => {
  if (!enable) return

  init({
    Vue,
    dsn: SENTRY_DSN,
    integrations: [browserTracingIntegration({ router }), replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: BRANCH,
    environment: ENVIRONMENT,
  })

  setTag('commithash', COMMITHASH)
}

export const captureMessage = (message, level, extra) => {
  if (!enable) return

  msg(message, {
    level,
    extra,
  })
}
