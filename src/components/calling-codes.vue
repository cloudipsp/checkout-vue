<template>
  <f-form-group
    v-bind="attrs"
    data-e2e-calling-codes
    v-on="fListeners"
    @search="onSearch"
    @change="emitCallingCode"
  >
    <template #text="{ item }">
      <template v-if="item.code">
        <span class="f-pr-8">{{ flag(item.cca2) }}</span>
        +{{ item.code }}
      </template>
    </template>
    <template #item="{ item, isActive }">
      <span class="f-pr-8">{{ flag(item.cca2) }}</span>
      {{ item.text }} (+{{ item.code }})
      <f-svg v-if="isActive" class="f-ml-auto" name="check" size="lg" />
    </template>
  </f-form-group>
</template>

<script>
import { codeToFlag } from '@/utils/helpers'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { countriesCallingCodes, countriesSearch } from '@/import'
import { sort } from '@/utils/sort'
import FSvg from '@/components/svg'

export default {
  components: {
    FSvg,
  },
  mixins: [attrsMixin, listenersMixin],
  inheritAttrs: false,
  data() {
    return {
      countriesCallingCodes: {},
      list: [],
      search: '',
    }
  },
  computed: {
    flag() {
      return code => codeToFlag(code)
    },
    attrs() {
      return {
        ...this.fAttrs,
        options: this.options,
        name: 'calling-codes',
        label: '',
        variantItem: 'secondary',
        component: 'select2',
        noLabelFloating: true,
        search: true,
        filter: this.filter,
        scrollable: true,
        dropdownWrapperClass: this.$style.dropdown,
      }
    },
    options() {
      return this.list
        .map(item => ({
          ...item,
          text: this.$t(item.cca2),
          order:
            this.search && item.search
              ? item.search.reduce(
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
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      Promise.all([countriesCallingCodes(), countriesSearch()]).then(
        ([{ countriesCallingCodes }, { countriesSearch }]) => {
          this.countriesCallingCodes = countriesCallingCodes
          this.emitCallingCode(this.$attrs.value)
          this.list = Object.entries(countriesCallingCodes).map(
            ([cca2, code]) => {
              code = String(code)
              return {
                value: cca2,
                cca2,
                code,
                search: [code, ...countriesSearch[cca2]],
              }
            }
          )
        }
      )
    },
    filter(value) {
      return ({ text, search }) =>
        search
          ? search.some(text => text.toLowerCase().indexOf(value) === 0)
          : text.toLowerCase().indexOf(value) === 0
    },
    onSearch(value) {
      this.search = value
    },
    emitCallingCode(value) {
      const code = String(this.countriesCallingCodes[value])
      this.$emit('calling-code', code)
    },
  },
}
</script>

<style lang="scss" module>
.dropdown {
  padding: px-to-rem(20px);
  max-height: px-to-rem(400px);
}
</style>
