import { init, setTag, captureMessage as msg } from '@sentry/vue'

const enable = DSN && DOMAIN === location.hostname

export const install = Vue => {
  if (!enable) return

  init({
    Vue,
    dsn: DSN,
    release: BRANCH,
    autoSessionTracking: false,
    logErrors: ENVIRONMENT === 'development',
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
