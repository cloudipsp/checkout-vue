<template>
  <div id="f" :style="style" :class="className">
    <div v-if="show" class="f-container" :class="classNameContainer">
      <f-header />
      <payment />
    </div>
    <ul v-else-if="isError">
      <div>{{ COMMITHASH }} {{ BRANCH }}</div>
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
import configTheme from '@/config/theme'

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
      // eslint-disable-next-line no-undef
      COMMITHASH,
      // eslint-disable-next-line no-undef
      BRANCH,
      height: null,
    }
  },
  computed: {
    ...mapState(['isOnlyCard', 'error']),
    ...mapState('options', ['show_menu_first', 'full_screen']),
    ...mapState('options.theme', ['type']),
    ...mapState('router', ['page', 'method']),
    className() {
      return { 'f-embed': !this.full_screen }
    },
    classNameContainer() {
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
        height: this.height,
        // .f-sidebar transform: translateX(0);
        overflow:
          this.show_menu_first && (this.isBreakpointMd || !this.full_screen)
            ? 'hidden'
            : 'visible',
      }
    },
    show() {
      return !this.isError && this.load
    },
    isError() {
      return this.error.errors.length
    },
  },
  created: function() {
    Promise.all([
      this.store.loadButton(),
      this.store.loadCardImg(this.getPreset()),
    ])
      .finally(() => {
        this.load = true
        this.store.setOptions(this.optionsUser)
        this.initHeight()
      })
      .catch(errorHandler)
  },
  methods: {
    initHeight() {
      this.height = this.full_screen ? window.innerHeight + 'px' : 'auto'
    },
    resize() {
      this.initHeight()
    },
    getPreset() {
      const userPreset = this.attr('optionsUser.options.theme.preset')
      const userTheme = this.attr('optionsUser.options.theme.type')

      if (userPreset) {
        return userPreset
      } else if (userTheme) {
        this.attr('optionsUser.options.theme.preset', configTheme[userTheme])
        return configTheme[userTheme]
      }
    },
  },
}
</script>
