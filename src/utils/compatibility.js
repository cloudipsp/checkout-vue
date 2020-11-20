import configMethods from '@/config/methods.json'
import { removeDuplicate, includes, excludes } from '@/utils/helpers'
import Model from '@/class/model'
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
    .filter(excludes(disable))
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
        bank_logo: bankLogo(value),
        iban: id.split('|')[1] || '',
      },
    ])
  )
  return value
}

function bankLogo({ country, bank_logo }) {
  return (
    bank_logo || (isGermany(country) ? 'germanonlinebanktransfer' : 'no_logo')
  )
}

function isGermany(country) {
  return country === 'DE'
}

class CorrectingUserConfig extends Model {
  constructor(data) {
    super()
    this.data = data
  }

  init() {
    this.compatibility()
    this.configDefault()

    return this.data
  }

  compatibility() {
    this.subscription()
  }

  configDefault() {
    this.showMenuFirst()
  }

  subscription() {
    let oldSubscription = this.attr('data.regular')
    let newSubscription = this.attr('data.options.subscription')

    if (!oldSubscription) return
    if (newSubscription) return this.removeOldSubscription()

    const insert = oldSubscription.insert
    const open = oldSubscription.open
    const type = insert
      ? open
        ? 'shown_edit_on'
        : 'shown_edit_off'
      : 'disabled'

    this.attr('data.options.subscription.type', type)
    this.attr('data.options.subscription.periods', oldSubscription.period)

    this.removeOldSubscription()
  }

  showMenuFirst() {
    const options = 'data.options'
    const name = `${options}.show_menu_first`
    let show_menu_first = this.attr(name)
    let full_screen = this.attr(`${options}.full_screen`)

    if (!isExist(full_screen)) return
    if (isExist(show_menu_first)) return

    this.attr(name, !full_screen)
  }

  removeOldSubscription() {
    delete this.data.regular
  }
}

export const correctingUserConfig = config =>
  new CorrectingUserConfig(config).init()
