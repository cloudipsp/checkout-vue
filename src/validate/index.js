import {
  extend,
  localize,
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate'
import {
  required,
  email,
  numeric,
  alpha,
  min,
  max,
  digits,
  regex,
} from 'vee-validate/dist/rules'
import * as customRules from '@/validate/rules'
import { validate as messages } from '@/i18n/lang/en'

const install = Vue => {
  let rules = Object.assign(
    {
      required,
      email,
      numeric,
      alpha,
      min,
      max,
      digits,
      regex,
    },
    customRules
  )
  Object.entries(rules).forEach(([name, value]) => {
    extend(name, value)
  })

  localize('en', messages)

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}

export default { install }
