import Vue from 'vue'
import Router from 'vue-router'

import Method from '@/views/checkout/method'
import Checkout from '@/views/checkout'
import Blank from '@/views/checkout/blank'
import store from '@/store/index'
import {
  Card,
  CardIndex,
  CardVerify,
  Banklinks_eu,
  Local_methods,
  Crypto,
  Sepa,
  Receipt,
  Wallets,
  Loans,
  Emoney,
  Success,
  Error,
  ErrorModal,
  System,
  WithoutSidebar,
  Menu,
  BlankWallets,
} from '@/import'

const card = 'card'
const verify = 'verify'
const banklinks_eu = 'banklinks_eu'
const local_methods = 'local_methods'
const crypto = 'crypto'
const sepa = 'sepa'
const receipt = 'receipt'
const wallets = 'wallets'
const loans = 'loans'
const emoney = 'emoney'
const success = 'success'
const error = 'error'
const error_modal = 'error_modal'
const checkout = 'checkout'
const menu = 'menu'

Vue.use(Router)

let instance = {}

export default name => {
  let instanceStore = store(name, true)
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
                      if (instanceStore.state.order.need_verify_code)
                        next({
                          name: verify,
                        })
                      else next()
                    },
                  },
                  {
                    path: verify,
                    name: verify,
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
                path: crypto,
                name: crypto,
                component: Crypto,
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
                path: emoney,
                name: emoney,
                component: Emoney,
              },
              {
                path: ':method/:system',
                name: 'system',
                component: System,
              },
            ],
          },
          {
            path: 'without-sidebar',
            component: WithoutSidebar,
            children: [
              {
                path: success,
                name: success,
                component: Success,
              },
              {
                path: menu,
                name: menu,
                component: Menu,
              },
            ],
          },
          {
            path: 'blank',
            component: Blank,
            children: [
              {
                path: 'wallets',
                name: 'blank-wallets',
                component: BlankWallets,
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

  instance[name].afterEach(({ name, params }) => {
    instanceStore.state.params.payment_system = params.system || name
  })

  return instance[name]
}
