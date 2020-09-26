<template>
  <f-alert-base v-if="show" ref="alert" v-bind="attrs" v-on="$listeners">
    <div class="f-gdpr-content">
      <div class="f-form-group">
        <span v-t="'gdpr_alert_text'" />&nbsp;
        <a v-t="'learn_more'" href="#" @click="showGdprText = true" />
        <f-modal-base v-model="showGdprText" header-class="f-p-0">
          <span v-t="`gdpr_modal_text_${region}`" />
        </f-modal-base>
      </div>

      <input-checkbox name="save_card" variant="secondary">
        <span v-t="'save_card'" />&nbsp;
        <a v-t="'its_safe'" href="#" @click="showGdprSafe = true" />
        <f-modal-base v-model="showGdprSafe" header-class="f-p-0">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="$t('gdpr_modal_safe')" />
        </f-modal-base>
      </input-checkbox>
    </div>
    <div class="f-gdpr-buttons">
      <f-button-link v-t="'close'" variant="secondary" @click="close" />
      <f-button variant="secondary" text="accept" @click="accept" />
    </div>
  </f-alert-base>
</template>

<script>
import { mapState, localStorage, sessionStorage } from '@/utils/store'

export default {
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
    ...mapState('params', ['save_card']),
    show() {
      if (localStorage.get('show_gdpr_frame')) return false
      return !sessionStorage.get('show_gdpr_frame')
    },
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
