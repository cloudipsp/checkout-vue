<template>
  <f-modal-base
    v-if="isCodeMessage"
    v-model="show"
    v-bind="attrs"
    v-on="$listeners"
  >
    <template #title>
      <svg-decline :slass="$style.svg" />
      <h5 class="f-modal-title" v-text="$t('declined')" />
    </template>
    <p>
      <b>{{ code }}</b> {{ message }}
    </p>
  </f-modal-base>
  <f-modal-base v-else v-model="show" v-bind="attrs" v-on="$listeners">
    <template #title>
      <svg-server-trouble :slass="$style.svg" />
      <h5 class="f-modal-title" v-text="$t('server_trouble_title')" />
    </template>

    <p v-text="$t('server_trouble_desc')" />
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import SvgServerTrouble from '@/svg/server-trouble.svg'
import SvgDecline from '@/svg/decline.svg'
import { mapState, mapStateGetSet } from '@/utils/store'

export default {
  components: {
    FModalBase,
    SvgServerTrouble,
    SvgDecline,
  },
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

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}
</style>
