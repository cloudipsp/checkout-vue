import {
  commithash,
  branch,
  environment,
  dsn,
  isDevelopment,
} from '@/config/config'
import * as Sentry from '@sentry/vue'

const install = Vue => {
  if (!dsn) return

  Sentry.init({
    Vue,
    dsn,
    release: branch,
    autoSessionTracking: false,
    logErrors: isDevelopment,
    environment,
  })

  Sentry.setTag('commithash', commithash)
}

export default { install }

export const captureMessage = (message, level, extra) => {
  if (!dsn) return

  Sentry.captureMessage(message, {
    level,
    extra,
  })
}
