<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <f-form-input
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
      ref="input"
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
import { DatePicker } from '@/import'
import { FFormInput } from '@/components/form/item/helpers/form-input'
import FSvg from '@/components/svg'
import { itemMixin } from '@/mixins/item'
import { isMobile } from '@/utils/mobile'
import { createDate, format } from '@/utils/date'
import { mapState } from '@/utils/store'
import { formatRegion, formatServer } from '@/config/date'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    DatePicker,
    FFormInput,
    FSvg,
  },
  mixins: [itemMixin],
  props: {
    min: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['now'], value)
    ),
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
      return formatRegion[this.region] || formatRegion.default
    },
    attrsDatepicker() {
      return {
        ...this.attrs,
        lang: this.$t(`datepicker`),
        clearable: false,
        format: this.format,
        'input-class': this.classInput,
        'input-attr': {
          id: this.attrs.id,
        },
        'value-type': formatServer,
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

      return format(this.minDate, formatServer)
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
