import configMethods from '@/config/methods.json'
import { removeDuplicate } from '@/utils/helpers'

export const methods = (methods, methods_disabled) => {
  return methods
    .filter(onlyConfig)
    .filter(removeWallets)
    .map(renameTrustly)
    .filter(removeDuplicate)
    .filter(applyDisabled(methods_disabled))
}

export const tabs = arr => {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => [
      name === 'trustly' ? 'banklinks_eu' : name,
      parse(value, name),
    ])
  )
}

function onlyConfig(item) {
  return configMethods.includes(item)
}

function removeWallets(item) {
  return item !== 'wallets'
}

function renameTrustly(item) {
  return item === 'trustly' ? 'banklinks_eu' : item
}

function applyDisabled(methods_disabled) {
  return item => !methods_disabled.includes(item)
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
