<template>
  <div class="f-card-brand">
    <transition name="f-fade">
      <f-icon
        v-if="brand"
        type="card_system/max"
        :name="brand"
        class="f-card-brand-icon"
      />
    </transition>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import { getCardBrand } from '@/utils/card-brand'

export default {
  components: {
    FIcon,
  },
  props: {
    number: {
      type: String,
      required: true,
    },
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
