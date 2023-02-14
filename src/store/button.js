import { loadAxios } from '@/import'
import { deepMerge } from '@/utils/helpers'
import optionsDefault from '@/config/options-default'
import { getType } from '@/store/subscription'
import { parse, createDate } from '@/utils/date'
import configSubscription from '@/config/subscription'
import { sort } from '@/utils/sort'

export default function (api_domain, button, button_body) {
  if (button_body.token)
    return Promise.resolve(button_body).then(parseOptions, () => {})
  if (!button) return Promise.resolve()

  let domain = `https://${api_domain}`
  if (ENVIRONMENT === 'development') domain = ''

  return loadAxios()
    .then(axios => axios.get(`${domain}/buttons/${button}.json`))
    .then(({ data }) => data)
    .then(parseOptions, () => {})
}

function parseOptions({
  name,
  fields = {},
  amount,
  params = {},
  currency,
  currencies = [],
  merchant_id,
  lang,
  amount_readonly,
  recurring = {},
  recurring_readonly,
  recurring_state,
  recurring_trial,
  recurring_type,
  button_type,
  response_url,
  expire,
  status,
  host,
  token,
}) {
  amount = Math.round(amount * 100) || 0

  if (!currencies.includes(currency)) {
    currencies.unshift(currency)
  }

  if (expire && parse(expire, 'DD.MM.YYYY hh:mm') < createDate())
    return Promise.reject('button_expired')
  console.log(status)
  if (status && status !== 'enabled')
    return Promise.reject('button_status_not_active')

  return {
    options: {
      title: name,
      subscription: {
        quantity: recurring_type === 'quantity',
        unlimited: recurring_type === 'period',
        trial: recurring_trial,
        readonly: recurring_readonly,
      },
      api_domain: host,
      amount_readonly: Boolean(amount_readonly),
    },
    params: {
      ...params,
      amount,
      currency,
      merchant_id,
      lang,
      recurring_data: {
        ...deepMerge({}, optionsDefault.params.recurring_data, recurring),
        amount: Math.round(recurring.amount * 100) || amount,
      },
      response_url,
      button: token,
    },
    fields: Object.values(fields).sort(sort('p')).map(parseField),
    subscription:
      configSubscription[getType(button_type === 'recurring', recurring_state)],
    currencies,
  }
}

function parseField({
  value = '',
  name,
  label,
  placeholder,
  hidden,
  required,
  valid = {},
  readonly,
}) {
  let { pattern, min_length, max_length } = valid
  let rules = {}
  if (required) rules.required = required
  if (pattern) rules.regex = pattern
  if (min_length) rules.min = min_length
  if (max_length) rules.max = max_length

  let noLabelFloating = Boolean(
    (label && placeholder) || (!label && !placeholder)
  )

  return {
    value,
    name,
    noLabelFloating,
    label: label || placeholder,
    placeholder: noLabelFloating ? placeholder : '',
    componentName: hidden ? 'input-hidden' : 'f-form-group',
    custom: true,
    rules,
    autocomplete: 'on',
    readonly,
    disabled: readonly,
  }
}
