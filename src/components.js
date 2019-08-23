import FRegular from '@/components/regular'

const components = {
  FRegular,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
