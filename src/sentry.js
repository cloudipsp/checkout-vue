import {
  commithash,
  branch,
  environment,
  dsn,
  isDevelopment,
} from '@/config/config'
import { loadSentry } from '@/import'

const install = Vue => {
  if (!dsn) return

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
  if (!dsn) return

  loadSentry().then(({ captureMessage }) => {
    captureMessage(message, {
      level,
      extra,
    })
  })
}
