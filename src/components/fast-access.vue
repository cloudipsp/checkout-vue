<template>
  <div v-if="show" class="f-fast-access">
    <f-icon
      v-for="item in list"
      :key="item.id"
      class="f-fast-access-icon"
      :name="item.logo"
      type="banklinks_eu"
      @click.native="click(item)"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import { removeDuplicate } from '@/utils/helpers'

export default {
  data() {
    return {
      fast: [],
      count: 10,
    }
  },
  computed: {
    ...mapState('tabs', ['banklinks_eu', 'local_methods']),
    // [{country: 'PL', name: '', logo: 'mbank'}]
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
        .filter(removeDuplicate)
        .slice(0, this.count)
    },
  },
  methods: {
    getValues(list) {
      return list.reduce(
        (accum, method) =>
          accum.concat(Object.values(this[method]?.payment_systems || {})),
        []
      )
    },
    click({ method, id }) {
      this.$router
        .push({
          name: 'system',
          params: {
            method,
            system: id,
          },
        })
        .catch(() => {})
    },
    listFilter({ quick_method, logo }) {
      return quick_method && logo !== 'no_logo'
    },
    listSort(a, b) {
      return a.user_priority < b.user_priority ? 1 : -1
    },
  },
}
</script>
