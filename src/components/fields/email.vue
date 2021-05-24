<template>
  <f-preloader :condition="show" class="f-mb-3">
    <f-form-group
      v-model.trim="email"
      input-class="f-checkout-email"
      name="email"
      :rules="rules"
      autocomplete="email"
    />
  </f-preloader>
</template>

<script>
import FPreloader from '@/components/preloader'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FPreloader,
  },
  computed: {
    ...mapState(['need_validate_card']),
    ...mapState('options', { show: 'email' }),
    ...mapStateGetSet('params', ['email']),
    rules() {
      return this.need_validate_card ? 'required|email' : ''
    },
  },
}
</script>
