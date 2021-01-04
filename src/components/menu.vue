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
          :target="() => $refs[method][0]"
        >
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

export default {
  components: {
    FIcons,
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
    ...mapState('router', ['method']),
    ...mapState(['options']),
    className() {
      return function (item) {
        return [
          'f-menu-item',
          { active: this.method === item && !this.isBreakpointMd },
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
  },
  methods: {
    click(method) {
      let tooltip = this.$refs[`${method}_tooltip`]
      tooltip && tooltip[0].close()
      this.$refs[`${method}_icons`][0].close()
      this.store.location('payment-method', method)
    },
  },
}
</script>
