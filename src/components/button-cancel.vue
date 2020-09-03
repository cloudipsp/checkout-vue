<template>
  <a v-if="show" v-t="'cancel'" :class="className" @click.prevent="click" />
</template>

<script>
import { sendRequest, errorHandler } from '@/utils/helpers'
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['css', 'loading']),
    ...mapState('options', ['link']),
    ...mapState('options', { show: 'cancel' }),
    className() {
      return [this.css.btn, 'f-btn-link', 'f-btn-block', 'f-button-cancel']
    },
  },
  methods: {
    click($event) {
      $event.preventDefault()

      if (this.loading) return
      this.store.formLoading(true)
      sendRequest('api.checkout.order', 'get', this.store.formParams())
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.location, this.location)
        .catch(errorHandler)
    },
    location(model) {
      if (!model.submitToMerchant()) {
        location.assign(this.link)
      }
    },
  },
}
</script>
