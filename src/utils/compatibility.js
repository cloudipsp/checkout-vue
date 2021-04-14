import configMethods from '@/config/methods.json'
import { removeDuplicate, includes, excludes } from '@/utils/helpers'
import { isExist } from '@/utils/typeof'

const config = {
  trustly: 'banklinks_eu',
}

export const methods = (user, server, disable) => {
  server = server.map(mapped)

  return user
    .map(mapped)
    .filter(includes(server))
    .concat(server)
    .concat(['wallets'])
    .filter(onlyConfig)
    .filter(removeDuplicate)
    .filter(excludes(disable.map(mapped)))
}

export const tabs = (obj = {}) => {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => {
      name = mapped(name)
      return [name, parse(value, name)]
    })
  )
}

function onlyConfig(item) {
  return configMethods.includes(item)
}

function mapped(item) {
  return config[item] || item
}

function parse(value, method) {
  value.payment_systems = Object.fromEntries(
    Object.entries(value.payment_systems).map(([id, value]) => [
      id,
      {
        ...value,
        method,
        id,
        logo: logo(value, id),
        iban: id.split('|')[1] || '',
      },
    ])
  )
  return value
}

function logo({ country, bank_logo }, id) {
  if (isExist(bank_logo)) {
    return (
      bank_logo || (isGermany(country) ? 'germanonlinebanktransfer' : 'no_logo')
    )
  } else {
    return id
  }
}

function isGermany(country) {
  return country === 'DE'
}
