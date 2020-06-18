import Vue from 'vue'
import { BTooltip } from 'bootstrap-vue'
import VTooltip from './v-tooltip'

export default Vue.extend({
  extends: BTooltip,
  methods: {
    getComponent() {
      return VTooltip
    },
  },
})
