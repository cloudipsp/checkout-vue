export const hasWindowSupport = typeof window !== 'undefined'
export const hasDocumentSupport = typeof document !== 'undefined'
export const hasNavigatorSupport = typeof navigator !== 'undefined'

export const isBrowser =
  hasWindowSupport && hasDocumentSupport && hasNavigatorSupport

export const hasCssVariableSupport =
  isBrowser &&
  window.CSS &&
  window.CSS.supports &&
  window.CSS.supports('(--a: 0)')
