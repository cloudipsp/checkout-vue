<template>
  <div class="f-menu">
    <div v-t="'methods'" class="f-block-hr f-title f-hidden-mobile" />
    <div v-t="'methods_m'" class="f-block f-title3 f-visible-mobile" />
    <div class="f-block-hr">
      <template v-for="item in methods">
        <f-button-pay-wallet
          v-if="show(item)"
          :key="item"
          tab="wallets"
          position="bottom"
        >
          <template #default="{ open, classButton }">
            <div v-t="item" :class="className(item)" @click="open" />
            <div style="display: none" :class="classButton" />
          </template>
        </f-button-pay-wallet>
        <div
          v-else
          :key="item"
          v-t="item"
          :class="className(item)"
          @click="click(item)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('options', ['methods']),
    ...mapState('router', ['method']),
    show() {
      return function(item) {
        return item === 'wallets'
      }
    },
    className() {
      return function(item) {
        return ['f-item', 'f-i-' + item, { active: this.method === item }]
      }
    },
  },
  methods: {
    click(method) {
      this.store.location('payment-method', method)
    },
  },
}
</script>
