<template>
  <div class="f-menu">
    <template v-for="method in list">
      <button
        :key="method"
        :ref="method"
        type="button"
        :class="className(method)"
        @click.prevent="click(method)"
      >
        <f-svg
          class="f-menu-icon"
          :name="icon[method] || method"
          size="lg"
          fw
        />
        <span v-text="$t(method)" />
        <f-icons
          :ref="`${method}_icons`"
          class="f-menu-icons"
          :type="method"
          position="sidebar"
        />
        <f-tooltip-default
          v-if="showTooltip(method)"
          :ref="`${method}_tooltip`"
          custom-class="f-tooltip-menu"
          :target="() => $refs[method][0]"
          placement="topright"
          boundary-padding="30"
        >
          <component :is="tooltipIcon(method)" />
          <span v-text="$t(`${method}_tooltip`)" />
        </f-tooltip-default>
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FIcons from '@/components/icons'
import resize from '@/mixins/resize'
import { removeWallets } from '@/utils/helpers'
import { SvgTimer } from '@/import'

export default {
  components: {
    FIcons,
    SvgTimer,
  },
  mixins: [resize],
  data() {
    return {
      icon: {
        sepa: 'local',
        banklinks_eu: 'bank',
        local_methods: 'local',
      },
    }
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['options']),
    className() {
      return function (item) {
        return [
          'f-menu-item',
          'f-outline',
          { active: this.$route.name === item && !this.isBreakpointMd },
        ]
      }
    },
    list() {
      return this.methods.filter(removeWallets)
    },
    showTooltip() {
      return method =>
        this.$te(`${method}_tooltip`, 'en') || this.$te(`${method}_tooltip`)
    },
    tooltipIcon() {
      return method => (method === 'loans' ? 'svg-timer' : 'span')
    },
  },
  mounted() {
    this.methods.forEach(method => {
      if (!this.$refs[method]) return
      this.$refs[method][0].reference = this.$refs[`${method}_icons`][0].$el
    })
  },
  methods: {
    click(method) {
      let tooltip = this.$refs[`${method}_tooltip`]
      tooltip && tooltip[0].close()
      this.$refs[`${method}_icons`][0].close()
      this.store.location(method)
    },
  },
}
</script>
