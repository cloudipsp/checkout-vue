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
    return {
      submit: this.submit,
      validate: this.validate,
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
