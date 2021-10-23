import ismobilejs from 'ismobilejs'

const mobile = ismobilejs()

export const isPhone = mobile.phone

export const isMobile = mobile.any

export const isDesktop = !mobile.any

export const isIOS =
  mobile.apple.phone || mobile.apple.tablet || mobile.apple.ipod
