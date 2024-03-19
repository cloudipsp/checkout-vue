const latin = 'a-zA-Z'
const cyrillic = 'а-яА-ЯёЁїЇіІєЄґҐ'
const cyrillicCapital = 'а-щэюяА-ЩЭЮЯёЁїЇіІєЄґҐ'
const symbols = '\'"ʼ\\-,./'

const tokens = {
  '#': { pattern: /\d/ },
  X: { pattern: /[0-9X]/ },
  C: {
    pattern: new RegExp(`[${latin}${cyrillicCapital}]`),
    transform: v => v.toUpperCase(),
  },
  c: {
    pattern: new RegExp(`[${latin}${cyrillic}${symbols}]`),
  },
  '!': { escape: true },
}

export const mask = (value = '', mask, masked = true, last) => {
  if (!mask) return value

  value = String(value)
  let iMask = 0
  let iValue = 0
  let output = ''
  let valueLength = value.length + (last ? 1 : 0)
  while (iMask < mask.length && iValue < valueLength) {
    let cMask = mask[iMask]
    let masker = tokens[cMask]
    let cValue = value[iValue]
    if (masker && !masker.escape) {
      if (cValue && masker.pattern.test(cValue)) {
        output += masker.transform ? masker.transform(cValue) : cValue
        iMask++
      }
      iValue++
    } else {
      if (masker && masker.escape) {
        iMask++ // take the next mask char and treat it as char
        cMask = mask[iMask]
      }
      if (masked) output += cMask
      if (cValue === cMask) iValue++ // user typed the same char
      iMask++
    }
  }

  // fix mask that ends with a char: (#)
  let restOutput = ''
  while (iMask < mask.length && masked) {
    let cMask = mask[iMask]
    if (tokens[cMask]) {
      restOutput = ''
      break
    }
    restOutput += cMask
    iMask++
  }

  return output + restOutput
}
