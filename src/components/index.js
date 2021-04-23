import FModalBase from '@/components/modal/modal-base'
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FButtonClose from '@/components/button/button-close'
import FFormGroup from '@/components/form/group'
import FFormItemSelect from '@/components/form/item/select'

const components = {
  FModalBase,
  FTooltipBase,
  FButtonClose,
  FFormGroup,
  FFormItemSelect,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
