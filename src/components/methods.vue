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
    <div class="f-block-hr f-title f-hidden-mobile" v-t="'fast'"></div>
    <div class="f-block f-title3 f-visible-mobile" v-t="'fast'"></div>
    <div class="f-block f-fast-access">
      <div
        class="f-icon"
        v-if="item.system !== router.system"
        v-for="item in options.fast"
        :key="item.system"
        :class="'f-i-' + configPaymentSystems[item.method][item.system].i"
        @click="changeMethod(item.method, item.system )"
      ></div>
    </div>
  </div>
</template>

<script>
  import configPaymentSystems from '@/config/payment-systems'

  export default {
    data () {
      return {
        configPaymentSystems: configPaymentSystems
      }
    },
    methods: {
      changeMethod: function (method, system) {
//        console.log(method, system)
        this.router.page = 'payment-method'
        this.router.method = method
        this.router.system = system
        this.$emit('on-change-method')
      }
    }
  }
</script>
