<template>
  <f-modal-tooltip ref="mt" v-bind="fAttrs" @shown="shown" @hide="hide">
    <template #text>
      <slot name="text" :item="active">
        {{ active.text }}
      </slot>
      <f-svg :class="classArrow" name="angle-down" />
    </template>
    <template #default>
      <f-form-base v-if="showSearch" class="f-select-search">
        <f-form-group
          ref="search"
          :value="search"
          class="f-mb-0"
          name="default_country"
          size="sm"
          prepend="search"
          :autofocus="autofocus"
          autocomplete="off"
          variant="secondary"
          @input="input"
          @keydown="navigate"
        />
      </f-form-base>
      <button
        v-for="(item, key) in list"
        :key="key"
        ref="items"
        type="button"
        :class="classItem(item, key)"
        @click="click(item.value)"
        @keydown="navigate"
        @focus="focus(key)"
      >
        <slot name="item" :item="item">
          {{ item.text }}
        </slot>
        <f-svg v-if="isActive(item)" class="f-ml-auto" name="check" size="lg" />
      </button>
    </template>
  </f-modal-tooltip>
</template>

<script>
import FModalTooltip from '@/components/modal-tooltip'
import FFormBase from '@/components/form/form/form-base'
import FSvg from '@/components/svg'
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_NUMBER_STRING,
} from '@/constants/props'
import { attemptFocus, requestAF } from '@/utils/dom'
import { CODE_DOWN, CODE_ENTER, CODE_UP } from '@/constants/key-codes'
import { attrsMixin } from '@/mixins/attrs'

export default {
  components: {
    FModalTooltip,
    FFormBase,
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
  },
  data() {
    return {
      open: false,
      search: '',
      autofocus: false,
      index: 0,
    }
  },
  computed: {
    showSearch() {
      return this.options.length > 10
    },
    list() {
      return this.options.filter(this.filter(this.search.toLowerCase()))
    },
    active() {
      return this.options.filter(({ value }) => value === this.value)[0] || {}
    },
    classItem() {
      return (item, index) => [
        'f-select-item f-btn-unstyled',
        {
          'f-select-item-active': this.isActive(item),
          'f-select-item-focus': index === this.index,
        },
      ]
    },
    classArrow() {
      return ['f-select-arrow', { 'f-select-arrow-open': this.open }]
    },
  },
  methods: {
    click(value) {
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
      this.search = ''
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
          this.click(this.list[this.index].value)
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
      const el = this.$refs.items[this.index]
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
      this.search = value
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
