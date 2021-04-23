import Vue from 'vue'
import { BVTooltip } from 'bootstrap-vue/esm/components/tooltip/helpers/bv-tooltip'
import VTooltipTemplate from '@/components/tooltip/helpers/v-tooltip-template'

export default Vue.extend({
  extends: BVTooltip,
  methods: {
    getTemplate() {
      return VTooltipTemplate
    },
    getContainer() {
      return this.container
        ? this.container.$el || this.container
        : document.body
    },
  },
})
