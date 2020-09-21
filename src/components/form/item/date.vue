<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <form-input
      v-if="isMobile"
      ref="input"
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      v-on="$listeners"
      @keyup="onEnter"
    />
    <date-picker
      v-else
      v-model="innerValue"
      v-bind="attrsDatepicker"
      v-on="$listeners"
      @keyup="onEnter"
    >
      <template #icon-calendar>
        <f-svg name="angle-down" />
      </template>
    </date-picker>
  </ValidationProvider>
</template>

<script>
import item from '@/mixins/item'
import mobile from '@/mixins/mobile'
import DatePicker from './helpers/date-picker'
import FormInput from './helpers/form-input'

export default {
  components: {
    DatePicker,
    FormInput,
  },
  mixins: [item, mobile],
  computed: {
    attrsDatepicker() {
      return {
        ...this.attrs,
        lang: this.$t('datepicker'),
        clearable: false,
        format: 'DD/MM/YYYY',
        'input-class': this.classInput,
        'input-attr': {
          id: this._id,
        },
        'value-type': 'YYYY-MM-DD',
        'prefix-class': 'f-datepicker',
        'append-to-body': false,
      }
    },
  },
}
</script>
