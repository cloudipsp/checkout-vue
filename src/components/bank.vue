<template>
  <div v-if="show" :class="className">
    <transition name="fade-enter">
      <div v-if="open" key="item">
        <div class="f-bank-select">
          <f-icon
            :name="select.bank_logo"
            :type="type"
            class="f-bank-select-icon"
          />
          <div class="f-bank-select-name">{{ select.name }}</div>

          <div>{{ select.iban }}</div>
          <f-button-close class="f-bank-select-close" @click="open = false" />
        </div>
        <div v-t="'bank_desc'" class="f-bank-desc" />
        <div class="f-container-sm">
          <f-fields-bank v-if="showFieldsBank" :fields="select.form.fields" />
          <f-fields />
          <f-offer />
          <f-button-pay />
        </div>
      </div>
      <div v-else key="list">
        <div class="f-row">
          <div v-if="showCountry" class="f-col f-bank-country">
            <f-form-group
              v-model="default_country"
              :options="country"
              label="default_country"
              size="sm"
              component="select"
              @input="clear"
            />
          </div>
          <div v-if="showSearch" class="f-col f-bank-search">
            <f-form-group
              v-model="search"
              label="system_search"
              size="sm"
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
              :type="type"
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
          <f-button v-if="showMore" variant="outline" @click="loadMore">
            <span><f-svg name="redo" size="lg" :spin="spin" fw/></span>
            <span v-t="'load_more'" />
          </f-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { sort, parseSelect } from '@/utils/sort'
import { mapState, mapStateGetSet } from '@/utils/store'
import { removeDuplicate, errorHandler } from '@/utils/helpers'
import { isPlainObject } from '@/utils/typeof'
import FFieldsBank from '@/components/fields-bank'
import timeout from '@/mixins/timeout'

export default {
  inject: ['submit'],
  components: {
    FFieldsBank,
  },
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
    isBank: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: '',
      count: 15,
      more: 15,
      spin: false,
      open: false,
      select: null,
      view: 'bar',
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('options', ['countries']),
    ...mapState('router', ['system']),
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
      return this.values.length
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
    system: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return

        let bank = this.values.filter(item => item.id === newValue)[0]
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
      if (this.isBank) {
        this.open = true
        this.select = bank
      } else {
        this.submit().catch(errorHandler)
      }
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
      return this.isBank ? item.country === this.default_country : true
    },
    listSelectSort(a, b) {
      return a.user_priority < b.user_priority ? 1 : -1
    },
  },
}
</script>
