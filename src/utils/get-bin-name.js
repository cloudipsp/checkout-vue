import bins from '@/config/bins.json'

export const getBinName = value => {
  return Object.entries(bins).reduce((result, [name, bin]) => {
    if (result) return result

    const regexp = new RegExp(`^(${bin.join('|')})`)
    if (!regexp.test(value)) return
    return name
  }, '')
}
