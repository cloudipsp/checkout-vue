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
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['cdn']),
    ...mapState('options', ['fast']),
    ...mapState('router', ['system']),
    show() {
      return this.list.length
    },
    list() {
      return this.fast.filter(item => item.system !== this.system)
    },
    style() {
      return function(item) {
        return {
          'background-image': `url(${this.cdn}banks/${item}.svg)`,
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
