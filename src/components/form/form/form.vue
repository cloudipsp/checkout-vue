<template>
  <ValidationObserver ref="form" tag="div">
    <slot :submit="submit" :disabled="disabled" />
  </ValidationObserver>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import { isMountedMixin } from '@/mixins/is-mounted'
import { select, attemptFocus } from '@/utils/dom'

export default {
  components: {
    ValidationObserver,
  },
  mixins: [isMountedMixin],
  provide() {
    return {
      submit: this.submit,
    }
  },
  data() {
    return {
      isSubmit: false,
    }
  },
  computed: {
    form() {
      if (!this.isMounted) return
      return this.$refs.form
    },
    errors() {
      if (!this.isMounted) return

      return Object.entries(this.form.errors).filter(
        ([, value]) => value.length
      )
    },
    isError() {
      if (!this.isMounted) return false
      return !!this.errors.length
    },
    disabled() {
      return this.isError && this.isSubmit
    },
  },
  methods: {
    submit() {
      this.isSubmit = true

      return this.form.validate().then(isValid => {
        if (isValid) {
          this.$emit('submit')
        } else {
          this.autoFocus()
        }
      })
    },
    autoFocus() {
      const name = this.errors[0][0]
      const el = select(`[name=${name}]`, this.$el)

      attemptFocus(el)
    },
  },
}
</script>
