import i18n from '@/i18n'

export const sort = (arr, field, reverse) => {
  reverse = reverse ? -1 : 1
  return arr.sort((a, b) => {
    if (String.prototype.localeCompare) {
      return a[field].localeCompare(b[field], i18n.locale) * reverse
    } else {
      return (a[field] < b[field] ? -1 : 1) * reverse
    }
  })
}
