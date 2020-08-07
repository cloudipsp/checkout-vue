<template>
  <f-alert-base v-bind="attrs" v-on="$listeners">
    <span v-t="'alert_gdpr_text'" />&nbsp;
    <a v-t="'learn_more'" href="#" @click="showGdprText = true" />

    <f-modal-base v-model="showGdprText" header-class="f-p-0">
      <span v-t="'modal_gdpr_text'" />
    </f-modal-base>
  </f-alert-base>
</template>

<script>
export default {
  model: {
    prop: 'show',
    event: 'input',
  },
  data() {
    return {
      showGdprText: false,
    }
  },
  computed: {
    attrs() {
      return {
        dismissible: true,
        class: 'f-gdpr-frame',
        ...this.$attrs,
      }
    },
  },
}
</script>
