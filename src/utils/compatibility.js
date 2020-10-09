import configMethods from '@/config/methods.json'
import { removeDuplicate } from '@/utils/helpers'

const config = {
  trustly: 'banklinks_eu',
}

export const methods = (user, server, disable) => {
  server = server.map(mapped)

  return user
    .map(mapped)
    .filter(includes(server))
    .concat(server)
    .filter(onlyConfig)
    .filter(removeWallets)
    .filter(removeDuplicate)
    .filter(excludes(disable))
}

export const tabs = arr => {
  return Object.fromEntries(
    Object.entries(arr).map(([name, value]) => {
      name = mapped(name)
      return [name, parse(value, name)]
    })
  )
}

function includes(list) {
  return item => list.includes(item)
}

function onlyConfig(item) {
  return configMethods.includes(item)
}

function removeWallets(item) {
  return item !== 'wallets'
}

function mapped(item) {
  return config[item] || item
}

function excludes(list) {
  return item => !list.includes(item)
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
