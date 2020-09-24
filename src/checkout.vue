<template>
  <div id="f" :style="style">
    <div v-if="show" class="f-container" :class="className">
      <f-header />
      <payment />
    </div>
    <ul v-else>
      <li v-for="item in error.errors" :key="item.message">
        {{ item.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import Payment from '@/components/payment'
import FHeader from '@/components/header'
import { mapState } from '@/utils/store'
import Resize from '@/mixins/resize'
import Attr from '@/mixins/attr'
import loadCardImg from '@/store/card-img'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FHeader,
    Payment,
  },
  mixins: [Resize, Attr],
  props: {
    optionsUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      load: false,
    }
  },
  computed: {
    ...mapState(['isOnlyCard', 'error']),
    ...mapState('options', ['show_menu_first']),
    ...mapState('options.theme', ['type']),
    ...mapState('router', ['page', 'method']),
    className() {
      return [
        {
          'f-only-card': this.isOnlyCard,
          'f-open': this.show_menu_first,
        },
        `f-page-${this.page}-${this.method}`,
        `f-theme-${this.type}`,
      ]
    },
    style() {
      return {
        // .f-sidebar transform: translateX(0);
        overflow:
          this.show_menu_first && this.isBreakpointMd ? 'hidden' : 'visible',
      }
    },
    show() {
      return !this.error.errors.length && this.load
    },
  },
  created: function() {
    loadCardImg(this.attr('optionsUser.options.theme.preset'))
      .then(card_img => {
        this.attr('optionsUser.options.theme.card_img', `url(${card_img})`)
      })
      .finally(() => {
        this.load = true
        this.store.setOptions(this.optionsUser)
      })
      .catch(errorHandler)
  },
}
</script>
