<template>
  <ValidationProvider v-bind="attrs">
    <slot :invalid="hasError" />
    <transition name="f-slide-fade">
      <div v-if="showError" :class="$style.error">{{ error }}</div>
    </transition>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate'
import { isMountedMixin } from '@/mixins/is-mounted'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mapState } from '@/utils/store'

export default {
  components: {
    ValidationProvider,
  },
  mixins: [isMountedMixin],
  inheritAttrs: false,
  props: {
    name: makeProp(PROP_TYPE_STRING),
    rules: makeProp(PROP_TYPE_OBJECT_STRING),
    disabled: makeProp(PROP_TYPE_BOOLEAN),
    focused: makeProp(PROP_TYPE_BOOLEAN),
  },
  computed: {
    // TODO
    ...mapState(['isSubmit']),
    attrs() {
      return {
        ref: 'validation',
        class: this.$style.wrapper,
        // Identifier used for target/cross-field based rules.
        vid: this.name,
        // A string that will be used to replace {field} in error messages and for custom error messages.
        name: this.name,
        rules: this.rules,
        tag: 'div',
        disabled: this.disabled,
      }
    },
    showError() {
      return this.hasError && this.focused
    },
    hasError() {
      return this.error && (this.touched || this.isSubmit)
    },
    error() {
      if (!this.isMounted) return null
      return this.$refs.validation.errors[0]
    },
    touched() {
      if (!this.isMounted) return
      return this.$refs.validation.flags.touched
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(16px);
}

.error {
  margin-top: px-to-rem(4px);
  font-weight: 500;
  color: $error;
}
</style>
