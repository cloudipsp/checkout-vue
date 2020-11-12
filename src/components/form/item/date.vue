<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <form-input
      v-if="isMobile"
      ref="input"
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      :min="minFormat"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
    <date-picker
      v-else
      v-model="innerValue"
      v-bind="attrsDatepicker"
      v-on="$listeners"
      @keyup.enter="onEnter"
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
import { dateFormat } from '@/utils/helpers'

export default {
  components: {
    DatePicker,
    FormInput,
  },
  mixins: [item, mobile],
  props: {
    min: {
      type: String,
      default: '',
      validator: value => ['', 'now'].includes(value),
    },
  },
  data() {
    return {
      map: {
        now: this.getDate(new Date()),
      },
    }
  },
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
        disabled: this.attrs.disabled,
        'disabled-date': this.disabledDate,
      }
    },
    minDate() {
      if (!this.min) return

      return this.map[this.min]
    },
    minFormat() {
      if (!this.min) return

      return dateFormat(this.minDate)
    },
  },
  methods: {
    disabledDate(date) {
      return date < this.minDate
    },
    getDate(date) {
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.setMilliseconds(0)
      return date
    },
  },
}
</script>
