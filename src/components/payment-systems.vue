<template>
  <div :class="name">
    <div class="f-block f-title2">{{title}}</div>
    <div class="f-block text-center" :class="'f-ps-' + paymentSystems.length">
      <div
        class="f-ps"
        v-if="item in config"
        v-for="item in paymentSystems"
        :key="item"
        @click="setPaymentSystem(item)"
        :class="{active : item === active}"
      >
        <div class="f-icon" :class="config[item].icon"></div>
        <div>{{ config[item].name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['paymentSystems'],
    created: function () {
      this.setPaymentSystem(this.$route.params.system || this.paymentSystems[0])
    },
    methods: {
      setPaymentSystem: function (id) {
        this.active = id
        this.$router.push({name: 'method', params: { system: id }})
      }
    },
    watch: {
      '$route' (to, from) {
        this.active = to.params.system
      }
    }
  }
</script>
