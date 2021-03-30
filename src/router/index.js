import Vue from 'vue'
import Router from 'vue-router'

import PaymentMethod from '@/views/payment-method'
import {
  payment_method,
  card,
  banklinks_eu,
  local_methods,
  sepa,
  receipt,
  wallets,
  loans,
  success,
} from '@/config/router'
import {
  Card,
  Banklinks_eu,
  Local_methods,
  Sepa,
  Receipt,
  Wallets,
  Loans,
  Success,
} from '@/import'

Vue.use(Router)

let instance = {}

export default name => {
  if (instance[name]) return instance[name]
  return (instance[name] = new Router({
    mode: 'abstract',
    routes: [
      {
        path: `/${payment_method}`,
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
        path: `/${success}`,
        name: success,
        component: Success,
      },
    ],
  }))
}
