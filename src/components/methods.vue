<template>
  <div>
    <div class="f-block-hr f-title f-hidden-mobile" v-t="'methods'"></div>
    <div class="f-block f-title3 f-visible-mobile" v-t="'methods_m'"></div>
    <div class="f-menu f-block-hr">
      <div
        class="f-item"
        :class="['f-i-' + item, {active: router.method === item}]"
        v-for="item in options.methods"
        :key="item"
        @click="changeMethod(item)"
        v-t="item"
      >
      </div>
    </div>
    <template v-if="showFast">
      <div class="f-block-hr f-title f-hidden-mobile" v-t="'fast'"></div>
      <div class="f-block f-title3 f-visible-mobile" v-t="'fast'"></div>
      <div class="f-block f-fast-access">
        <div
          class="f-icon"
          v-for="item in list"
          :key="item.system"
          :class="'f-i-' + item.system"
          @click="changeMethod(item.method, item.system )"
          :style="style(item.system)"
        ></div>
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
          'background-image': 'url(' + this.store.state.cdn + item + '.svg)',
        }
      }
    },
  },
  methods: {
    changeMethod: function(method, system) {
      this.store.location('payment-method', method, system)
      this.$emit('on-change-method')
    },
  },
}
</script>
