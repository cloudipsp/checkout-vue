<template>
  <div v-if="show" class="f-fast-access">
    <f-icon
      v-for="item in list"
      :key="item.id"
      class="f-fast-access-icon"
      :name="item.bank_logo"
      type="banklinks_eu"
      @click.native="click(item)"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { filterDuplicate } from '@/utils/helpers'

export default {
  data() {
    return {
      fast: [],
      count: 10,
    }
  },
  computed: {
    ...mapState('tabs', ['banklinks_eu', 'local_methods']),
    // [{country: 'PL', name: '', bank_logo: 'mbank'}]
    values() {
      return this.getValues(['banklinks_eu', 'local_methods'])
    },
    show() {
      return this.list.length
    },
    list() {
      return this.values
        .filter(this.listFilter)
        .sort(this.listSort)
        .filter(filterDuplicate)
        .slice(0, this.count)
    },
  },
  methods: {
    getValues(list) {
      return list.reduce(
        (accum, method) =>
          accum.concat(
            Object.values((this[method] && this[method].payment_systems) || {})
          ),
        []
      )
    },
    click(bank) {
      this.store.location('payment-method', bank.method, bank.id)
    },
    listFilter(item) {
      return item.quick_method && item.bank_logo !== 'no_logo'
    },
    listSort(a, b) {
      return a.user_priority < b.user_priority ? 1 : -1
    },
  },
}
</script>
