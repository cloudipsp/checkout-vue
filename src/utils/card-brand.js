import config from '@/config/card-brands'

const getCardBrand = value => {
  return Object.entries(config).reduce((result, [img, bin]) => {
    if (result) return result

    const regexp = new RegExp(`^(${bin.join('|')})`)
    if (!regexp.test(value)) return
    return img
  }, '')
}

export default getCardBrand
