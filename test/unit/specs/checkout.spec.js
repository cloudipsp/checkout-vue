import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Checkout from '@/checkout'
import Payment from '@/components/payment'
import VeeValidate from 'vee-validate'
import { i18n } from '@/i18n'
import Store from '@/mixins/store'
import Promise from 'es6-promise'
import Validator from '@/mixins/validator'
import * as helpers from '@/utils/helpers'
import store from '@/store'
// import Model from '../model'

Promise.polyfill()
Vue.use(VeeValidate, { inject: false })
Vue.use(Store)
Vue.use(Validator)

function mock(name, method) {
  let response = {
    'api.checkout.app': {
      info: {
        merchant_url: 'http://ukrind1.test'
      }
    },
    'api.checkout.cards': [],
  }
  return response[name + '.' + method]
}
function Model(data){
  this.data = data
}
Model.prototype = {
  attr: function (name, value) {
    var i = 0,
      data = this.data,
      name = (name || '').split('.'),
      prop = name.pop(),
      len = arguments.length;
    for (; i < name.length; i++) {
      if (data && data.hasOwnProperty(name[i])) {
        data = data[name[i]];
      }
      else {
        if (len == 2) {
          data = (data[name[i]] = {});
        }
        else {
          break;
        }
      }
    }
    if (len == 1) {
      return data ? data[prop] : null;
    }
    if (len == 2) {
      data[prop] = value;
    }
    return this;
  },
  instance: function (data) {
    return new Model(data);
  }
}

describe('test', () => {
  before(function() {
    sinon.stub(helpers, 'sendRequest').callsFake(function(name, method){
      return new Promise((resolve, reject) => {
        resolve(new Model(mock(name, method)))
      })
    })
  })

  describe('Checkout', () => {
    let cmp, vm
    beforeEach(function() {
      cmp = Vue.extend(Checkout)
      vm = new cmp({
        store,
        i18n,
        propsData: {
          optionsUser: {
            options: {
              title: 'title',
              link: 'https://fondy.eu'
            },
            params: {
              merchant_id: 900001,
            }
          }
        }
      }).$mount()
    })

    it('title text', done => {
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.f-block-title').textContent)
          .to.equal('title')
        done()
      })
    })

    it('link state', done => {
      Vue.nextTick(() => {
        expect(vm.store.state.options.link)
          .to.equal('http://ukrind1.test')
        done()
      })
    })
  })

  describe('Checkout2', () => {
    let cmp, vm
    beforeEach(function() {
      cmp = shallowMount(Checkout, {
        store,
        i18n,
        propsData: {
          optionsUser: {
            options: {
              title: 'title',
              link: 'https://fondy.eu'
            },
            params: {
              merchant_id: 900001,
            }
          }
        }
      })
      vm = cmp.vm
    })

    it('title text', () => {

    })
  })

  describe('Payment', () => {
    let cmp, vm
    beforeEach(function() {
      vm = new Vue({
        store,
        i18n,
        $_veeValidate: {
          validator: 'new'
        },
        template: '<payment/>',
        components: { Payment },
      }).$mount()
      vm = vm.$children[0]
    })

    it('title text', done => {
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.f-block-title').textContent)
          .to.equal('title')
        done()
      })
    })
  })
})
