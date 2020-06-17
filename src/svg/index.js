import SvgVerifiedByVisa from '@/svg/verified-by-visa'
import SvgMasterCardSecureCode from '@/svg/master-card-secure-code'
import SvgPciDss from '@/svg/pci-dss'

const components = {
  SvgVerifiedByVisa,
  SvgMasterCardSecureCode,
  SvgPciDss,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
