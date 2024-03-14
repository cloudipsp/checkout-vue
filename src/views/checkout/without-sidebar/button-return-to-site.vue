<template>
  <div :class="$style.wrapper">
    <f-button
      variant="default"
      :text="$t('return_to_site')"
      size="lg"
      block
      :disabled="loading"
      @click="click"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FButton from '@/components/button/button'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButton,
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
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
          model.submitToMerchant()
        })
        .catch(errorHandler)
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  text-align: center;
  margin-top: px-to-rem(32px);
}
</style>
