import Vue from 'vue'
import Router from 'vue-router'

import Method from '@/views/checkout/method'
import Checkout from '@/views/checkout'
import Blank from '@/views/checkout/blank'
import ButtonPay from '@/components/button/button-pay'
import { getStore } from '@/store'
import Click2payButtonPay from '@/views/click2pay/button-pay'
import {
  Card,
  CardFields,
  CardCard,
  Click2payUserExists,
  CardVerify,
  Click2payOtp,
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
  MostPopular,
  Installments,
  InstallmentsSystem,
  LoadingMono,
} from '@/import'

const card = 'card'
const click2pay = 'click2pay'
const verify = 'verify'
const click2pay_otp = 'click2pay_otp'
const banklinks_eu = 'banklinks_eu'
const local_methods = 'local_methods'
const crypto = 'crypto'
const sepa = 'sepa'
const receipt = 'receipt'
const wallets = 'wallets'
const loans = 'loans'
const installments = 'installments'
const emoney = 'emoney'
const most_popular = 'most_popular'
const success = 'success'
const error = 'error'
const error_modal = 'error_modal'
const checkout = 'checkout'
const menu = 'menu'

Vue.use(Router)

let instance = {}

export const createRouter = name => {
  let instanceStore = getStore(name)
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
                    component: CardFields,
                    children: [
                      {
                        path: '',
                        name: card,
                        components: {
                          default: CardCard,
                          'button-pay': ButtonPay,
                        },
                        beforeEnter: (to, from, next) => {
                          if (instanceStore.state.order.need_verify_code)
                            next({
                              name: verify,
                            })
                          else if (instanceStore.state.click2pay_otp) {
                            next({
                              name: click2pay_otp,
                            })
                          } else next()
                        },
                        meta: {
                          method: card,
                        },
                      },
                      {
                        path: click2pay,
                        name: click2pay,
                        components: {
                          default: Click2payUserExists,
                          'button-pay': Click2payButtonPay,
                        },
                        meta: {
                          method: card,
                        },
                      },
                    ],
                  },
                  {
                    path: verify,
                    name: verify,
                    component: CardVerify,
                    meta: {
                      method: card,
                    },
                  },
                  {
                    path: click2pay_otp,
                    name: click2pay_otp,
                    component: Click2payOtp,
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
                meta: {
                  method: banklinks_eu,
                },
              },
              {
                path: local_methods,
                name: local_methods,
                component: Local_methods,
                meta: {
                  method: local_methods,
                },
              },
              {
                path: crypto,
                name: crypto,
                component: Crypto,
                meta: {
                  method: crypto,
                },
              },
              {
                path: sepa,
                name: sepa,
                component: Sepa,
                meta: {
                  method: sepa,
                },
              },
              {
                path: receipt,
                name: receipt,
                component: Receipt,
                meta: {
                  method: receipt,
                },
              },
              {
                path: wallets,
                name: wallets,
                component: Wallets,
                meta: {
                  method: wallets,
                },
              },
              {
                path: loans,
                name: loans,
                component: Loans,
                meta: {
                  method: loans,
                },
              },
              {
                path: installments,
                name: installments,
                component: Installments,
                meta: {
                  method: installments,
                },
              },
              {
                path: emoney,
                name: emoney,
                component: Emoney,
                meta: {
                  method: emoney,
                },
              },
              {
                path: most_popular,
                name: most_popular,
                component: MostPopular,
                meta: {
                  method: most_popular,
                },
              },
              {
                path: ':method(installments)/:system',
                name: 'installments-system',
                component: InstallmentsSystem,
                meta: {
                  method: installments,
                },
              },
              {
                path: ':method/:system',
                name: 'system',
                component: System,
                meta: route => ({
                  method: route.params.method,
                }),
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
              {
                name: 'loading-monobank',
                path: 'loading-monobank/:system',
                component: LoadingMono,
                meta: {
                  noLoading: true,
                  noTop: true,
                  method: installments,
                },
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
