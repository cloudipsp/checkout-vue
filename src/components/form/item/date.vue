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
import { isMobile } from '@/utils/mobile'
import { DatePicker } from '@/import'
import FormInput from './helpers/form-input'
import { createDate, formatYYYYMMDD } from '@/utils/date'
import { mapState } from '@/utils/store'
import format from '@/config/date'

export default {
  components: {
    DatePicker,
    FormInput,
  },
  mixins: [item],
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
        now: this.getDate(createDate()),
      },
    }
  },
  computed: {
    ...mapState(['region']),
    format() {
      return format[this.region] || format.default
    },
    attrsDatepicker() {
      return {
        ...this.attrs,
        lang: this.$t('datepicker'),
        clearable: false,
        format: this.format,
        'input-class': this.classInput.join(' '),
        'input-attr': {
          id: this.attrs.id,
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

      return formatYYYYMMDD(this.minDate)
    },
    isMobile() {
      return isMobile
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
