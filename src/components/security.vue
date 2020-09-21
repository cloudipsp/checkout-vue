<template>
  <div class="f-security">
    <template v-if="isPhone">
      <a href="#" class="f-title-security" @click.prevent="open">
        <f-svg ref="security" name="security" size="2x" />
        <span v-t="'security_title'" />
      </a>
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
      <a href="#" class="f-title-security" tabindex="-1" @click.prevent>
        <f-svg ref="security" name="security" size="2x" tabindex="0" />
        <span
          v-t="'security_title'"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
        />
      </a>
      <f-tooltip-default
        :show.sync="showTooltip"
        :target="() => $refs.security && $refs.security.$el"
      >
        <div>
          <div class="f-tooltip-security-icons">
            <svg-verified-by-visa />
            <svg-master-card-secure-code />
            <svg-pci-dss />
          </div>
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
import mobile from '@/mixins/mobile'

export default {
  mixins: [mobile],
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
