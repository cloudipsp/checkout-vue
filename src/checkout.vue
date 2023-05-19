<template>
  <div id="f" :style="style" :class="className">
    <router-view />
  </div>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'
import { errorHandler, getRouteName, windowHeight } from '@/utils/helpers'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  mixins: [resizeMixin],
  props: {
    optionsUser: makeProp(PROP_TYPE_OBJECT),
  },
  data() {
    return {
      height: null,
    }
  },
  computed: {
    ...mapStateGetSet('options', ['active_tab']),
    ...mapState('options', [
      'show_menu_first',
      'full_screen',
      'methods',
      'theme',
    ]),
    ...mapState(['has_fields']),
    className() {
      return [
        `f-theme-${this.theme.type}`,
        {
          'f-embed': !this.full_screen,
          'f-no-embed': this.full_screen,
        },
      ]
    },
    style() {
      return {
        height: this.height,
      }
    },
    isMenu() {
      return this.$route.name === 'menu'
    },
  },
  watch: {
    isBreakpointDownLg(value) {
      if (value || !this.isMenu) return

      let name = getRouteName(this.methods, '', this.has_fields)

      this.$router.push({ name }).catch(() => {})
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
      this.height = this.full_screen ? windowHeight() + 'px' : 'auto'
    },
    resize() {
      this.initHeight()
    },
    go() {
      if (this.isBreakpointDownLg && this.show_menu_first) {
        this.active_tab = 'menu'
        this.goMenu()
      } else {
        this.goMethod()
      }
    },
    goMenu() {
      this.$router.push({ name: 'menu' }).catch(() => {})
    },
    goMethod() {
      let name = getRouteName(this.methods, this.active_tab, this.has_fields)

      this.$router.push({ name }).catch(() => {})
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
