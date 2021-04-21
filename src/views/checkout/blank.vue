<template>
  <div class="f-blank">
    <f-header />
    <f-form class="f-wrapper">
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <div v-if="full_screen" class="f-top">
          <div class="f-top-inner" />
        </div>
        <div class="f-method">
          <transition name="f-fade-enter">
            <router-view :order="order" />
          </transition>
          <f-security class="f-center-security" />
        </div>
      </f-scrollbar-vertical>
    </f-form>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import { mapState } from '@/utils/store'

export default {
  components: {
    FHeader,
  },
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
