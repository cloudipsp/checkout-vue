import configLocales from '@/config/locales.json'
import methods from '@/config/methods.json'
import period from '@/config/subscription-period.json'
import configCountries from '@umpirsky/country-list/data/en/country.json'
import rules from 'async-validator/es/rule/'
import cssVariable from '@/config/css-variable'
import configCardBrands from '@/config/card-brands'
import configPresets from '@/config/presets'
import configTheme from '@/config/theme'
import configOptionsDefault from '@/config/options-default'
import configSubscription from '@/config/subscription'
import configExcludeMessages from '@/config/exclude-messages'

const countries = Object.keys(configCountries)
const cardIcons = Object.keys(configCardBrands)
const YN = ['Y', 'N', 'y', 'n']
const verificationType = ['amount', 'code']
const theme = Object.keys(configTheme)
const preset = Object.keys(configPresets)
const locales = Object.keys(configLocales)
const options = Object.keys(configOptionsDefault.options)
const endpoint = Object.keys(configOptionsDefault.options.endpoint)
const subscription = Object.keys(configOptionsDefault.options.subscription)
const recurring_data = Object.keys(configOptionsDefault.params.recurring_data)
const subscriptionType = Object.keys(configSubscription)
const config = ['options', 'params', 'messages', 'validate', 'css_variable']
const patternUrlImg = /^(http(s)?:\/\/|(url\()?data:image\/[\w+;]+?,)/

function enumArray(array) {
  return {
    type: 'array',
    validator(rule, value, callback, source, options) {
      if (
        !rule.required &&
        !Object.prototype.hasOwnProperty.call(source, rule.field)
      )
        return callback()
      let errors = []
      if (Array.isArray(value)) {
        value.forEach(function (item) {
          if (array.includes(item)) return
          errors.push(
            [
              rule.fullField,
              item,
              'is not equal to one of',
              array.join(', '),
            ].join(' ')
          )
        })
      } else {
        rules.type(rule, value, source, errors, options)
      }
      callback(errors)
    },
  }
}

function enumObject(array) {
  return {
    type: 'object',
    fields: {},
    validator(rule, value = {}, callback) {
      let errors = []
      Object.keys(value).forEach(item => {
        if (array.includes(item)) return
        errors.push(
          [
            rule.fullField,
            item,
            'is not equal to one of',
            array.join(', '),
          ].join(' ')
        )
      })
      callback(errors)
    },
  }
}

function excludeObject(array) {
  return {
    type: 'object',
    validator(rule, value = {}, callback) {
      let errors = []
      Object.keys(value).forEach(item => {
        if (!array.includes(item)) return
        errors.push(
          [
            rule.fullField,
            item,
            'should not include one of',
            array.join(', '),
          ].join(' ')
        )
      })
      callback(errors)
    },
  }
}

function validatorToken() {
  return {
    validator(rule, value, callback, source) {
      let errors = []
      if (source.token && rule.field in source) {
        errors.push(
          [
            'Parameter',
            rule.fullField,
            "can't be modified when token is used.",
          ].join(' ')
        )
      }
      callback(errors)
    },
  }
}

function conflictTokenButton() {
  return {
    validator(rule, value, callback, { token, button }) {
      callback(
        token && button
          ? "Conflict error: order token and button token can't be used concurrently."
          : []
      )
    },
  }
}

function validatorCurrencyRequired() {
  return {
    validator(rule, value, callback, { token, button }) {
      let errors = []
      if (!token && !button && !value) {
        errors.push([rule.fullField, 'is required'].join(' '))
      }
      callback(errors)
    },
  }
}

function validatorNotEmpty() {
  return {
    validator(rule, value, callback) {
      let errors = []
      if (value === '' || value === null) {
        errors.push(['Parameter', rule.fullField, "can't be empty."].join(' '))
      }
      callback(errors)
    },
  }
}

let messages = enumObject(locales)

locales.forEach(function (locale) {
  messages.fields[locale] = {
    ...excludeObject(configExcludeMessages),
    fields: {
      offerta_url: { type: 'url' },
    },
  }
})

let validate = enumObject(locales)

locales.forEach(function (locale) {
  validate.fields[locale] = {
    type: 'object',
  }
})

const cssVariableKeys = Object.keys(
  cssVariable({
    type: 'light',
    preset: configTheme['light'],
  })
)

let css_variable = enumObject(cssVariableKeys)

const configCssVariable = {
  card_img: {
    type: 'string',
    pattern: patternUrlImg,
  },
}

cssVariableKeys.forEach(item => {
  css_variable.fields[item] = configCssVariable[item] || [
    validatorNotEmpty(),
    {
      type: 'string',
      pattern: /^#[0-9a-fA-F]{6}$/,
    },
  ]
})

export default {
  config: {
    ...enumObject(config),
    fields: {
      options: {
        ...enumObject(options),
        fields: {
          methods: enumArray(methods),
          methods_disabled: enumArray(methods),
          card_icons: enumArray(cardIcons),
          fields: { type: 'boolean' },
          title: { type: 'string' },
          link: { type: 'url' },
          full_screen: { type: 'boolean' },
          button: { type: 'boolean' },
          locales: enumArray(locales),
          email: { type: 'boolean' },
          api_domain: { type: 'string' },
          endpoint: {
            ...enumObject(endpoint),
            fields: {
              gateway: { type: 'string' },
              button: { type: 'string' },
            },
          },
          fee: { type: 'boolean' },
          active_tab: { type: 'enum', enum: methods },
          logo_url: {
            type: 'string',
            pattern: patternUrlImg,
          },
          offerta_url: { type: 'url' },
          default_country: { type: 'enum', enum: countries },
          countries: enumArray(countries),
          theme: {
            ...enumObject(['type', 'preset']),
            fields: {
              type: { type: 'enum', enum: theme },
              preset: { type: 'enum', enum: preset },
            },
          },
          disable_request: { type: 'boolean' },
          show_button_amount: { type: 'boolean' },
          subscription: {
            ...enumObject(subscription),
            fields: {
              type: { type: 'enum', enum: subscriptionType },
              periods: enumArray(period),
              quantity: { type: 'boolean' },
              trial: { type: 'boolean' },
              unlimited: { type: 'boolean' },
              readonly: { type: 'boolean' },
            },
          },
        },
      },
      params: {
        type: 'object',
        fields: {
          merchant_id: { type: 'integer', max: 999999999999 },
          order_desc: { type: 'string', max: 1024 },
          amount: [{ type: 'integer', max: 999999999999 }, validatorToken()],
          currency: [
            { type: 'string' },
            validatorToken(),
            validatorCurrencyRequired(),
          ],
          response_url: { type: 'url' },
          lang: { type: 'enum', enum: locales },
          required_rectoken: { type: 'enum', enum: YN },
          verification: { type: 'enum', enum: YN },
          verification_type: { type: 'enum', enum: verificationType },
          token: [{ type: 'string', len: 40 }, conflictTokenButton()],
          button: { type: 'string', min: 20, max: 80 },
          offer: { type: 'boolean' },
          recurring_data: {
            ...enumObject(recurring_data),
            fields: {
              period: { type: 'enum', enum: period },
              every: { type: 'integer' },
              start_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
              end_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
              amount: { type: 'integer' },
              quantity: { type: 'integer' },
              trial_period: { type: 'string' },
              trial_quantity: { type: 'integer' },
            },
          },
          custom: { type: 'object' },
          customer_data: { type: 'object' },
        },
      },
      messages,
      validate,
      css_variable,
    },
  },
}
