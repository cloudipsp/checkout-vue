<template>
  <div>
    <div class="f-row">
      <div v-if="showCountry" class="f-col f-bank-country">
        <f-form-group
          v-model="default_country"
          :options="country"
          name="default_country"
          size="sm"
          component="select"
          @input="clear"
        />
      </div>
      <div v-if="showSearch" class="f-col f-bank-search">
        <f-form-base>
          <f-form-group
            v-model="search"
            name="system_search"
            size="sm"
            prepend="search"
          />
        </f-form-base>
      </div>
      <div v-if="showView" class="f-col f-bank-view">
        <div class="f-form-group f-bank-view-wrapper">
          <div :class="classBankViewBar" @click="setView('bar')">
            <f-svg name="bar" size="lg" />
          </div>
          <div :class="classBankViewList" @click="setView('list')">
            <f-svg name="list" size="lg" />
          </div>
        </div>
      </div>
    </div>
    <div class="f-row f-bank-list">
      <a
        v-for="bank in listMin"
        :key="bank.id"
        href="#"
        :class="classBankItem"
        @click="goSystem(bank)"
      >
        <f-icon
          :name="bank[logo]"
          :type="type"
          :class="classBankIcon"
          :size="sizeBankIcon"
        />
        <div :class="classBankItemWrapper">
          <div class="f-bank-name" v-text="$t(bank.name)" />
          <div v-if="isGermany" class="f-bank-iban">
            {{ bank.iban }}
          </div>
        </div>
      </a>
    </div>
    <div class="f-bank-footer">
      <f-button v-if="showMore" variant="outline" @click="loadMore">
        <span><f-svg name="redo" size="lg" :spin="spin" fw /></span>
        <span v-text="$t('load_more')" />
      </f-button>
    </div>
  </div>
</template>

<script>
import { sort, parseSelect } from '@/utils/sort'
import { mapState, mapStateGetSet } from '@/utils/store'
import { removeDuplicate } from '@/utils/helpers'

import timeout from '@/mixins/timeout'

export default {
  mixins: [timeout],
  props: {
    type: {
      type: String,
      required: true,
    },
    // {147209: {country: 'PL', name: '', bank_logo: 'mbank'}}
    config: {
      type: Object,
      required: true,
    },
    enableCountry: {
      type: Boolean,
      default: true,
    },
    logo: {
      type: String,
      required: true,
      validator: value => ['bank_logo', 'id'].includes(value),
    },
  },
  data() {
    return {
      search: '',
      count: 15,
      more: 15,
      spin: false,
      view: 'bar',
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('options', ['countries']),
    ...mapStateGetSet('options', ['default_country']),
    // [{id: 147209, country: 'PL', name: '', bank_logo: 'mbank'}]
    values() {
      return Object.values(this.config)
    },
    // [{id: 'PL', name:''}]
    country() {
      return this.listCountry.map(parseSelect).sort(sort('text'))
    },
    listCountry() {
      return this.countries && this.countries.length
        ? this.countries
        : this.values.map(item => item.country).filter(removeDuplicate)
    },
    // [{id: 147209, country: 'PL', name: '', bank_logo: 'mbank'}]
    listSelect() {
      return this.values.filter(this.listSelectFilter).sort(this.listSelectSort)
    },
    list() {
      let search = this.search.toLowerCase()
      if (search) {
        return this.listSelect.filter(
          ({ name, iban }) =>
            name.toLowerCase().includes(search) ||
            iban.toLowerCase().includes(search)
        )
      } else {
        return this.listSelect
      }
    },
    listMin() {
      return this.list.slice(0, this.more)
    },
    showCountry() {
      return this.listCountry.length > 1
    },
    showSearch() {
      return this.listSelect.length > 10
    },
    showView() {
      return this.isGermany
    },
    showMore() {
      return this.list.length > this.more
    },
    classBankItem() {
      return [
        'f-col',
        'f-bank-item',
        `f-bank-item-${this.default_country}`,
        `f-bank-item-${this.view}`,
      ]
    },
    classBankViewBar() {
      return [{ 'f-active': this.view === 'bar' }, 'f-bank-view-icon']
    },
    classBankViewList() {
      return [{ 'f-active': this.view === 'list' }, 'f-bank-view-icon']
    },
    classBankIcon() {
      return ['f-bank-icon', `f-bank-icon-${this.view}`]
    },
    classBankItemWrapper() {
      return ['f-bank-item-wrapper', `f-bank-item-wrapper-${this.view}`]
    },
    isGermany() {
      return this.default_country === 'DE'
    },
    sizeBankIcon() {
      return this.view === 'list' ? 'sm' : 'md'
    },
  },
  watch: {
    country: {
      handler(item) {
        if (item.length === 1) {
          this.default_country = item[0].value
        }
      },
      immediate: true,
    },
  },
  created() {
    if (!this.ready) {
      this.store.formLoading(true)
    }
    if (!this.listCountry.includes(this.default_country)) {
      this.default_country = ''
    }
  },
  methods: {
    goSystem({ id }) {
      this.$emit('system', id)
    },
    clear() {
      this.search = ''
      this.setView('bar')
    },
    loadMore() {
      this.spin = true
      this.timeout(() => {
        this.more += this.count
        this.spin = false
      }, 300)
    },
    setView(view) {
      this.view = view
    },
    listSelectFilter(item) {
      return this.enableCountry ? item.country === this.default_country : true
    },
    listSelectSort(a, b) {
      return a.user_priority < b.user_priority ? 1 : -1
    },
  },
}
</script>
