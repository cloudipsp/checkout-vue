<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import timeout from '@/mixins/timeout'
import isMounted from '@/mixins/is_mounted'

export default {
  mixins: [timeout, isMounted],
  provide() {
    return {
      submit: this.submit,
    }
  },
  inject: ['$validator'],
  props: {
    formRequest: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapState('router', ['method']),
    ...mapStateGetSet(['submited', 'isSubmit']),
    $$validator() {
      if (!this.isMounted) return
      return this.$refs.observer
    },
    errors() {
      if (!this.isMounted) return
      return Object.entries(this.$$validator.ctx.errors).filter(
        ([, value]) => value.length
      )
    },
  },
  watch: {
    method: 'watchMethod',
  },
  created() {
    this.$root.$on('submit', this.submit)
  },
  methods: {
    watchMethod() {
      this.$$validator.reset()
      this.isSubmit = false
    },
    submit() {
      this.submited = true
      return this.$nextTick()
        .then(() =>
          Promise.all([
            this.$validator.validateAll(),
            this.$$validator.validate(),
          ])
        )
        .then(([isValid, isValidNew]) => {
          this.isSubmit = true
          // this.deprecatedErrors.items this.fields this.deprecatedErrors.clear() this.deprecatedErrors.count()

          if (!isValid)
            return this.autoFocus(this.deprecatedErrors.items[0].field)
          if (!isValidNew) return this.autoFocus(this.errors[0][0])

          return this.formRequest()
        })
        .finally(() => {
          this.submited = false
        })
    },
    autoFocus(id) {
      let $firstErrorField = this.$el.querySelector(
        '#' + id.replace(/\./g, '\\.')
      )

      if (!$firstErrorField) return Promise.reject()

      if (this.full_screen) {
        $firstErrorField.scrollIntoView()
      }

      this.timeout(() => {
        $firstErrorField.focus()
      })

      return Promise.reject()
    },
  },
}
</script>
