import axios from 'axios'

export default function(button) {
  return axios
    .get(`${button}.json`)
    .then(response => {
      return response.data
    })
    .then(
      ({
        host,
        name,
        fields = {},
        amount,
        params = {},
        currency,
        merchant_id,
        lang,
        amount_readonly,
      }) => {
        return {
          api_domain: host,
          name,
          amount: amount * 100,
          order_desc: params.order_desc,
          currency,
          merchant_id,
          lang,
          fields: parseFields(fields, amount_readonly),
        }
      }
    )
}

function parseFields(fields, amount_readonly) {
  let result = []
  if (!amount_readonly) {
    result.push({
      component: 'input-amount',
      name: 'amount',
    })
  }

  return result.concat(
    Object.values(fields).map(
      ({ name, hidden, label, value, required, placeholder, valid = {} }) => {
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
        }
      }
    )
  )
}
