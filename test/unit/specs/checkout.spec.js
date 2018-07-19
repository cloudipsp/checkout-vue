import Vue from 'vue'
import Checkout from '@/checkout'
import VeeValidate, { Validator } from 'vee-validate'
import { i18n } from '@/i18n'
import store from '@/store'
import Store from '@/mixins/store'
import Promise from 'es6-promise'
Promise.polyfill()

describe('Checkout', () => {

  Vue.use(VeeValidate, { inject: false })
  Vue.use(Store)

  it('should render correct contents', done => {
    const vm =  new Vue({
      i18n,
      store,
      $_veeValidate: {
        validator: 'new'
      },
      data: {
        options: {
          options: {
            title: 'title'
          }
        }
      },
      template: '<checkout :options2="options"/>',
      components: { Checkout }
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.f-block-title').textContent)
        .to.equal('title')
      done()
    })

  })
})
