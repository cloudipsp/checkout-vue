<template>
  <div :class="className">
    <transition name="f-fade-enter">
      <router-view :class="classNameInner" />
    </transition>
    <f-security class="f-center-security" />
  </div>
</template>

<script>
export default {
  computed: {
    className() {
      return ['f-method', `f-method-${this.$route.name}`]
    },
    classNameInner() {
      return `f-method-${this.$route.name}-inner`
    },
  },
}
</script>
