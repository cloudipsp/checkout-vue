// TODO https://vuejs.org/v2/guide/components-registration.html

import FButtonPayWallet from '@/components/button-pay-wallet'
import FSvg from '@/components/svg'
import FMask from '@/components/mask'
import FError from '@/components/error'
import FPopover from '@/components/popover'

const components = {
  FButtonPayWallet,
  FSvg,
  FMask,
  FError,
  FPopover,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
