<template>
  <div class="f-security">
    <span class="f-title-security" @click="open">
      <f-svg ref="security" name="security" size="lg" />
      <span
        v-t="'security_title'"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      />
    </span>
    <f-modal-base v-if="isMobile" v-model="showModal">
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
    <f-tooltip-default
      v-else
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
      isMobile: false,
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
    resize() {
      let width = document.documentElement.clientWidth

      this.isMobile = width < 576
    },
  },
}
</script>
