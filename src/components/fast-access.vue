<template>
  <div v-if="show" class="f-fast-access">
    <div v-t="'fast'" class="f-block-hr f-title f-hidden-mobile" />
    <div v-t="'fast'" class="f-block f-title3 f-visible-mobile" />
    <div class="f-block f-block-hr">
      <div
        v-for="item in list"
        :key="item.system"
        class="f-icon"
        :class="className(item)"
        :style="style(item.system)"
        @click="click(item)"
      />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    show() {
      return this.list.length
    },
    list() {
      return this.store.state.options.fast.filter(
        item => item.system !== this.store.state.router.system
      )
    },
    style() {
      return function(item) {
        return {
          'background-image':
            'url(' + this.store.state.cdn + 'banks/' + item + '.svg)',
        }
      }
    },
    className() {
      return function(item) {
        return 'f-i-' + item.system
      }
    },
  },
  methods: {
    click({ method, system }) {
      this.store.location('payment-method', method, system)
    },
  },
}
</script>
