<template>
  <div>
    <div>
      <input-select
        v-if="showCountry"
        name="default_country"
        :list="country"
        :model="options"
        validate="required"
        @input="clear"
      />
      <input-text
        v-if="showSearch"
        name="search"
        label="system_search"
        type="text"
        :model="form"
        placeholder="system_search_p"
      />
    </div>
    <div class="f-text-center" :class="'f-ps-' + list.length">
      <div
        v-for="bank in listMin"
        :key="bank.id"
        class="f-ps"
        @click="locationSystem(bank)"
      >
        <f-icon :name="bank.bank_logo" type="banklinks_eu" />
        <div v-t="bank.name" />
        <div class="f-iban">
          {{ bank.iban }}
        </div>
      </div>
      <div v-if="showMore" class="f-ps" @click="loadMore">
        <div class="f-wrapper-icon">
          <f-svg name="redo" size="3x" :spin="spin" />
        </div>
        <div v-t="'load_more'" />
      </div>
    </div>
    <!--<f-modal-form-bank-->
    <!--v-if="item"-->
    <!--v-model="open"-->
    <!--:config="item"-->
    <!--@submit="submit"-->
    <!--/>-->
  </div>
</template>

<script>
import { sort } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { isObject } from '@/utils/typeof'

export default {
  inject: ['formRequest'],
  data() {
    return {
      form: {
        search: '',
      },
      count: 24,
      more: 24,
      spin: false,
      open: false,
      item: null,
    }
  },
  computed: {
    ...mapState(['options']),
    ...mapState(['ready']),
    ...mapState('tabs', ['banklinks_eu']),
    ...mapState('options', ['countries']),
    ...mapStateGetSet('options', ['default_country']),
    // {147209: {country: 'PL', name: 'mBank', bank_logo: 'mbank'}}
    config() {
      return (this.banklinks_eu && this.banklinks_eu.payment_systems) || {}
    },
    // [147209]
    keys() {
      return Object.keys(this.config)
    },
    // [{country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    values() {
      return Object.values(this.config)
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listFull() {
      return this.values.map((item, i) => ({
        ...item,
        id: this.keys[i],
        bank_logo: item.bank_logo || 'no_logo',
        iban: this.keys[i].split('|')[1] || '',
      }))
    },
    // [{id: 'PL', name: 'Poland'}]
    country() {
      let result =
        this.countries && this.countries.length
          ? this.countries
          : this.values
              .map(item => item.country)
              .filter((item, key, self) => self.indexOf(item) === key)
      result = result.map(item => ({
        id: item,
        name: this.$t(item),
      }))
      return sort(result, 'name')
    },
    // [{id: 147209, country: 'PL', name: 'mBank', bank_logo: 'mbank'}]
    listSelect() {
      return this.listFull.filter(item => item.country === this.default_country)
    },
    list() {
      let search = this.form.search.toLowerCase()
      if (search) {
        return this.listSelect.filter(function(item) {
          let name = item.name.toLowerCase()
          let iban = item.iban.toLowerCase()

          return name.indexOf(search) > -1 || iban.indexOf(search) > -1
        }, this)
      } else {
        return this.listSelect
      }
    },
    listMin() {
      return this.list.slice(0, this.more)
    },
    showCountry() {
      return this.country.length > 1
    },
    showSearch() {
      return this.listSelect.length > 10
    },
    showTitle() {
      return this.list.length > 1
    },
    showMore() {
      return this.list.length > this.more
    },
  },
  watch: {
    country: {
      handler(item) {
        if (item.length === 1) {
          this.default_country = item[0].id
        }
      },
      immediate: true,
    },
  },
  created() {
    if (!this.ready) {
      this.store.formLoading(true)
    }
  },
  methods: {
    locationSystem(item) {
      this.store.locationSystem(item.id)

      if (isObject(item.form)) {
        this.open = true
        this.item = item
      } else {
        this.formRequest()
      }
    },
    submit(form) {
      this.formRequest(form)
    },
    clear() {
      this.form.search = ''
    },
    loadMore() {
      this.spin = true
      setTimeout(() => {
        this.more += this.count
        this.spin = false
      }, 300)
    },
  },
}
</script>
