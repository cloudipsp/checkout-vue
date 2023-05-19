import { findGetParameter } from '@/utils/helpers'
import Model from '@/class/model'
import { isPlainObject, isExist } from '@/utils/inspect'
import configTheme from '@/config/theme'
import descriptor from '@/schema/descriptor'
import { captureMessage } from '@/sentry'
import { loadAsyncValidator } from '@/import'
import { sort } from '@/utils/sort'
import { parseFieldsCustom } from '@/store/button'

class Validate extends Model {
  constructor(data) {
    super()
    this.data = data
  }

  init() {
    this.format(this.data)
    this.compatibility()
    this.configDefault()
    return this.validate().then(this.afterValidate.bind(this))
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

  format(options) {
    let regex = /[A-Z]+/g

    if (!isPlainObject(options)) return

    for (let prop in options) {
      if (['messages', 'validate'].includes(prop)) continue
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        let modified = prop.replace(regex, function (match) {
          return '_' + match.toLowerCase()
        })
        if (prop !== modified) {
          if (Object.prototype.hasOwnProperty.call(options, modified)) continue
          options[modified] = options[prop]
          delete options[prop]
          this.format(options[modified])
        } else {
          this.format(options[prop])
        }
      }
    }
  }

  validate() {
    return loadAsyncValidator()
      .then(Schema => new Schema(descriptor).validate({ config: this.data }))
      .catch(({ errors }) => {
        errors = errors.map(({ message }) => message)
        captureMessage('config', 'info', errors)

        return Promise.reject(errors)
      })
  }

  afterValidate() {
    this.token()
    this.fieldsCustom()
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
    if (!this.attr('data.options.active_tab')) return

    this.attr('data.options.show_menu_first', false)
  }

  preset() {
    const preset = this.data.options?.theme?.preset
    const theme = this.data.options?.theme?.type

    if (isExist(preset) || !theme) return

    this.attr('data.options.theme.preset', configTheme[theme])
  }

  removeOldSubscription() {
    delete this.data.regular
  }

  token() {
    let token = findGetParameter('token') || this.data.params?.token
    if (!token) return

    if (this.data.params) {
      delete this.data.params.amount
      delete this.data.params.currency
    }

    if (this.data.options) {
      delete this.data.options.amount_readonly
    }

    this.attr('data.params.token', token)
  }

  fieldsCustom() {
    let fields_custom = this.data.fields_custom

    if (!fields_custom) return

    this.attr(
      'data.fields_custom',
      Object.values(fields_custom).sort(sort('p')).map(parseFieldsCustom)
    )
  }
}

export default config => new Validate(config)
