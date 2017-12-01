// TODO import config icon f-fast-access
// TODO directive/component params
// TODO мультиязычность
// TODO свайп

import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru'
import Checkout from '@/checkout'
import VueI18n from 'vue-i18n'
import En from '@/locale/en'
import Ru from '@/locale/ru'

const install = function (Vue, VeeValidate, VueI18n, messages) {
  Vue.config.productionTip = false
  Vue.use(VueI18n)
  Vue.use(VeeValidate, {
    inject: false,
    dictionary: {
      ru: {
        messages: {
          credit_card: (field) => `Поле ${field} должно быть действительным номером карты`
        }
      }
    }
  })
  window.fondy = function (el, options) {
    return new Vue({
      i18n: new VueI18n({
        locale: 'en',
        fallbackLocale: 'en',
        // silentTranslationWarn: true,
        messages: messages
      }),
      el: el,
      data: {
        options: options
      },
      template: '<checkout :options="options"/>',
      components: { Checkout },
      $_veeValidate: {
        validator: 'new'
      },
      methods: {
        submit: function () {
          this.$emit('submit')
        },
        location: function (method, system) {
          this.$emit('location', method, system)
        }
      }
    })
  }
}

if (typeof window !== 'undefined') {
  Validator.localize('ru', ru)
  install(Vue, VeeValidate, VueI18n, {en: En, ru: Ru})
}
