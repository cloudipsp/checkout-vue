<template>
  <f-modal-base
    v-if="isCodeMessage"
    v-model="show"
    v-bind="attrs"
    v-on="$listeners"
  >
    <template #modal-title>
      <svg-decline />
      <h5 v-t="'declined'" class="f-modal-title" />
    </template>
    <p>
      <b>{{ code }}</b> {{ message }}
    </p>
  </f-modal-base>
  <f-modal-base v-else v-model="show" v-bind="attrs" v-on="$listeners">
    <template #modal-title>
      <svg-server-trouble />
      <h5 v-t="'server_trouble_title'" class="f-modal-title" />
    </template>

    <p v-t="'server_trouble_desc'" />
  </f-modal-base>
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  computed: {
    ...mapStateGetSet('error', ['show']),
    ...mapState('error', ['code', 'message']),
    attrs() {
      return {
        titleTag: 'div',
        ...this.$attrs,
      }
    },
    isCodeMessage() {
      return this.code || this.message
    },
  },
}
</script>
