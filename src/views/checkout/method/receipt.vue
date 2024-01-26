<template>
  <div class="f-receipt">
    <transition name="f-fade">
      <div v-if="model">
        <div
          v-if="model.send_data.mfo"
          class="f-title f-title-lg"
          v-text="$t('mfo_title', [model.send_data.receipt_orig])"
        />
        <template v-if="isIbox">
          <div
            class="f-title f-title-lg f-receipt-title"
            v-text="$t('ibox_title')"
          />

          <div v-text="$t('full_requesites')" />
          <div v-text="$t('full_requesites_explain')" />
        </template>

        <div class="f-receipt-props">
          <div v-if="model.send_data.amount" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('amount')" />
            <div class="f-receipt-value">
              {{ model.send_data.amount }} <span v-text="$t('UAH')" />
            </div>
          </div>
          <div class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('receiver')" />
            <div class="f-receipt-value">{{ model.send_data.receiver }}</div>
          </div>
          <div v-if="model.send_data.current_bill" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('current_bill')" />
            <div class="f-receipt-value">
              {{ model.send_data.current_bill }}
            </div>
          </div>
          <div v-if="model.send_data.usreou" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('usreou')" />
            <div class="f-receipt-value">{{ model.send_data.usreou }}</div>
          </div>
          <div v-if="model.send_data.bank" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('bank')" />
            <div class="f-receipt-value">{{ model.send_data.bank }}</div>
          </div>
          <div v-if="model.send_data.mfo" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('mfo')" />
            <div class="f-receipt-value">{{ model.send_data.mfo }}</div>
          </div>
          <template v-if="model.send_data.mfo">
            <div v-if="model.send_data.receipt_id" class="f-receipt-row">
              <div class="f-receipt-key" v-text="$t('purpose')" />
              <div class="f-receipt-value">
                {{ model.send_data.receipt_id }}
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="model.send_data.receipt_orig" class="f-receipt-row">
              <div class="f-receipt-key" v-text="$t('receipt_id')" />
              <div class="f-receipt-value">
                № {{ model.send_data.receipt_orig }}
              </div>
            </div>
          </template>
          <div v-if="model.send_data.end_date" class="f-receipt-row">
            <div class="f-receipt-key" v-text="$t('end_date')" />
            <div class="f-receipt-value">{{ model.send_data.end_date }}</div>
          </div>
        </div>

        <div v-if="isIbox" v-html="$t('ibox_desc')" />

        <div class="f-row f-receipt-buttons">
          <div class="f-col">
            <f-button
              :href="model.url"
              variant="success"
              tag="a"
              target="_blank"
              size="lg"
              block
              text="save_receipt"
            />
          </div>
          <template v-if="isDesktop">
            <div class="f-col">
              <f-button size="lg" block text="save_qr_code" @click="click" />
              <f-modal-base v-model="showQrCode" size="sm">
                <f-loading v-if="loadingQrCode" />
                <div class="f-qr-code-img">
                  <img :src="qrCode" @load="loadQrCode" />
                </div>
                <div
                  v-if="!loadingQrCode"
                  class="f-qr-code-text"
                  v-text="$t('qr_code_text')"
                />
              </f-modal-base>
            </div>
          </template>
        </div>

        <div v-if="isIbox" class="f-receipt-ibox-info">
          <f-svg name="warning" />
          <div v-html="$t('ibox_info')" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import FButton from '@/components/button/button'
import { FLoading } from '@/import'
import FSvg from '@/components/svg'
import { isDesktop } from '@/utils/mobile'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FButton,
    FLoading,
    FSvg,
  },
  inject: ['submit'],
  data() {
    return {
      model: null,
      showQrCode: false,
      loadingQrCode: false,
    }
  },
  computed: {
    qrCode() {
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.model.url}`
    },
    isIbox() {
      return !this.model.send_data.mfo
    },
    isDesktop() {
      return isDesktop
    },
  },
  mounted() {
    this.submit()
      .then(model => {
        this.model = model.data
      })
      .catch(errorHandler)
  },
  methods: {
    click() {
      this.showQrCode = true
      this.loadingQrCode = true
    },
    loadQrCode() {
      this.loadingQrCode = false
    },
  },
}
</script>
