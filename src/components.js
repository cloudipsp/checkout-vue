// TODO https://vuejs.org/v2/guide/components-registration.html
import FMethods from '@/components/methods'
import FHeader from '@/components/header'
import FPayButton from '@/components/pay-button'
import FOffer from '@/components/offer'
import FRegular from '@/components/regular'
import FWalletPayButton from '@/components/wallet-pay-button'
import FSvg from '@/components/svg'
import FMask from '@/components/mask'
import FError from '@/components/error'
import FPopover from '@/components/popover'

const components = {
  FMethods,
  FHeader,
  FPayButton,
  FOffer,
  FRegular,
  FWalletPayButton,
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
