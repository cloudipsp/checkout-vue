import FPayButton from '@/components/pay-button.vue'
import FOffer from '@/components/offer'
import FRegular from '@/components/regular'

const components = {
  FPayButton,
  FOffer,
  FRegular,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
