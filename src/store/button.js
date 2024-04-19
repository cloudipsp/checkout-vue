import { loadAxios } from '@/import'
import { deepMerge, amountToCoins } from '@/utils/helpers'
import { configDefault } from '@/config/config-default'
import { getType } from '@/store/subscription'
import { parse, createDate } from '@/utils/date'
import configSubscription from '@/config/subscription'
import validate from '@/schema/validate'

export const loadButton = (api_domain, button, button_body) => {
  return (function () {
    if (button_body.token) return Promise.resolve(button_body)

    let domain = ENVIRONMENT === 'development' ? '' : `https://${api_domain}`

    return loadAxios()
      .then(axios => axios.get(`${domain}/buttons/${button}.json`))
      .then(({ data }) => data)
  })()
    .then(parseOptions)
    .then(config => validate(config).parse().data)
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
  amount = amountToCoins(amount)

  if (!currencies.includes(currency)) {
    currencies.unshift(currency)
  }

  if (expire && parse(expire, 'DD.MM.YYYY hh:mm') < createDate())
    return Promise.reject('button_expired')

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
        ...deepMerge({}, configDefault.params.recurring_data, recurring),
        amount: amountToCoins(recurring.amount) || amount,
      },
      response_url,
      button: token ? token : undefined,
    },
    fields_custom: fields,
    subscription:
      configSubscription[getType(button_type === 'recurring', recurring_state)],
    currencies,
  }
}
