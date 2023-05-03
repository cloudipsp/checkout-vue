import FModalBase from '@/components/modal/modal-base'
import FTooltipBase from '@/components/tooltip/tooltip-base'
import FFormGroup from '@/components/form/group'
import FFormItemSelect from '@/components/form/item/select'

const components = {
  FModalBase,
  FTooltipBase,
  FFormGroup,
  FFormItemSelect,
}

export const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}
