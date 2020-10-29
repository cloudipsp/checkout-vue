import axios from 'axios'
import { findGetParameter } from '@/utils/helpers'

let config = {}

export default function () {
  let button = findGetParameter('button')
  if (!button) return Promise.resolve()

  return axios
    .get(`/buttons/${button}.json`)
    .then(response => {
      config = response.data
      return response.data
    })
    .then(parseOptions)
}

function parseOptions({
  host,
  name,
  fields = {},
  amount,
  params = {},
  currency,
  merchant_id,
  lang,
  amount_readonly,
  recurring = {},
  recurring_readonly,
  recurring_state,
  recurring_trial,
  recurring_type,
  button_type,
}) {
  amount = amount * 100
  return {
    options: {
      api_domain: host,
      title: name,
      subscription: {
        type:
          button_type === 'recurring'
            ? recurring_state
              ? 'shown_edit_on'
              : 'shown_edit_off'
            : 'disable',
        quantity: recurring_type === 'quantity',
        unlimited: recurring_type === 'period',
        trial: recurring_trial,
      },
    },
    params: {
      ...params,
      amount,
      currency,
      merchant_id,
      lang,
      recurring_data: {
        ...recurring,
        readonly: recurring_readonly,
      },
      recurring: recurring_state ? 'y' : 'n',
    },
    fields: Object.values(fields).map(parseField),
    amount_readonly: Boolean(amount_readonly),
  }
}

function parseField(attrs) {
  let { hidden, required, valid = {} } = attrs
  const component = hidden ? 'input-hidden' : 'input-text'
  let validate = {}
  if (required) validate.required = required
  if (valid.pattern) validate.regex = valid.pattern
  if (valid.min_length) validate.min = valid.min_length
  if (valid.max_length) validate.max = valid.max_length

  return {
    ...attrs,
    placeholder: '',
    component,
    custom: true,
    validate,
    autocomplete: 'on',
  }
}

export const getLabel = name => {
  if (!config.fields) return
  if (!config.fields[name]) return
  return config.fields[name].label
}
