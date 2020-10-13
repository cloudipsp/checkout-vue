<template>
  <div class="f-menu">
    <template v-for="method in list">
      <button
        :key="method"
        type="button"
        :class="className(method)"
        @click.prevent="click(method)"
      >
        <f-svg
          class="f-menu-icon"
          :name="icon[method] || method"
          size="lg"
          fw
        />
        <span v-t="method" />
        <f-icons class="f-menu-icons" :type="method" position="sidebar" />
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FIcons from '@/components/icons'
import resize from '@/mixins/resize'
import { removeWallets } from '@/utils/helpers'

export default {
  components: {
    FIcons,
  },
  mixins: [resize],
  data() {
    return {
      icon: {
        sepa: 'local',
        banklinks_eu: 'bank',
        local_methods: 'local',
      },
    }
  },
  computed: {
    ...mapState('options', ['methods']),
    ...mapState('router', ['method']),
    ...mapState(['options']),
    className() {
      return function(item) {
        return [
          'f-menu-item',
          { active: this.method === item && !this.isBreakpointMd },
        ]
      }
    },
    list() {
      return this.methods.filter(removeWallets)
    },
  },
  methods: {
    click(method) {
      this.store.location('payment-method', method)
    },
  },
}
</script>
