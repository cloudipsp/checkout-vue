// TODO https://vuejs.org/v2/guide/components-registration.html

import FButtonPayWallet from '@/components/button-pay-wallet'
import FSvg from '@/components/svg'
import FMask from '@/components/mask'
import FPopover from '@/components/popover'
import FModal from '@/components/modal'
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FTooltipError from '@/components/tooltip/tooltip-error'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
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
  FTooltipBase,
  FTooltipError,
  FTooltipDefault,
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
