import mobile from 'ismobilejs'

export const isPhone = mobile().phone

export const isMobile = mobile().any

export const isDesktop = !mobile().any

export const isMobileFirefox = mobile().other.firefox
