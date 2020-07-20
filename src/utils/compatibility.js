import configMethods from '@/config/methods'

export const methods = arr => {
  return arr
    .map(item => (item === 'trustly' ? 'banklinks_eu' : item))
    .filter((item, key, self) => self.indexOf(item) === key)
    .filter(item => configMethods.includes(item))
}

export const tabs = arr => {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => [
      name === 'trustly' ? 'banklinks_eu' : name,
      value,
    ])
  )
}
