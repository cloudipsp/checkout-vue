import i18n from '@/i18n'
import { isString } from '@/utils/inspect'

export const sort = (field, reverse) => {
  reverse = reverse ? -1 : 1
  return (a, b) => {
    if (isString(a[field]) && String.prototype.localeCompare) {
      return a[field].localeCompare(b[field], i18n.locale) * reverse
    } else {
      return (a[field] < b[field] ? -1 : 1) * reverse
    }
  }
}

export const parseSelect = item => ({
  value: item,
  text: i18n.t(String(item)),
})
