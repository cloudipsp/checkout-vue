<template>
  <f-alert-base ref="alert" v-bind="attrs" v-on="$listeners">
    <div class="f-gdpr-content">
      <div class="f-form-group">
        <span v-text="$t('gdpr_alert_text')" />&nbsp;
        <a href="#" @click="showGdprText = true" v-text="$t('learn_more')" />
        <f-modal-base v-model="showGdprText" header-class="f-p-0">
          <span v-text="$t(`gdpr_modal_text_${region}`)" />
        </f-modal-base>
      </div>

      <f-form-base>
        <f-form-group
          v-model="save_card"
          name="save_card"
          component="checkbox"
          variant="secondary"
        >
          <span v-text="$t('save_card')" />&nbsp;
          <a href="#" @click="showGdprSafe = true" v-text="$t('its_safe')" />
        </f-form-group>
      </f-form-base>

      <f-modal-base v-model="showGdprSafe" size="lg">
        <template #modal-title>
          <svg-safe />
          <h5 class="f-modal-title" v-text="$t('gdpr_modal_safe_title')" />
        </template>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="$t('gdpr_modal_safe')" />
      </f-modal-base>
    </div>
    <div class="f-gdpr-buttons">
      <f-button-link variant="secondary" @click="close" v-text="$t('close')" />
      <f-button variant="secondary" text="accept" @click="accept" />
    </div>
  </f-alert-base>
</template>

<script>
import FAlertBase from '@/components/alert/alert-base'
import FFormBase from '@/components/form/form/form-base'
import SvgSafe from '@/svg/safe'
import FButtonLink from '@/components/button/button-link'

import {
  mapState,
  mapStateGetSet,
  localStorage,
  sessionStorage,
} from '@/utils/store'

export default {
  components: {
    FAlertBase,
    FFormBase,
    SvgSafe,
    FButtonLink,
  },
  model: {
    prop: 'show',
    event: 'input',
  },
  data() {
    return {
      showGdprText: false,
      showGdprSafe: false,
    }
  },
  computed: {
    ...mapState(['region']),
    ...mapStateGetSet('params', ['save_card']),
    attrs() {
      return {
        class: 'f-gdpr',
        ...this.$attrs,
      }
    },
  },
  methods: {
    close() {
      sessionStorage.set('show_gdpr_frame', 1)
      this.$emit('input', false)
    },
    accept() {
      localStorage.set('show_gdpr_frame', 1)
      localStorage.set('save_card', this.save_card)
      this.$emit('input', false)
    },
  },
}
</script>
