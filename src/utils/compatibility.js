export function methods(arr) {
  return arr
    .map(item => (item === 'trustly' ? 'banklinks_eu' : item))
    .filter((item, key, self) => self.indexOf(item) === key)
}

export function tabs(arr) {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => [
      name === 'trustly' ? 'banklinks_eu' : name,
      value,
    ])
  )
}
