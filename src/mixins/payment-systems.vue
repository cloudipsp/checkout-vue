<template>
  <div :class="['f-' + router.method]">
    <slot></slot>
    <div v-if="list.length > 1" class="f-block f-title2" v-t="router.method + '_t'"></div>
    <div class="f-block f-text-center" :class="'f-ps-' + list.length">
      <div
        class="f-ps"
        v-for="item in list"
        :key="item"
        @click="setPaymentSystem(item)"
        :class="{active : item === active}"
      >
        <div class="f-icon" :class="'f-i-' + icon(item)"></div>
        <div v-t="text(item)"></div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['paymentSystems'],
    data () {
      return {
        active: ''
      }
    },
    created: function () {
      this.setPaymentSystem()
    },
    computed: {
      list () {
        return this.paymentSystems
      },
      icon: (vm) => (item) => vm.config[item].i || item,
      text: (vm) => (item) => vm.config[item].name || item
    },
    methods: {
      setPaymentSystem: function (system) {
        let active = system || this.router.system || this.list[0]
        this.router.system = active
        this.active = active
      }
    },
    watch: {
      'router.system' (to, from) {
        this.setPaymentSystem()
      }
    }
  }
</script>
