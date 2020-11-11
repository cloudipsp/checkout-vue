import axios from 'axios'
import { deepMerge, findGetParameter } from '@/utils/helpers'
import optionsDefault from '@/config/options-default'
import { isBoolean, isString } from '@/utils/typeof'
import configSubscription from '@/config/subscription'

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
}) {
  amount = Math.round(amount * 100) || 0

  let type

  if (button_type === 'recurring') {
    if (isBoolean(recurring_state)) {
      type = recurring_state ? 'shown_edit_on' : 'shown_edit_off'
    } else if (
      isString(recurring_state) &&
      recurring_state in configSubscription
    ) {
      type = recurring_state
    } else {
      type = 'shown_readonly'
    }
  } else {
    type = 'disable'
  }

  return {
    options: {
      title: name,
      subscription: {
        type,
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
        ...deepMerge({}, optionsDefault.params.recurring_data, recurring),
        amount: Math.round(recurring.amount * 100) || amount,
        readonly: recurring_readonly,
      },
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
