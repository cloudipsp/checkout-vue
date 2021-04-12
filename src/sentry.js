import { loadSentry } from '@/import'

const enable = DSN && DOMAIN === location.hostname

const install = Vue => {
  if (!enable) return

  loadSentry().then(({ init, setTag }) => {
    init({
      Vue,
      dsn: DSN,
      release: BRANCH,
      autoSessionTracking: false,
      logErrors: ENVIRONMENT === 'development',
      environment: ENVIRONMENT,
    })

    setTag('commithash', COMMITHASH)
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
