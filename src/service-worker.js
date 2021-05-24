const install = () => {
  if ('serviceWorker' in navigator && ENVIRONMENT === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(PUBLIC_PATH + 'sw.js')
    })
  }
}

export default { install }
