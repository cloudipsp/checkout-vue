<template>
  <div :class="['f-' + router.method]">
    <div class="f-block f-title2" v-t="router.method + '_t'"></div>
    <div class="f-block f-text-center" :class="'f-ps-' + paymentSystems.length">
      <div
        class="f-ps"
        v-if="item in config"
        v-for="item in paymentSystems"
        :key="item"
        @click="setPaymentSystem(item)"
        :class="{active : item === active}"
      >
        <div class="f-icon" :class="'f-i-' + config[item].icon"></div>
        <div>{{ config[item].name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    props: ['paymentSystems'],
    data () {
      return {
        router: store.state.router,
        active: ''
      }
    },
    created: function () {
      this.setPaymentSystem()
    },
    methods: {
      setPaymentSystem: function (system) {
        this.router.system = system || this.router.system || this.paymentSystems[0]
        this.active = this.router.system
      }
    },
    watch: {
      'router.system' (to, from) {
        this.setPaymentSystem()
      }
    }
  }
</script>
