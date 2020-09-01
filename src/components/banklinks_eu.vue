<template>
  <div v-if="show" :class="className">
    <transition name="fade">
      <div v-if="open">
        <div class="f-bank-select">
          <f-icon
            :name="select.bank_logo"
            type="banklinks_eu"
            class="f-bank-select-icon"
          />
          <div class="f-bank-select-name">{{ select.name }}</div>

          <div>{{ select.iban }}</div>
          <f-button-close class="f-bank-select-close" @click="open = false" />
        </div>
        <div class="f-container-sm">
          <f-customer-fields />
          <f-fields />
          <f-fields-bank v-if="showFieldsBank" :fields="select.form.fields" />
          <f-offer />
          <f-button-pay />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="!open">
        <div class="f-row">
          <div v-if="showCountry" class="f-col f-bank-country">
            <input-select
              name="default_country"
              :list="country"
              :model="options"
              validate="required"
              input-class="f-control-sm"
              @input="clear"
            />
          </div>
          <div v-if="showSearch" class="f-col f-bank-search">
            <input-text
              name="search"
              label="system_search"
              type="text"
              :model="form"
              input-class="f-control-sm"
              prepend="search"
            />
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
          <div
            v-for="bank in listMin"
            :key="bank.id"
            :class="classBankItem"
            @click="selectBank(bank)"
          >
            <f-icon
              :name="bank.bank_logo"
              type="banklinks_eu"
              :class="classBankIcon"
              :size="sizeBankIcon"
            />
            <div :class="classBankItemWrapper">
              <div v-t="bank.name" class="f-bank-name" />
              <div v-if="isGermany" class="f-bank-iban">
                {{ bank.iban }}
              </div>
            </div>
          </div>
        </div>
        <div class="f-bank-footer">
          <button v-if="showMore" :class="[css.btn, css.bd]" @click="loadMore">
            <span><f-svg name="redo" size="lg" :spin="spin" fw/></span>
            <span v-t="'load_more'" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { sort } from '@/utils/helpers'
import { mapState, mapStateGetSet } from '@/utils/store'
import { isPlainObject } from '@/utils/typeof'
import FFieldsBank from '@/components/fields-bank'

export default {
  components: {
    FFieldsBank,
  },
  data() {
    return {
      form: {
        search: '',
      },
      count: 15,
      more: 15,
      spin: false,
      open: false,
      select: null,
      view: 'bar',
    }
  },
  computed: {
    ...mapState(['ready', 'options', 'css']),
    ...mapState('tabs', ['banklinks_eu']),
    ...mapState('options', ['countries']),
    ...mapState('router', ['system']),
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
    show() {
      return this.listFull.length
    },
    showCountry() {
      return this.country.length > 1
    },
    showSearch() {
      return this.listSelect.length > 10
    },
    showView() {
      return this.isGermany
    },
    showTitle() {
      return this.list.length > 1
    },
    showMore() {
      return this.list.length > this.more
    },
    showFieldsBank() {
      return isPlainObject(this.select.form)
    },
    className() {
      return ['f-bank']
    },
    classBankItem() {
      return [
        'f-col',
        'f-bank-item',
        `f-bank-item-${this.options.default_country}`,
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
      return this.options.default_country === 'DE'
    },
    sizeBankIcon() {
      return this.view === 'list' ? 'sm' : 'md'
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
    system: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return

        let bank = this.listFull.filter(item => item.id === newValue)[0]
        if (!bank) return

        this.selectBank(bank)
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
    selectBank(bank) {
      this.store.locationSystem(bank.id)
      this.open = true
      this.select = bank
    },
    clear() {
      this.form.search = ''
      this.setView('bar')
    },
    loadMore() {
      this.spin = true
      setTimeout(() => {
        this.more += this.count
        this.spin = false
      }, 300)
    },
    setView(view) {
      this.view = view
    },
  },
}
</script>
