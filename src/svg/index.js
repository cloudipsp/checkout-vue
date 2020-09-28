import SvgServerTrouble from '@/svg/server-trouble'
import SvgSafe from '@/svg/safe'
import SvgVerifiedByVisa from '@/svg/verified-by-visa'
import SvgMasterCardSecureCode from '@/svg/master-card-secure-code'
import SvgPciDss from '@/svg/pci-dss'
import SvgDecline from '@/svg/decline'
import SvgApproved from '@/svg/approved'

const components = {
  SvgServerTrouble,
  SvgSafe,
  SvgVerifiedByVisa,
  SvgMasterCardSecureCode,
  SvgPciDss,
  SvgDecline,
  SvgApproved,
}

const install = Vue => {
  Object.keys(components).forEach(name => {
    Vue.component(name, components[name])
  })
}

export default { install }
