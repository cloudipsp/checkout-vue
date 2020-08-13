<template>
  <div class="f-receipt">
    <span v-t />
    <transition name="fade">
      <div v-if="!model">
        тут может быть иконка квитанции

        <f-offer />
        <f-button-pay @success="success" />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="model">
        <img :src="qrCode" />
        <div
          v-if="model.send_data.mfo"
          v-t="{ path: 'mfo_title', args: [model.send_data.receipt_orig] }"
          class="f-title"
        />
        <div v-else v-t="'ibox_title'" class="f-title" />

        <div class="f-row">
          <div v-t="'receiver'" class="f-col" />
          <div class="f-col">{{ model.send_data.receiver }}</div>
        </div>
        <div v-if="model.send_data.current_bill" class="f-row">
          <div v-t="'current_bill'" class="f-col" />
          <div class="f-col">{{ model.send_data.current_bill }}</div>
        </div>
        <div v-if="model.send_data.usreou" class="f-row">
          <div v-t="'usreou'" class="f-col" />
          <div class="f-col">{{ model.send_data.usreou }}</div>
        </div>
        <div v-if="model.send_data.bank" class="f-row">
          <div v-t="'bank'" class="f-col" />
          <div class="f-col">{{ model.send_data.bank }}</div>
        </div>
        <div v-if="model.send_data.mfo" class="f-row">
          <div v-t="'mfo'" class="f-col" />
          <div class="f-col">{{ model.send_data.mfo }}</div>
        </div>
        <template v-if="model.send_data.mfo">
          <div v-if="model.send_data.receipt_id" class="f-row">
            <div v-t="'purpose'" class="f-col" />
            <div class="f-col">{{ model.send_data.receipt_id }}</div>
          </div>
        </template>
        <template v-else>
          <div v-if="model.send_data.receipt_orig" class="f-row">
            <div v-t="'receipt_id'" class="f-col" />
            <div class="f-col">№ {{ model.send_data.receipt_orig }}</div>
          </div>
        </template>
        <div v-if="model.send_data.end_date" class="f-row">
          <div v-t="'end_date'" class="f-col" />
          <div class="f-col">{{ model.send_data.end_date }}</div>
        </div>
        <div v-if="model.send_data.amount" class="f-row">
          <div v-t="'amount'" class="f-col" />
          <div class="f-col">
            {{ model.send_data.amount }} <span v-t="'UAH'" />
          </div>
        </div>
        <template v-if="!model.send_data.mfo">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="$t('ibox_desc')" />
        </template>
        <a :href="model.url" target="_blank" class="f-btn f-btn-secondary">
          <span v-t="'save_receipt'" />
        </a>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
    }
  },
  computed: {
    qrCode() {
      return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${this.model.url}`
    },
  },
  methods: {
    success(model) {
      this.model = model.data
    },
  },
}
</script>
