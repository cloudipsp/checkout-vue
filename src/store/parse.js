import configMethods from '@/config/methods.json'
import { removeDuplicate, includes, excludes } from '@/utils/helpers'
import { isExist } from '@/utils/inspect'
import { sort } from '@/utils/sort'
import { mappingMethod } from '@/config/mapping-method'

export const methods = (user, server = [], disable) => {
  server = server.map(mapped)
  user = user.map(mapped)
  disable = disable.map(mapped)

  return user
    .filter(includes(server))
    .concat(server)
    .filter(onlyConfig)
    .filter(removeDuplicate)
    .filter(excludes(disable))
}

export const tabs = (tabs = {}) => {
  let result = Object.entries(tabs).map(([name, { payment_systems }]) => {
    name = mapped(name)
    return [name, parse(payment_systems, name)]
  })
  let allPaymentSystems = result.reduce(
    (accum, [, payment_systems]) => [
      ...accum,
      ...Object.values(payment_systems),
    ],
    []
  )
  let most_popular = allPaymentSystems.filter(
    ({ user_priority, country_priority }) =>
      user_priority > 0 || country_priority > 0
  )

  if (most_popular.length) {
    if (allPaymentSystems.some(({ id }) => id === 'card')) {
      most_popular.push({
        id: 'card',
        method: 'card',
        logo: 'card',
        name: 'credit_debit_cards',
        user_priority: 99,
        country: 'XX',
      })
    }
    result.push([
      'most_popular',
      Object.fromEntries(most_popular.map(item => [item.id, item])),
    ])
  }

  return Object.fromEntries(result)
}

export const tabs_order = (tabs_order = [], { most_popular }) => {
  if (most_popular) {
    tabs_order.unshift('most_popular')
  }
  tabs_order.push('wallets')
  return tabs_order
}

export const most_popular_icons = ({ most_popular }) =>
  most_popular
    ? Object.values(most_popular)
        .sort(sort('country_priority'))
        .sort(sort('user_priority', true))
        .slice(0, 10)
    : []

function onlyConfig(item) {
  return configMethods.includes(item)
}

function mapped(item) {
  return mappingMethod[item] || item
}

function parse(systems, method) {
  return Object.fromEntries(
    Object.entries(systems).map(([id, value]) => [
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
