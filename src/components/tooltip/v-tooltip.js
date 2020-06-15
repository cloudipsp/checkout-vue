import Vue from 'vue'
import { BVTooltip } from 'bootstrap-vue/src/components/tooltip/helpers/bv-tooltip'
import VTooltipTemplate from './v-tooltip-template'

export default Vue.extend({
  extends: BVTooltip,
  methods: {
    getTemplate() {
      return VTooltipTemplate
    },
  },
})
