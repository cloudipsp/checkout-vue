<template>
  <f-form-group
    name=""
    component="select2"
    size="sm"
    v-bind="attrs"
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
import { sort } from '@/utils/sort'

export default {
  mixins: [attrsMixin, listenersMixin],
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
      return this.fAttrs.options
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
    if (this.fAttrs.options.length > 10) {
      countriesSearch().then(({ countriesSearch }) => {
        this.countriesSearch = countriesSearch
      })
    }
  },
  methods: {
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
  },
}
</script>
