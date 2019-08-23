<template>
  <div class="f-methods" :class="{ 'f-open': store.state.showChangeMethods }">
    <f-menu @on-change-method="changeMethod"></f-menu>
    <template v-if="showFast">
      <div v-t="'fast'" class="f-block-hr f-title f-hidden-mobile" />
      <div v-t="'fast'" class="f-block f-title3 f-visible-mobile" />
      <div class="f-block f-fast-access">
        <div
          v-for="item in list"
          :key="item.system"
          class="f-icon"
          :class="'f-i-' + item.system"
          :style="style(item.system)"
          @click="changeMethod(item.method, item.system)"
        />
      </div>
    </template>
  </div>
</template>

<script>
import configPaymentSystems from '@/config/payment-systems'

export default {
  data() {
    return {
      configPaymentSystems: configPaymentSystems,
    }
  },
  computed: {
    showFast: function() {
      return this.list.length
    },
    list: function() {
      return this.options.fast.filter(
        item => item.system !== this.router.system
      )
    },
    style: function() {
      return function(item) {
        return {
          'background-image':
            'url(' + this.store.state.cdn + 'banks/' + item + '.svg)',
        }
      }
    },
  },
  methods: {
    changeMethod: function(method, system) {
      this.store.location('payment-method', method, system)
      this.store.state.showChangeMethods = false
    },
  },
}
</script>
