import axios from 'axios'
import { findGetParameter } from '@/utils/helpers'

export default function() {
  let button = findGetParameter('button')
  if (!button) return Promise.reject()

  return axios
    .get(`${button}.json`)
    .then(response => {
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
}) {
  amount = amount * 100
  let options = {
    options: {
      api_domain: host,
      title: name,
    },
    params: {
      ...params,
      amount,
      currency,
      merchant_id,
      lang,
      recurring_data: {
        ...recurring,
        amount,
        readonly: recurring_readonly,
      },
      recurring: recurring_state ? 'y' : 'n',
    },
    regular: {
      insert: recurring_state,
      open: recurring_state,
    },
    fields: parseFields(fields, amount_readonly),
  }
  // delete undefined property
  return JSON.parse(JSON.stringify(options))
}

function parseFields(fields, amount_readonly) {
  let result = []
  if (!amount_readonly) {
    result.push({
      component: 'input-amount',
      name: 'amount',
    })
  }

  return result.concat(Object.values(fields).map(parseField))
}

function parseField({
  name,
  hidden,
  label,
  value,
  required,
  placeholder,
  valid = {},
  readonly,
}) {
  const component = hidden ? 'input-hidden' : 'input-text'
  let validate = {}
  if (required) validate.required = required
  if (valid.pattern) validate.regex = valid.pattern
  if (valid.min_length) validate.min = valid.min_length
  if (valid.max_length) validate.max = valid.max_length

  return {
    name,
    component,
    label,
    value,
    placeholder,
    custom: true,
    validate,
    readonly,
  }
}
