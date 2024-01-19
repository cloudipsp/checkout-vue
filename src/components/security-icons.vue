<template>
  <div>
    <svg-verified-by-visa />
    <svg-master-card-secure-code />
    <svg-pci-dss />
  </div>
</template>

<script>
import SvgVerifiedByVisa from '@/svg/verified-by-visa.svg'
import SvgMasterCardSecureCode from '@/svg/master-card-secure-code.svg'
import SvgPciDss from '@/svg/pci-dss.svg'

export default {
  components: {
    SvgVerifiedByVisa,
    SvgMasterCardSecureCode,
    SvgPciDss,
  },
}
</script>
