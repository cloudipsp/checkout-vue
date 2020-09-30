import configMethods from '@/config/methods.json'

export const methods = (methods, methods_disabled) => {
  return methods
    .filter(item => configMethods.includes(item))
    .map(item => (item === 'trustly' ? 'banklinks_eu' : item))
    .filter((item, key, self) => self.indexOf(item) === key)
    .filter(item => !methods_disabled.includes(item))
}

export const tabs = arr => {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => [
      name === 'trustly' ? 'banklinks_eu' : name,
      value,
    ])
  )
}
