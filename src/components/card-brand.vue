<template>
  <div class="f-card-brand">
    <transition name="f-fade">
      <f-icon
        v-if="brand"
        type="card/max"
        :name="brand"
        class="f-card-brand-icon"
      />
    </transition>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import { getCardBrand } from '@/utils/card-brand'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FIcon,
  },
  props: {
    number: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      brand: '',
    }
  },
  watch: {
    number(value) {
      getCardBrand(value).then(brand => {
        this.brand = brand
      })
    },
  },
}
</script>
