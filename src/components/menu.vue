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
        <span v-text="title(method)" />
        <f-icons :ref="`${method}_icons`" class="f-menu-icons" :type="method" />
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
import FSvg from '@/components/svg'
import FIcons from '@/components/icons'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import SvgTimer from '@/svg/timer'
import { mapState } from '@/utils/store'
import { resizeMixin } from '@/mixins/resize'
import { removeWallets } from '@/utils/helpers'

export default {
  components: {
    FSvg,
    FIcons,
    FTooltipDefault,
    SvgTimer,
  },
  mixins: [resizeMixin],
  data() {
    return {
      icon: {
        sepa: 'local',
        banklinks_eu: 'bank',
        local_methods: 'local',
        emoney: 'wallet',
      },
    }
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState(['has_fields', 'can_make_payment']),
    className() {
      return function (item) {
        return [
          'f-menu-item',
          'f-outline',
          {
            active:
              (this.$route.name === item ||
                this.$route.params.method === item ||
                this.$route.meta.method === item) &&
              !this.isBreakpointMd,
          },
        ]
      }
    },
    list() {
      return this.has_fields && this.can_make_payment
        ? this.methods
        : this.methods.filter(removeWallets)
    },
    showTooltip() {
      return method =>
        this.$te(`${method}_tooltip`, 'en') || this.$te(`${method}_tooltip`)
    },
    tooltipIcon() {
      return method => (method === 'loans' ? 'svg-timer' : 'span')
    },
    title() {
      return method =>
        method === 'wallets'
          ? this.$t(`${method}_${this.can_make_payment}`)
          : this.$t(method)
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
      this.$router.push({ name: method }).catch(() => {})
    },
  },
}
</script>
