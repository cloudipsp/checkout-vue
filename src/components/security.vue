<template>
  <div class="f-security">
    <template v-if="enableModal">
      <a
        href="#"
        class="f-title-security"
        @click.prevent="open"
        @keyup.space="open"
      >
        <f-svg ref="security" name="security" size="2x" />
        <span v-text="$t('security_title')" />
      </a>
      <f-modal-base v-model="showModal">
        <div class="f-modal-security-title">
          <f-svg name="security" size="lg" />
          <span v-text="$t('security_title')" />
        </div>
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="f-modal-security-content" v-html="$t('security_text')" />
        <f-security-icons v-if="showModal" class="f-modal-security-icons" />
      </f-modal-base>
    </template>
    <template v-else>
      <a
        ref="security"
        href="#"
        class="f-title-security"
        tabindex="-1"
        @click.prevent
      >
        <f-svg ref="reference" name="security" size="2x" tabindex="0" />
        <span v-text="$t('security_title')" />
      </a>
      <f-tooltip-default :target="() => $refs.security" @shown="shown">
        <div>
          <f-security-icons
            v-if="showTooltip"
            class="f-tooltip-security-icons"
          />
          <!--eslint-disable vue/no-v-html-->
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
import FSvg from '@/components/svg'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import { FSecurityIcons } from '@/import'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'

export default {
  components: {
    FSvg,
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
