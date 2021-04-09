import Vue from 'vue'
import Router from 'vue-router'

import PaymentMethod from '@/views/checkout/payment-method'
import Checkout from '@/views/checkout'
import {
  Card,
  Banklinks_eu,
  Local_methods,
  Sepa,
  Receipt,
  Wallets,
  Loans,
  Success,
  Error,
  ErrorModal,
} from '@/import'

const payment_method = 'payment-method'
const card = 'card'
const banklinks_eu = 'banklinks_eu'
const local_methods = 'local_methods'
const sepa = 'sepa'
const receipt = 'receipt'
const wallets = 'wallets'
const loans = 'loans'
const success = 'success'
const error = 'error'
const error_modal = 'error_modal'
const checkout = 'checkout'

Vue.use(Router)

let instance = {}

export default name => {
  if (instance[name]) return instance[name]
  return (instance[name] = new Router({
    mode: 'abstract',
    routes: [
      {
        path: `/${checkout}`,
        name: checkout,
        component: Checkout,
        children: [
          {
            path: payment_method,
            component: PaymentMethod,
            children: [
              {
                path: card,
                name: card,
                component: Card,
              },
              {
                path: banklinks_eu,
                name: banklinks_eu,
                component: Banklinks_eu,
              },
              {
                path: local_methods,
                name: local_methods,
                component: Local_methods,
              },
              {
                path: sepa,
                name: sepa,
                component: Sepa,
              },
              {
                path: receipt,
                name: receipt,
                component: Receipt,
              },
              {
                path: wallets,
                name: wallets,
                component: Wallets,
              },
              {
                path: loans,
                name: loans,
                component: Loans,
              },
            ],
          },
          {
            path: success,
            name: success,
            component: Success,
          },
        ],
      },
      {
        path: `/${error}`,
        name: error,
        component: Error,
      },
      {
        path: `/${error_modal}`,
        name: error_modal,
        component: ErrorModal,
      },
    ],
  }))
}
