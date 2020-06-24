<template>
  <div class="f-security">
    <template v-if="isMobile">
      <span class="f-title-security" @click="open">
        <f-svg ref="security" name="security" size="lg" />
        <span v-t="'security_title'" />
      </span>
      <f-modal-base v-model="showModal">
        <div class="f-modal-security-title">
          <f-svg name="security" size="lg" />
          <span v-t="'security_title'" />
        </div>
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="f-modal-security-content" v-html="$t('security_text')" />
        <div class="f-modal-security-icons">
          <svg-verified-by-visa />
          <svg-master-card-secure-code />
          <svg-pci-dss />
        </div>
      </f-modal-base>
    </template>
    <template v-else>
      <span class="f-title-security">
        <f-svg ref="security" name="security" size="lg" />
        <span
          v-t="'security_title'"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
        />
      </span>
      <f-tooltip-default
        :show.sync="showTooltip"
        :target="() => $refs.security.$el"
      >
        <div class="f-tooltip-security-icons">
          <svg-verified-by-visa />
          <svg-master-card-secure-code />
          <svg-pci-dss />
        </div>
        <!--eslint-disable-next-line vue/no-v-html-->
        <div class="f-tooltip-security-content" v-html="$t('security_text')" />
      </f-tooltip-default>
    </template>
  </div>
</template>

<script>
import Resize from '@/mixins/resize'

export default {
  mixins: [Resize],
  data() {
    return {
      showTooltip: false,
      showModal: false,
    }
  },
  methods: {
    mouseenter() {
      this.showTooltip = true
    },
    mouseleave() {
      this.showTooltip = false
    },
    open() {
      this.showModal = true
    },
  },
}
</script>
