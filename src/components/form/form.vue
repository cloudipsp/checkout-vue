<template>
  <ValidationObserver ref="observer" tag="div">
    <slot />
  </ValidationObserver>
</template>

<script>
import { mapStateGetSet } from '@/utils/store'
import timeout from '@/mixins/timeout'
import isMounted from '@/mixins/is_mounted'
import { errorHandler } from '@/utils/helpers'

export default {
  mixins: [timeout, isMounted],
  inject: ['formRequest'],
  provide() {
    return {
      submit: this.submit,
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
  },
  watch: {
    $route: 'watchRoute',
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
    submit(data) {
      this.submited = true
      return this.$nextTick()
        .then(() => this.observer.validate())
        .then(isValid => {
          this.isSubmit = true

          if (!isValid) return this.autoFocus(this.errors[0][0])

          return this.formRequest(data)
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
