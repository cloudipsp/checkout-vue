import { from as arrayFrom } from '@/utils/array'
import { attemptBlur, attemptFocus } from '@/utils/dom'
import { htmlOrText } from '@/utils/html'
import { isArray } from '@/utils/inspect'
import {
  formControlMixin,
  props as formControlProps,
} from '@/mixins/form-control'
import { formStateMixin, props as formStateProps } from '@/mixins/form-state'
import { idMixin, props as idProps } from '@/mixins/id'
import { normalizeSlotMixin } from '@/mixins/normalize-slot'
import {
  optionsMixin,
  props as optionsProps,
} from '@/components/form/item/helpers/mixin-options'
import { FFormSelectOption } from '@/components/form/item/helpers/form-select-option'
import { FFormSelectOptionGroup } from '@/components/form/item/helpers/form-select-option-group'
import {
  PROP_TYPE_ANY,
  PROP_TYPE_NUMBER,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_BOOLEAN_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

// @vue/component
export const FFormSelect = {
  mixins: [
    idMixin,
    normalizeSlotMixin,
    formControlMixin,
    formStateMixin,
    optionsMixin,
  ],
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    ...idProps,
    ...formControlProps,
    ...formStateProps,
    ...optionsProps,
    value: makeProp(PROP_TYPE_ANY),
    multiple: makeProp(PROP_TYPE_BOOLEAN, false),
    // Browsers default size to 0, which shows 4 rows in most browsers in multiple mode
    // Size of 1 can bork out Firefox
    selectSize: makeProp(PROP_TYPE_NUMBER, 0),
    ariaInvalid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
  },
  data() {
    return {
      localValue: this.value,
    }
  },
  computed: {
    computedSelectSize() {
      // Custom selects with a size of zero causes the arrows to be hidden,
      // so dont render the size attribute in this case
      return this.selectSize === 0 ? null : this.selectSize
    },
    computedAriaInvalid() {
      if (this.ariaInvalid === true || this.ariaInvalid === 'true') {
        return 'true'
      }
      return this.stateClass === 'is-invalid' ? 'true' : null
    },
  },
  watch: {
    value(newVal) {
      this.localValue = newVal
    },
    localValue() {
      this.$emit('input', this.localValue)
    },
  },
  methods: {
    focus() {
      attemptFocus(this.$refs.input)
    },
    blur() {
      attemptBlur(this.$refs.input)
    },
    onChange(evt) {
      const { target } = evt
      const selectedVal = arrayFrom(target.options)
        .filter(o => o.selected)
        .map(o => ('_value' in o ? o._value : o.value))
      this.localValue = target.multiple ? selectedVal : selectedVal[0]
      this.$nextTick(() => {
        this.$emit('change', this.localValue)
      })
    },
  },
  render(h) {
    const {
      name,
      disabled,
      required,
      computedSelectSize: size,
      localValue: value,
    } = this

    const $options = this.formOptions.map((option, index) => {
      const { value, label, options, disabled } = option
      const key = `option_${index}`

      return isArray(options)
        ? h(FFormSelectOptionGroup, { props: { label, options }, key })
        : h(FFormSelectOption, {
            props: { value, disabled },
            domProps: htmlOrText(option.html, option.text),
            key,
          })
    })

    return h(
      'select',
      {
        attrs: {
          ...this.$attrs,
          id: this.safeId(),
          name,
          form: this.form || null,
          multiple: this.multiple || null,
          size,
          disabled,
          required,
          'aria-required': required ? 'true' : null,
          'aria-invalid': this.computedAriaInvalid,
        },
        on: { change: this.onChange },
        directives: [{ name: 'model', value }],
        ref: 'input',
      },
      [this.normalizeSlot('first'), $options, this.normalizeSlot()]
    )
  },
}
