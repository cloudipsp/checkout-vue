<template>
  <div class="f-receipt">
    <span v-t />
    <transition name="fade">
      <div v-if="model">
        <div
          v-if="model.send_data.mfo"
          v-t="{ path: 'mfo_title', args: [model.send_data.receipt_orig] }"
          class="f-title f-title-lg"
        />
        <template v-if="isIbox">
          <div v-t="'ibox_title'" class="f-title f-title-lg f-receipt-title" />

          <div v-t="'full_requesites'" />
          <div v-t="'full_requesites_explain'" />
        </template>

        <div class="f-receipt-props">
          <div v-if="model.send_data.amount" class="f-receipt-row">
            <div v-t="'amount'" class="f-receipt-key" />
            <div class="f-receipt-value">
              {{ model.send_data.amount }} <span v-t="'UAH'" />
            </div>
          </div>
          <div class="f-receipt-row">
            <div v-t="'receiver'" class="f-receipt-key" />
            <div class="f-receipt-value">{{ model.send_data.receiver }}</div>
          </div>
          <div v-if="model.send_data.current_bill" class="f-receipt-row">
            <div v-t="'current_bill'" class="f-receipt-key" />
            <div class="f-receipt-value">
              {{ model.send_data.current_bill }}
            </div>
          </div>
          <div v-if="model.send_data.usreou" class="f-receipt-row">
            <div v-t="'usreou'" class="f-receipt-key" />
            <div class="f-receipt-value">{{ model.send_data.usreou }}</div>
          </div>
          <div v-if="model.send_data.bank" class="f-receipt-row">
            <div v-t="'bank'" class="f-receipt-key" />
            <div class="f-receipt-value">{{ model.send_data.bank }}</div>
          </div>
          <div v-if="model.send_data.mfo" class="f-receipt-row">
            <div v-t="'mfo'" class="f-receipt-key" />
            <div class="f-receipt-value">{{ model.send_data.mfo }}</div>
          </div>
          <template v-if="model.send_data.mfo">
            <div v-if="model.send_data.receipt_id" class="f-receipt-row">
              <div v-t="'purpose'" class="f-receipt-key" />
              <div class="f-receipt-value">
                {{ model.send_data.receipt_id }}
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="model.send_data.receipt_orig" class="f-receipt-row">
              <div v-t="'receipt_id'" class="f-receipt-key" />
              <div class="f-receipt-value">
                № {{ model.send_data.receipt_orig }}
              </div>
            </div>
          </template>
          <div v-if="model.send_data.end_date" class="f-receipt-row">
            <div v-t="'end_date'" class="f-receipt-key" />
            <div class="f-receipt-value">{{ model.send_data.end_date }}</div>
          </div>
        </div>

        <!-- eslint-disable-next-line vue/no-v-html -->
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
                  v-t="'qr_code_text'"
                  class="f-qr-code-text"
                />
              </f-modal-base>
            </div>
          </template>
        </div>

        <div v-if="isIbox" class="f-receipt-ibox-info">
          <f-svg name="warning" />
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="$t('ibox_info')" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import mobile from '@/mixins/mobile'
import { errorHandler } from '@/utils/helpers'

export default {
  mixins: [mobile],
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
  },
  created() {
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
