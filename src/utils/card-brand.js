import { loadCardBrands } from '@/import'

export const getCardBrand = value => {
  return loadCardBrands().then(cardBrands =>
    Object.entries(cardBrands).reduce((result, [img, bin]) => {
      if (result) return result

      const regexp = new RegExp(`^(${bin.join('|')})`)
      if (!regexp.test(value)) return
      return img
    }, '')
  )
}

export const cardsParse = data => {
  return Promise.all(
    data
      .map(parse)
      .reduce((accum, item) => accum.concat(setCardBrand(item)), [])
  )
}

function parse(item) {
  let card_number = item.card_number.replace(/ /g, '')
  let expiry_date = item.expiry_date.replace(/ /g, '')
  return {
    ...item,
    card_number,
    expiry_date,
  }
}

function setCardBrand(item) {
  return getCardBrand(item.card_number).then(card_brand => ({
    ...item,
    card_brand,
  }))
}
