import payment from '@/components/payment'
import PaymentMethod from '@/components/payment-method'
import Verify from '@/components/verify'
import Success from '@/components/success'

export default {
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/payment'
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment,
      children: [
        {
          path: ':method(card)/:system(verify)/:token',
          name: 'verify',
          component: Verify
        },
        {
          path: ':method(card|emoney|ibank|cash|sepa)/:system?',
          name: 'payment-method',
          component: PaymentMethod,
          props: true
        },
        {
          path: 'success',
          name: 'success',
          component: Success
        }
      ]
    }
  ]
}
