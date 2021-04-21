import Vue from 'vue'
import Router from 'vue-router'

import Method from '@/views/checkout/method'
import Checkout from '@/views/checkout_'
import Card from '@/views/checkout/method/card'
import store from '@/store/index'
import {
  CardIndex,
  CardVerify,
  Banklinks_eu,
  Local_methods,
  Sepa,
  Receipt,
  Wallets,
  Loans,
  Success,
  Error,
  ErrorModal,
  System,
  Blank,
} from '@/import'

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

  let instanceStore = store(name)
  instance[name] = new Router({
    mode: 'abstract',
    routes: [
      {
        path: `/${checkout}`,
        name: checkout,
        component: Checkout,
        children: [
          {
            path: 'method',
            component: Method,
            children: [
              {
                path: card,
                component: Card,
                children: [
                  {
                    path: '',
                    name: card,
                    component: CardIndex,
                    beforeEnter: (to, from, next) => {
                      if (instanceStore.state.need_verify_code)
                        next({
                          name: 'card-verify',
                        })
                      else next()
                    },
                  },
                  {
                    path: 'verify',
                    name: 'card-verify',
                    component: CardVerify,
                    meta: {
                      method: card,
                    },
                  },
                ],
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
              {
                path: ':method/:system',
                name: 'system',
                component: System,
              },
            ],
          },
          {
            path: 'blank',
            component: Blank,
            children: [
              {
                path: success,
                name: success,
                component: Success,
              },
            ],
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
  })

  instance[name].afterEach(({ name, params, query }) => {
    if (!query.init) {
      instanceStore.state.options.show_menu_first = false
    }
    instanceStore.state.params.payment_system = params.system || name
  })

  return instance[name]
}
