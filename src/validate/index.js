import { extend } from 'vee-validate'
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

export const install = () => {
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
      phone: digits,
    },
    customRules
  )
  Object.entries(rules).forEach(([name, value]) => {
    extend(name, value)
  })
}
