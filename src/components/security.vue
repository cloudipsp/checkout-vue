<template>
  <div class="f-security">
    <template v-if="enableModal">
      <f-button-unstyled class="f-title-security" @click="open">
        <f-svg ref="security" name="security" :size="24" />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-modal-base v-model="showModal">
        <div class="f-modal-security-title">
          <f-svg name="security" size="lg" />
          <span v-text="$t('security_title')" />
        </div>
        <div class="f-modal-security-content" v-html="$t('security_text')" />
        <f-security-icons v-if="showModal" class="f-modal-security-icons" />
      </f-modal-base>
    </template>
    <template v-else>
      <f-button-unstyled ref="security" class="f-title-security">
        <f-svg ref="reference" name="security" :size="svgSize" />
        <span v-text="$t('security_title')" />
      </f-button-unstyled>
      <f-tooltip-default :target="() => $refs.security?.$el" @shown="shown">
        <div>
          <f-security-icons
            v-if="showTooltip"
            class="f-tooltip-security-icons"
          />
          <div
            class="f-tooltip-security-content"
            v-html="$t('security_text')"
          />
        </div>
      </f-tooltip-default>
    </template>
  </div>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import FModalBase from '@/components/modal/modal-base'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import { FSecurityIcons } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'

export default {
  components: {
    FButtonUnstyled,
    FSvg,
    FModalBase,
    FTooltipDefault,
    FSecurityIcons,
  },
  mixins: [resizeMixin],
  data() {
    return {
      showModal: false,
      showTooltip: false,
    }
  },
  computed: {
    enableModal() {
      return isPhone || this.isWidthSm
    },
    svgSize() {
      return this.isBreakpointDownLg ? 24 : 32
    },
  },
  mounted() {
    if (!this.enableModal) {
      this.$refs.security.reference = this.$refs.reference.$el
    }
  },
  methods: {
    open() {
      this.showModal = true
    },
    shown() {
      this.showTooltip = true
    },
  },
}
</script>
