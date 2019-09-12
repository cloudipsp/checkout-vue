// TODO https://ru.vuejs.org/v2/guide/components-registration.html#%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F-%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F-%D1%80%D0%B5%D0%B3%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D0%B1%D0%B0%D0%B7%D0%BE%D0%B2%D1%8B%D1%85-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2
import FPaymentFields from '@/components/payment-fields'
import FPaymentMethod from '@/components/payment-method'
import FMethods from '@/components/methods'
import FFastAccess from '@/components/fast-access'
import FMenu from '@/components/menu'
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
  FPaymentFields,
  FPaymentMethod,
  FMethods,
  FFastAccess,
  FMenu,
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
