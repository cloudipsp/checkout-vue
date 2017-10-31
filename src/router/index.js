import payment from '@/components/payment'
import PaymentMethod from '@/components/payment-method'
import Verify from '@/components/verify'

export default {
  linkActiveClass: 'active',
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
          path: 'card/verify',
          name: 'verify',
          component: Verify
        },
        {
          path: ':method(card|emoney|ibank|cash|sepa)/:system?',
          name: 'method',
          component: PaymentMethod,
          props: true
        }
      ]
    }
  ]
}
