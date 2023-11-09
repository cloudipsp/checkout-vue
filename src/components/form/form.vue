<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
import { mapStateGetSet } from '@/utils/store'
import { isMountedMixin } from '@/mixins/is-mounted'
import { errorHandler } from '@/utils/helpers'
import { attemptFocus } from '@/utils/dom'

export default {
  mixins: [isMountedMixin],
  inject: ['formRequest'],
  provide() {
    const form = {}

    Object.defineProperty(form, 'disabled', {
      enumerable: true,
      get: () => this.disabled,
    })

    return {
      submit: this.submit,
      validate: this.validate,
      form,
    }
  },
  computed: {
    ...mapStateGetSet(['submited', 'isSubmit']),
    observer() {
      if (!this.isMounted) return
      return this.$refs.observer
    },
    errors() {
      if (!this.isMounted) return
      return Object.entries(this.observer.errors).filter(
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
  watch: {
    $route: 'watchRoute',
    disabled: 'watchDisabled',
  },
  created() {
    this.$root.$on('submit', () => {
      this.submit().catch(errorHandler)
    })
  },
  methods: {
    watchRoute() {
      this.observer.reset()
      this.isSubmit = false
    },
    watchDisabled(disabled) {
      this.$root.$emit('disabled', disabled)
    },
    submit(data) {
      this.submited = true
      return this.$nextTick()
        .then(() => this.validate())
        .then(() => {
          return this.formRequest(data)
        })
        .finally(() => {
          this.submited = false
        })
    },
    validate() {
      return this.observer.validate().then(isValid => {
        this.isSubmit = true

        if (!isValid) return this.autoFocus(this.errors[0][0])
      })
    },
    autoFocus(id) {
      // mask point
      id = id.replace(/\./g, '\\.')
      let $firstErrorField = this.$el.querySelector(`[name=${id}]`)

      if (!$firstErrorField) return Promise.reject()

      $firstErrorField.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      })

      attemptFocus($firstErrorField)

      return Promise.reject()
    },
  },
}
</script>
