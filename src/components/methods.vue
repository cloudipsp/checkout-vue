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
    <template v-if="!hideTitle">
      <div class="f-block-hr f-title f-hidden-mobile" v-t="'fast'"></div>
      <div class="f-block f-title3 f-visible-mobile" v-t="'fast'"></div>
    </template>
    <div class="f-block f-fast-access">
      <div
        class="f-icon"
        v-if="item.system !== router.system"
        v-for="item in options.fast"
        :key="item.system"
        :class="'f-i-' + item.system"
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
    computed: {
      hideTitle: function (){
        return this.options.fast.length === 1 && this.options.fast[0].system === this.router.system
      }
    },
    methods: {
      changeMethod: function (method, system) {
        this.store.location('payment-method', method, system)
        this.$emit('on-change-method')
      }
    }
  }
</script>
