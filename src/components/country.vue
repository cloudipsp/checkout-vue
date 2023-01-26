<template>
  <f-form-group
    name=""
    component="select2"
    size="sm"
    v-bind="attrs"
    data-e2e-country
    no-label-floating
    v-on="fListeners"
    @search="onSearch"
  >
    <template #text="{ item }">
      <span class="f-pr-8">{{ flag(item.value) }}</span>
      {{ item.text }}
    </template>
    <template #item="{ item }">
      <span class="f-pr-8">{{ flag(item.value) }}</span>
      {{ item.text }}
    </template>
  </f-form-group>
</template>

<script>
import { codeToFlag } from '@/utils/helpers'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { countriesSearch } from '@/import'
import { sort, parseSelect } from '@/utils/sort'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_ARRAY } from '@/constants/props'

export default {
  mixins: [attrsMixin, listenersMixin],
  inheritAttrs: false,
  props: {
    list: makeProp(PROP_TYPE_ARRAY, []),
  },
  data() {
    return {
      search: '',
      countriesSearch: null,
    }
  },
  computed: {
    flag() {
      return code => codeToFlag(code)
    },
    attrs() {
      return {
        filter: this.filter,
        ...this.fAttrs,
        options: this.options,
        disabled: this.disabled,
        scrollable: this.scrollable,
      }
    },
    options() {
      return this.list
        .map(parseSelect)
        .map(item => ({
          ...item,
          order:
            this.search && this.countriesSearch
              ? this.countriesSearch[item.value].reduce(
                  (accum, value) =>
                    value.toLowerCase().indexOf(this.search) === 0
                      ? accum + 1
                      : accum,
                  0
                )
              : 0,
        }))
        .sort(this.search ? sort('order', true) : sort('text'))
    },
    disabled() {
      return this.options.length === 1
    },
    scrollable() {
      return this.options.length > 10
    },
  },
  created() {
    this.load()
    this.setCountry()
  },
  methods: {
    load() {
      if (this.list.length <= 10) return

      countriesSearch().then(({ countriesSearch }) => {
        this.countriesSearch = countriesSearch
      })
    },
    filter(search) {
      return ({ value, text }) =>
        this.countriesSearch
          ? this.countriesSearch[value].some(
              text => text.toLowerCase().indexOf(search) === 0
            )
          : text.toLowerCase().indexOf(search) === 0
    },
    onSearch(value) {
      this.search = value
    },
    setCountry() {
      if (this.list.includes(this.fAttrs.value)) return

      if (this.options.length > 0) {
        this.fAttrs.value = this.options[0].value
      }
    },
  },
}
</script>
