import Vue from 'vue'
import { BVTooltip } from 'bootstrap-vue/esm/components/tooltip/helpers/bv-tooltip'
import TooltipTemplate from '@/components/tooltip/helpers/tooltip-template'

export default Vue.extend({
  extends: BVTooltip,
  methods: {
    getTemplate() {
      return TooltipTemplate
    },
    getContainer() {
      return this.container
        ? this.container.$el || this.container
        : document.body
    },
  },
})
