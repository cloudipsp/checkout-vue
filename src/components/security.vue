<template>
  <div class="f-security">
    <span class="f-security-content">
      <f-svg ref="security" name="security" size="lg" />
      <span @mouseenter="mouseenter" @mouseleave="mouseleave"
        >Strong Customer Authentication</span
      >
    </span>
    <f-tooltip-default :show.sync="show" :target="() => $refs.security.$el">
      <div class="f-tooltip-security-icons">
        <svg-verified-by-visa />
        <svg-master-card-secure-code />
        <svg-pci-dss />
      </div>
      <div class="f-tooltip-security-content">
        <p>Validated PCI DSS Compliance</p>
        <p>
          Listed on Visa Global Registry and verified by Mastercard
        </p>
      </div>
    </f-tooltip-default>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  methods: {
    mouseenter() {
      this.show = true
    },
    mouseleave() {
      this.show = false
    },
  },
}
</script>
