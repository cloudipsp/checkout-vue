import FFormGroup from '@/components/form/group'

const components = {
  FFormGroup,
}

export const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}
