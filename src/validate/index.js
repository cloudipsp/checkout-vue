import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
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

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}

export default { install }
