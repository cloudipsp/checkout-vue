<template>
  <div :class="className" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('css_variable', [
      'card_bg_lighten',
      'card_img',
      'card_gradient_custom',
    ]),
    className() {
      return [
        'f-card-bg',
        {
          'f-card-img': this.card_img && !this.card_gradient_custom,
          'f-card-gradient-custom': this.card_gradient_custom && !this.card_img,
          'f-card-bg-lighten': this.card_bg_lighten,
        },
      ]
    },
  },
}
</script>
