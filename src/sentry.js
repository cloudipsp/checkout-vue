import {
  commithash,
  branch,
  environment,
  dsn,
  isDevelopment,
  domain,
} from '@/config/config'
import { loadSentry } from '@/import'

const enable = dsn && domain === location.hostname

const install = Vue => {
  if (!enable) return

  loadSentry().then(({ init, setTag }) => {
    init({
      Vue,
      dsn,
      release: branch,
      autoSessionTracking: false,
      logErrors: isDevelopment,
      environment,
    })

    setTag('commithash', commithash)
  })
}

export default { install }

export const captureMessage = (message, level, extra) => {
  if (!enable) return

  loadSentry().then(({ captureMessage }) => {
    captureMessage(message, {
      level,
      extra,
    })
  })
}
