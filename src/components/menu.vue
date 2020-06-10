<template>
  <div class="f-menu">
    <div class="f-title">Or use another payment method</div>
    <template v-for="method in methods">
      <div :key="method" :class="className(method)" @click="click(method)">
        <f-svg class="f-menu-icon" :name="icon[method]" size="lg" fw />
        <span v-t="method" />
        <f-icons class="f-menu-icons" :list="icons(method)" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FIcons from '@/components/icons'

export default {
  components: {
    FIcons,
  },
  data() {
    return {
      icon: {
        card: 'card',
        emoney: 'wallet',
        ibank: 'bank',
        trustly: 'bank',
        cash: 'local',
        sepa: 'local',
        banklinks_eu: 'bank',
      },
    }
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState('router', ['method']),
    ...mapState(['options']),
    icons() {
      return function(method) {
        return this.options[method + '_icons']
      }
    },
    className() {
      return function(item) {
        return ['f-menu-item', { active: this.method === item }]
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
