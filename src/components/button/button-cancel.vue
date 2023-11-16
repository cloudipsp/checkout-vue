<template>
  <div :class="$style.wrapper">
    <f-button-link variant="default" @click="click">{{
      $t('cancel')
    }}</f-button-link>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FButtonLink from '@/components/button/button-link'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButtonLink,
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    ...mapState(['cancel_url']),
    ...mapState('params', ['token']),
  },
  methods: {
    click() {
      if (this.loading) return
      this.loading = true

      this.store
        .sendRequest('api.checkout.order', 'get', {
          token: this.token,
        })
        .then(model => {
          const method = model.attr('method')
          const data = model.attr('order_data')

          if (!this.cancel_url || !method || !data) return

          model.formDataSubmit(this.cancel_url, data, '_self', method)
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
  margin-top: px-to-rem(16px);
}
</style>
