<template>
  <a v-if="show" v-t="'cancel'" :class="className" @click.prevent="click" />
</template>

<script>
import { sendRequest } from '@/utils/helpers'

export default {
  computed: {
    show() {
      return this.store.state.options.cancel
    },
    className() {
      return [this.$css.btn, 'f-btn-link', 'f-btn-block']
    },
  },
  methods: {
    click($event) {
      $event.preventDefault()

      if (this.store.state.loading) return
      this.store.formLoading(true)
      sendRequest('api.checkout.order', 'get', this.params)
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.location, this.location)
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
    location(model) {
      if (!model.submitToMerchant()) {
        location.assign(this.store.state.options.link)
      }
    },
  },
}
</script>
