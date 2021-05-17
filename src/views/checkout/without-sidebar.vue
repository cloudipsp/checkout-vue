<template>
  <div class="f-without-sidebar">
    <f-header />
    <div class="f-wrapper">
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <div v-if="full_screen" class="f-top">
          <div class="f-top-inner" />
        </div>
        <div class="f-method">
          <transition name="f-fade-enter">
            <router-view />
          </transition>
          <f-security class="f-center-security" />
        </div>
      </f-scrollbar-vertical>
    </div>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FSecurity from '@/components/security'
import { mapState } from '@/utils/store'
import { createdButtonPayWalletMixin } from '@/mixins/created-button-pay-wallet'

export default {
  components: {
    FHeader,
    FScrollbarVertical,
    FSecurity,
  },
  mixins: [createdButtonPayWalletMixin],
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState('options', ['full_screen']),
  },
}
</script>
