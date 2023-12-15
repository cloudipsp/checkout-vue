<template>
  <f-alert-base v-bind="attrs" v-on="fListeners">
    <div class="f-notification-icon">
      <f-svg name="warning" size="lg" />
    </div>
    <div class="f-notification-text">{{ $t(notification) }}</div>
    <div class="f-notification-btn">
      <f-button-link @click="close">{{ $t('close') }}</f-button-link>
    </div>
  </f-alert-base>
</template>

<script>
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { mapState } from '@/utils/store'
import FAlertBase from '@/components/alert/alert-base'
import FButtonLink from '@/components/button/button-link'
import FSvg from '@/components/svg'

export default {
  components: {
    FAlertBase,
    FButtonLink,
    FSvg,
  },
  mixins: [attrsMixin, listenersMixin],
  model: {
    prop: 'show',
    event: 'input',
  },
  computed: {
    ...mapState(['notification']),
    attrs() {
      return {
        class: 'f-notification',
        variant: 'warning',
        ...this.fAttrs,
      }
    },
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
  },
}
</script>
