<template>
  <div>
    <div class="f-system">
      <f-icon :name="logo" :type="method" class="f-system-icon" size="48" />
      <div class="f-system-name">{{ name }}</div>

      <div>{{ iban }}</div>
      <f-button-close class="f-system-close" @click="goMethod" />
    </div>
    <div class="f-bank-desc" v-text="$t('bank_desc')" />
    <div class="f-container-sm">
      <f-fields-bank :fields="form.fields" />
      <f-field-email />
      <f-fields-custom />
      <f-fields-user />
      <f-offer />
      <f-button-pay @success="success" />
      <f-button-cancel-wrapper />
      <f-modal-qr
        :id="id"
        v-model="showQrModal"
        :qr="model.qr"
        :button="model.button"
      />
    </div>
    <f-alert-gdpr-yapily-wrapper v-if="showGdprYapily" />
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import { FButtonClose } from '@/components/button/button-close'
import FFieldsBank from '@/components/fields/bank'
import FFieldEmail from '@/components/fields/email'
import FFieldsCustom from '@/components/fields/custom'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButtonPay from '@/components/button/button-pay'
import FButtonCancelWrapper from '@/components/button/button-cancel-wrapper'
import FModalQr from '@/components/modal/modal-qr'
import FAlertGdprYapilyWrapper from '@/components/alert/alert-gdpr-yapily-wrapper'
import { mapState } from '@/utils/store'

export default {
  components: {
    FIcon,
    FButtonClose,
    FFieldsBank,
    FFieldEmail,
    FFieldsCustom,
    FFieldsUser,
    FOffer,
    FButtonPay,
    FButtonCancelWrapper,
    FModalQr,
    FAlertGdprYapilyWrapper,
  },
  data() {
    return {
      name: '',
      iban: '',
      logo: '',
      form: {},
      showQrModal: false,
      model: {},
    }
  },
  computed: {
    ...mapState(['tabs']),
    method() {
      return this.$route.params.method
    },
    system() {
      return this.$route.params.system
    },
    id() {
      return `${this.country}_${this.logo}`
    },
    showGdprYapily() {
      return this.country === 'gb'
    },
  },
  watch: {
    $route: 'initSystem',
  },
  created() {
    this.initSystem()
  },
  methods: {
    goMethod() {
      this.$router.push({ name: this.method }).catch(() => {})
    },
    initSystem() {
      let {
        name,
        iban,
        logo,
        form,
        country = '',
      } = this.tabs[this.method][this.system]

      this.name = name
      this.iban = iban
      this.logo = logo
      this.form = form || {}
      this.country = country.toLowerCase()
    },
    success(model) {
      this.model = model.attr('send_data') || {}

      if (model.attr('action') === 'qr_page') {
        this.showQrModal = true
      }
    },
  },
}
</script>
