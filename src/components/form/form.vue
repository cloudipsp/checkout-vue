<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import timeout from '@/mixins/timeout'
import isMounted from '@/mixins/is_mounted'
import { errorHandler } from '@/utils/helpers'

export default {
  mixins: [timeout, isMounted],
  provide() {
    return {
      submit: this.submit,
    }
  },
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
    this.$root.$on('submit', () => {
      this.submit().catch(errorHandler)
    })
  },
  methods: {
    watchMethod() {
      this.$$validator.reset()
      this.isSubmit = false
    },
    submit() {
      this.submited = true
      return this.$nextTick()
        .then(() => this.$$validator.validate())
        .then(isValid => {
          this.isSubmit = true

          if (!isValid) return this.autoFocus(this.errors[0][0])

          return this.formRequest()
        })
        .finally(() => {
          this.submited = false
        })
    },
    autoFocus(id) {
      // mask point
      id = id.replace(/\./g, '\\.')
      let $firstErrorField = this.$el.querySelector(`[name=${id}]`)

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
