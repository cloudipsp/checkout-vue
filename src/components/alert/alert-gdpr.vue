<template>
  <f-alert-storage name="show_gdpr_frame" @ok="ok">
    <div class="f-mb-16">
      <span v-text="$t('gdpr_alert_text')" />&nbsp;
      <a href="#" @click="showGdprText = true" v-text="$t('learn_more')" />
      <f-modal-base v-model="showGdprText" header-class="f-p-0">
        <span v-html="$t('gdpr_modal_text')" />
      </f-modal-base>
    </div>

    <f-form-base>
      <f-form-group
        v-model="save_card"
        class="f-mb-0"
        name="save_card"
        component="checkbox"
        variant="secondary"
      >
        <span v-text="$t('remember_card_for_quick_re_payment')" />&nbsp;
        <a href="#" @click="showGdprSafe = true" v-text="$t('its_safe')" />
      </f-form-group>
    </f-form-base>

    <f-modal-base v-model="showGdprSafe" size="lg">
      <template #title>
        <svg-safe :slass="$style.svg" />
        <h5 class="f-modal-title" v-text="$t('gdpr_modal_safe_title')" />
      </template>

      <div v-html="$t('gdpr_modal_safe')" />
    </f-modal-base>
  </f-alert-storage>
</template>

<script>
import FAlertStorage from '@/components/alert/alert-storage'
import FModalBase from '@/components/modal/modal-base'
import FFormBase from '@/components/form/form/form-base'
import SvgSafe from '@/svg/safe.svg'

import { mapStateGetSet, localStorage } from '@/utils/store'

export default {
  components: {
    FAlertStorage,
    FModalBase,
    FFormBase,
    SvgSafe,
  },
  data() {
    return {
      showGdprText: false,
      showGdprSafe: false,
    }
  },
  computed: {
    ...mapStateGetSet('params', ['save_card']),
  },
  methods: {
    ok() {
      localStorage.set('save_card', this.save_card)
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin: px-to-rem(-16px) 0;
}
</style>
