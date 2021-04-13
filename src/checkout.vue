<template>
  <div id="f" :style="style" :class="className">
    <router-view />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import Resize from '@/mixins/resize'
import { errorHandler } from '@/utils/helpers'

export default {
  mixins: [Resize],
  props: {
    optionsUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      height: null,
    }
  },
  computed: {
    ...mapState('options', [
      'show_menu_first',
      'full_screen',
      'active_tab',
      'methods',
    ]),
    className() {
      return { 'f-embed': !this.full_screen }
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
  },
  created() {
    this.store
      .setOptions(this.optionsUser)
      .then(this.init)
      .catch(this.goError)
      .catch(errorHandler)
  },
  methods: {
    init() {
      this.initHeight()
      this.store
        .load()
        .then(this.go)
        .catch(this.goErrorModal)
        .catch(errorHandler)
    },
    initHeight() {
      this.height = this.full_screen ? window.innerHeight + 'px' : 'auto'
    },
    resize() {
      this.initHeight()
    },
    go() {
      this.$router
        .push({
          name: this.active_tab || this.methods[0],
          query: { init: true },
        })
        .catch(() => {})
    },
    goErrorModal(error) {
      this.$router
        .push({ name: 'error_modal', query: { error } })
        .catch(() => {})
    },
    goError(errors) {
      this.$router.push({ name: 'error', query: { errors } }).catch(() => {})
    },
  },
}
</script>
