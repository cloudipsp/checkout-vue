<template>
  <f-icon v-if="name" type="card/max" :name="name" />
</template>

<script>
import FIcon from '@/components/icon'
import { getBinName } from '@/utils/get-bin-name'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FIcon,
  },
  props: {
    bin: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    name() {
      return getBinName(this.bin)
    },
  },
}
</script>
