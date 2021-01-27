import axios from 'axios'
import { deepMerge, findGetParameter } from '@/utils/helpers'
import optionsDefault from '@/config/options-default'
import { getType } from '@/store/subscription'

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
  response_url,
}) {
  amount = Math.round(amount * 100) || 0

  return {
    options: {
      title: name,
      subscription: {
        type: getType(button_type === 'recurring', recurring_state),
        quantity: recurring_type === 'quantity',
        unlimited: recurring_type === 'period',
        trial: recurring_trial,
        readonly: recurring_readonly,
      },
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
    },
    fields: Object.values(fields).map(parseField),
    amount_readonly: Boolean(amount_readonly),
  }
}

function parseField({ value, name, label, hidden, required, valid = {} }) {
  let { pattern, min_length, max_length } = valid
  let rules = {}
  if (required) rules.required = required
  if (pattern) rules.regex = pattern
  if (min_length) rules.min = min_length
  if (max_length) rules.max = max_length

  return {
    value,
    name,
    label,
    placeholder: '',
    componentName: hidden ? 'input-hidden' : 'f-form-group',
    custom: true,
    rules,
    autocomplete: 'on',
  }
}

export const getLabel = name => {
  if (!config.fields) return
  if (!config.fields[name]) return
  return config.fields[name].label
}
