import FMethods from '@/components/methods'
import FFastAccess from '@/components/fast-access.vue'
import FMenu from '@/components/menu.vue'
import FHeader from '@/components/header.vue'
import FPayButton from '@/components/pay-button.vue'
import FOffer from '@/components/offer'
import FRegular from '@/components/regular'

const components = {
  FMethods,
  FFastAccess,
  FMenu,
  FHeader,
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
