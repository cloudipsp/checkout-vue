<template>
  <div class="f-sepa">
    <div v-text="$t('sepa_t')" />

    <f-form-group v-model="params[name]" :name="name" rules="required|alpha" />
    <f-form-group
      v-model="params[surmane]"
      :name="surmane"
      rules="required|alpha"
    />
    <div class="f-row">
      <div class="f-col">
        <f-form-group v-model="params[bic]" :name="bic" rules="required" />
      </div>
      <div class="f-col">
        <f-form-group v-model="params[iban]" :name="iban" rules="required" />
      </div>
    </div>

    <f-offer />
    <f-button-pay />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  data() {
    return {
      name: 'sender_name',
      surmane: 'sender_familyName',
      bic: 'bic',
      iban: 'iban',
    }
  },
  computed: {
    ...mapState(['params']),
  },
}
</script>
