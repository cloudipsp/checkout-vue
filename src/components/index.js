// TODO https://vuejs.org/v2/guide/components-registration.html

import FButtonPayWallet from '@/components/button-pay-wallet'
import FSvg from '@/components/svg'
import FMask from '@/components/mask'
import FModalBase from '@/components/modal/modal-base'
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FTooltipError from '@/components/tooltip/tooltip-error'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import FTooltipCard from '@/components/tooltip/tooltip-card'
import FAlertBase from '@/components/alert/alert-base'
import InputText from '@/components/input-text'
import InputAmount from '@/components/input-amount'
import InputHidden from '@/components/input-hidden'
import InputSelect from '@/components/input-select'
import InputCheckbox from '@/components/input-checkbox'
import InputSwitch from '@/components/input-switch'
import FIcon from '@/components/icon'
import FInfo from '@/components/info'
import FCustomerFields from '@/components/customer-fields'
import FFields from '@/components/fields'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonClose from '@/components/button/button-close'
import FFormItem from '@/components/form/item'
import FFormGroup from '@/components/form/group'
import FFormItemInput from '@/components/form/item/input'
import FFormItemDate from '@/components/form/item/date'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FButtonLink from '@/components/button/button-link'
import FButton from '@/components/button/button'

const components = {
  FButtonPayWallet,
  FSvg,
  FMask,
  FModalBase,
  FTooltipBase,
  FTooltipError,
  FTooltipDefault,
  FTooltipCard,
  FAlertBase,
  InputText,
  InputAmount,
  InputHidden,
  InputSelect,
  InputCheckbox,
  InputSwitch,
  FIcon,
  FInfo,
  FCustomerFields,
  FFields,
  FOffer,
  FButtonPay,
  FButtonClose,
  FFormItem,
  FFormGroup,
  FFormItemInput,
  FFormItemDate,
  FScrollbarVertical,
  FButtonLink,
  FButton,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
