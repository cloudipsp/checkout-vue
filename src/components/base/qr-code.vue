<template>
  <span ref="qrcode" class="f-qrcode" />
</template>

<script>
import qrcode from 'qrcode-generator'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  props: {
    text: makeProp(PROP_TYPE_STRING),
  },
  mounted() {
    let qr = qrcode(-1, 'H')
    qr.addData(this.text)
    qr.make()
    this.$refs.qrcode.innerHTML = qr.createSvgTag(7, 0)
  },
}
</script>
