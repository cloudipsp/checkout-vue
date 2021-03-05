import configMethods from '@/config/methods.json'
import {
  removeDuplicate,
  includes,
  excludes,
  findGetParameter,
} from '@/utils/helpers'
import Model from '@/class/model'
import { isExist } from '@/utils/typeof'
import configTheme from '@/config/theme'

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
  }

  compatibility() {
    this.subscription()
    this.email()
    this.button()
  }

  configDefault() {
    this.showMenuFirst()
    this.preset()
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

  email() {
    let sender_email = this.data.params?.sender_email

    if (!sender_email) return

    this.data.params.email = sender_email

    delete this.data.params.sender_email
  }

  button() {
    let button = findGetParameter('button') || this.data.params?.button
    if (!button) return

    this.attr('data.params.button', button)
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

  preset() {
    const preset = this.data.options?.theme?.preset
    const theme = this.data.options?.theme?.type

    if (preset || !theme) return

    this.attr('data.options.theme.preset', configTheme[theme])
  }

  removeOldSubscription() {
    delete this.data.regular
  }
}

class PriorityUserConfig extends Model {
  constructor(data) {
    super()
    this.data = data
  }

  init() {
    this.token()
  }

  token() {
    let token = findGetParameter('token') || this.data.params?.token
    if (!token) return

    this.attr('data.params.token', token)
  }
}

export const correctingUserConfig = config =>
  new CorrectingUserConfig(config).init()

export const priorityUserConfig = config =>
  new PriorityUserConfig(config).init()
