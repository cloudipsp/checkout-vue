// TODO https://vuejs.org/v2/guide/components-registration.html

import FButtonPayWallet from '@/components/button-pay-wallet-wrapper'
import FSvg from '@/components/svg'
import FModalBase from '@/components/modal/modal-base'
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FTooltipError from '@/components/tooltip/tooltip-error'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import FTooltipCard from '@/components/tooltip/tooltip-card'
import InputText from '@/components/input-text'
import InputAmount from '@/components/input-amount'
import InputHidden from '@/components/input-hidden'
import FIcon from '@/components/icon'
import FPrice from '@/components/price'
import FInfo from '@/components/info'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonClose from '@/components/button/button-close'
import FFormBase from '@/components/form/form/form-base'
import FForm from '@/components/form/form'
import FFormItem from '@/components/form/item'
import FFormGroup from '@/components/form/group'
import FFormItemInput from '@/components/form/item/input'
import FFormItemDate from '@/components/form/item/date'
import FFormItemCheckbox from '@/components/form/item/checkbox'
import FFormItemSelect from '@/components/form/item/select'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FButtonLink from '@/components/button/button-link'
import FButton from '@/components/button/button'
import FLoading from '@/components/loading'
import FSecurity from '@/components/security'
import FPreloader from '@/components/preloader'
import FAmount from '@/components/base/amount'
import FPlaceholder from '@/components/base/placeholder'

const components = {
  FButtonPayWallet,
  FSvg,
  FModalBase,
  FTooltipBase,
  FTooltipError,
  FTooltipDefault,
  FTooltipCard,
  InputText,
  InputAmount,
  InputHidden,
  FIcon,
  FPrice,
  FInfo,
  FOffer,
  FButtonPay,
  FButtonClose,
  FFormBase,
  FForm,
  FFormItem,
  FFormGroup,
  FFormItemInput,
  FFormItemDate,
  FFormItemCheckbox,
  FFormItemSelect,
  FScrollbarVertical,
  FButtonLink,
  FButton,
  FLoading,
  FSecurity,
  FPreloader,
  FAmount,
  FPlaceholder,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
