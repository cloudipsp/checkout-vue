<template>
  <div>
    <f-header back />
    <f-form class="f-wrapper">
      <f-sidebar />
      <f-scrollbar-vertical class="f-center" wrap-class="f-center-wrap">
        <div v-if="full_screen" class="f-top">
          <div class="f-top-inner" />
        </div>
        <div :class="className">
          <transition name="f-fade-enter">
            <router-view :class="classNameInner" />
          </transition>
          <f-security class="f-center-security" />
        </div>
      </f-scrollbar-vertical>
    </f-form>
  </div>
</template>

<script>
import FHeader from '@/components/header'
import FForm from '@/components/form/form'
import FSidebar from '@/components/sidebar'
import FScrollbarVertical from '@/components/scrollbar-vertical'
import FSecurity from '@/components/security'
import { mapState } from '@/utils/store'

export default {
  components: {
    FHeader,
    FForm,
    FSidebar,
    FScrollbarVertical,
    FSecurity,
  },
  computed: {
    ...mapState('options', ['full_screen']),
    className() {
      return ['f-method', `f-method-${this.$route.name}`]
    },
    classNameInner() {
      return `f-method-${this.$route.meta.method || this.$route.name}-inner`
    },
  },
}
</script>
