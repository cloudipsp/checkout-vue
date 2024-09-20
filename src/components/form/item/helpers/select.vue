<template>
  <f-modal-tooltip ref="mt" v-bind="attrs" @shown="shown" @hide="hide">
    <template #text>
      <template v-if="active.value">
        <slot name="text" :item="active">
          {{ active.text }}
        </slot>
      </template>
      <template v-else>{{ placeholder }}</template>
      <span class="f-select-arrow-wrapper">
        <f-svg :class="classArrow" name="angle-down" />
      </span>
    </template>
    <template #default>
      <f-form-base v-if="showSearch" class="f-select-search">
        <!--        <f-form-group-->
        <!--          ref="search"-->
        <!--          :value="text"-->
        <!--          class="f-mb-0"-->
        <!--          name="default_country"-->
        <!--          size="sm"-->
        <!--          prepend="search"-->
        <!--          :autofocus="autofocus"-->
        <!--          autocomplete="off"-->
        <!--          variant="secondary"-->
        <!--          @input="input"-->
        <!--          @keydown="navigate"-->
        <!--        />-->
      </f-form-base>
      <f-button-unstyled
        v-for="(item, key) in list"
        :key="key"
        ref="items"
        :class="classItem(item, key)"
        :data-e2e-select-item="item.value"
        @click="click(item)"
        @keydown="navigate"
        @focus="focus(key)"
      >
        <slot name="item" :item="item" :is-active="isActive(item)">
          {{ item.text }}
          <span class="f-ml-auto f-pl-8" :style="style(item)">•</span>
        </slot>
      </f-button-unstyled>
    </template>
  </f-modal-tooltip>
</template>

<script>
import FModalTooltip from '@/components/modal-tooltip'
import FFormBase from '@/components/form/form/form-base'
// import FFormGroup from '@/components/form/group.vue'
import FButtonUnstyled from '@/components/button/button-unstyled'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { attemptFocus, requestAF } from '@/utils/dom'
import { CODE_DOWN, CODE_ENTER, CODE_UP } from '@/constants/key-codes'
import { attrsMixin } from '@/mixins/attrs'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FModalTooltip,
    FFormBase,
    // FFormGroup,
    FButtonUnstyled,
    FSvg,
  },
  mixins: [attrsMixin],
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: makeProp(PROP_TYPE_NUMBER_STRING),
    options: makeProp(PROP_TYPE_ARRAY, []),
    filter: makeProp(
      PROP_TYPE_FUNCTION,
      search =>
        ({ text }) =>
          text.toLowerCase().indexOf(search) === 0
    ),
    variantItem: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary', 'card'], value)
    ),
    search: makeProp(PROP_TYPE_BOOLEAN, false),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    placeholder: makeProp(PROP_TYPE_STRING, 'select'),
  },
  data() {
    return {
      open: false,
      text: '',
      autofocus: false,
      index: 0,
    }
  },
  computed: {
    attrs() {
      return {
        ...this.fAttrs,
        disabled: !this.options.length || this.disabled,
      }
    },
    showSearch() {
      return this.search && this.options.length > 10
    },
    list() {
      return this.options.filter(this.filter(this.text.toLowerCase()))
    },
    active() {
      return this.options.filter(({ value }) => value === this.value)[0] || {}
    },
    classItem() {
      return (item, index) => [
        `f-select-${this.variantItem}-item`,
        {
          [`f-select-${this.variantItem}-item_active`]: this.isActive(item),
          [`f-select-${this.variantItem}-item_focus`]: index === this.index,
        },
      ]
    },
    classArrow() {
      return ['f-select-arrow', { 'f-select-arrow-open': this.open }]
    },
    style() {
      return item => ({
        visibility: this.isActive(item) ? 'visible' : 'hidden',
      })
    },
  },
  methods: {
    click({ value, disabled }) {
      if (disabled) return

      this.$emit('change', value)
      this.$refs.mt.$emit('hide')
    },
    shown() {
      this.open = true
      this.autofocus = true
      this.reset()
      this.scroll()
    },
    hide() {
      this.open = false
      this.text = ''
    },
    isActive(item) {
      return item.value === this.value
    },
    navigate(ev) {
      const { keyCode } = ev
      switch (keyCode) {
        case CODE_DOWN:
          this.setIndex(this.index + 1)
          this.scroll()
          break
        case CODE_UP:
          this.setIndex(this.index - 1)
          this.scroll()
          break
        case CODE_ENTER:
          this.click(this.list[this.index])
          break
        default:
          return
      }
      ev.preventDefault()
    },
    reset() {
      let index = this.list.includes(this.active)
        ? this.list.indexOf(this.active)
        : 0

      this.setIndex(index)
    },
    scroll() {
      const el = this.$refs.items[this.index].$el
      if (!el) return
      el.scrollIntoView({
        block: 'center',
        // behavior: 'smooth',
      })

      if (this.showSearch) return
      attemptFocus(el)
    },
    setIndex(index) {
      this.index = Math.max(0, Math.min(this.list.length - 1, index))
    },
    input(value) {
      this.$emit('search', value)
      this.text = value
      requestAF(() => {
        this.reset()
        this.scroll()
      })
    },
    focus(index) {
      this.index = index
    },
  },
}
</script>
