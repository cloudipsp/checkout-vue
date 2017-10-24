import Vue from 'vue'
import Router from 'vue-router'
import payment from '@/components/payment'
import PaymentMethod from '@/components/payment-method'
import Verify from '@/components/verify'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/payment/card'
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment,
      children: [
        {
          path: ':method(card|emoney|ibank|cash|sepa)/:system?',
          name: 'method',
          component: PaymentMethod,
          props: true
        },
        {
          path: 'card/verify',
          name: 'verify',
          component: Verify
        }
      ]
    }
  ]
})
