// TODO https://vuejs.org/v2/guide/components-registration.html

import FButtonPayWallet from '@/components/button-pay-wallet'
import FSvg from '@/components/svg'
import FMask from '@/components/mask'
import FPopover from '@/components/popover'
import FModal from '@/components/modal'
import FTooltip from '@/components/tooltip'
import FDropdown from '@/components/dropdown'
import InputText from '@/components/input-text'
import InputAmount from '@/components/input-amount'
import InputHidden from '@/components/input-hidden'
import InputSelect from '@/components/input-select'
import InputCheckbox from '@/components/input-checkbox'
import InputSwipe from '@/components/input-swipe'
import FIcon from '@/components/icon'

const components = {
  FButtonPayWallet,
  FSvg,
  FMask,
  FPopover,
  FModal,
  FTooltip,
  FDropdown,
  InputText,
  InputAmount,
  InputHidden,
  InputSelect,
  InputCheckbox,
  InputSwipe,
  FIcon,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
