import configMethods from '@/config/methods.json'
import { filterDuplicate } from '@/utils/helpers'

export const methods = (methods, methods_disabled) => {
  return methods
    .filter(item => configMethods.includes(item))
    .map(item => (item === 'trustly' ? 'banklinks_eu' : item))
    .filter(filterDuplicate)
    .filter(item => !methods_disabled.includes(item))
}

export const tabs = arr => {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => [
      name === 'trustly' ? 'banklinks_eu' : name,
      parse(value, name),
    ])
  )
}

function parse(value, method) {
  value.payment_systems = Object.fromEntries(
    Object.entries(value.payment_systems).map(([id, value]) => [
      id,
      {
        ...value,
        method,
        id,
        bank_logo: value.bank_logo || 'no_logo',
        iban: id.split('|')[1] || '',
      },
    ])
  )
  return value
}
