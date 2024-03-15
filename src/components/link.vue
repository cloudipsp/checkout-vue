<template>
  <component :is="tag" v-bind="attrs" v-on="$listeners">
    <slot />
  </component>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'

export default {
  components: {
    FButtonUnstyled,
  },
  computed: {
    tag() {
      return this.$attrs.href ? 'a' : 'f-button-unstyled'
    },
    attrs() {
      return {
        ...this.$attrs,
        class: this.$style.wrapper,
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  font-weight: 400;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  color: #08a835;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
}
</style>
