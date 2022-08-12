<template>
  <transition name="f-fade-enter">
    <div v-if="ready">
      <div class="f-row">
        <div v-if="showCountry" class="f-col f-bank-country">
          <f-country
            v-model="default_country"
            :options="country"
            :description="label"
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
      <div class="f-row">
        <div
          v-for="item in listMin"
          :key="item.id"
          :class="classBankItemWrapper"
        >
          <button :class="classBankItem" type="button" @click="goSystem(item)">
            <f-icon
              :name="item.logo"
              :type="item.method"
              :class="classBankIcon"
              :size="sizeBankIcon"
            />
            <div :class="classBankItemBody">
              <div class="f-bank-name" v-text="$t(item.name)" />
              <div v-if="isGermany" class="f-bank-iban">
                {{ item.iban }}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="f-bank-footer">
        <f-button v-if="showMore" variant="outline" @click="loadMore">
          <span><f-svg name="redo" size="lg" :spin="spin" fw /></span>
          <span v-text="$t('load_more')" />
        </f-button>
      </div>
    </div>
    <div v-else>
      <div class="f-row">
        <div
          v-for="item in preloader"
          :key="item"
          :class="classBankItemWrapper"
        >
          <div class="f-bank-item">
            <div class="f-mr-12 f-w-48 f-preloader f-preloader-48" />
            <div class="f-bank-item-wrapper">
              <div class="f-preloader f-preloader-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import FFormBase from '@/components/form/form/form-base'
import FSvg from '@/components/svg'
import FIcon from '@/components/icon'
import FButton from '@/components/button/button'
import { FCountry } from '@/import'
import { sort, parseSelect } from '@/utils/sort'
import { mapState, mapStateGetSet } from '@/utils/store'
import { errorHandler, removeDuplicate } from '@/utils/helpers'
import { timeoutMixin } from '@/mixins/timeout'
import {
  PROP_TYPE_OBJECT,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { resizeMixin } from '@/mixins/resize'
import { upperFirst } from '@/utils/string'

const supportSystemRoute = [
  'banklinks_eu',
  'local_methods',
  'loans',
  'emoney',
  'crypto',
]

export default {
  components: {
    FFormBase,
    FSvg,
    FIcon,
    FButton,
    FCountry,
  },
  mixins: [timeoutMixin, resizeMixin],
  inject: ['submit'],
  props: {
    // {147209: {country: 'PL', name: '', logo: 'mbank'}}
    config: makeProp(PROP_TYPE_OBJECT, {}),
    enableCountry: makeProp(PROP_TYPE_BOOLEAN, false),
    breakpoint: makeProp(PROP_TYPE_STRING, 'md'),
    noMore: makeProp(PROP_TYPE_BOOLEAN, false),
    noSearch: makeProp(PROP_TYPE_BOOLEAN, false),
    label: makeProp(PROP_TYPE_STRING, ''),
  },
  data() {
    return {
      search: '',
      counts: 0,
      spin: false,
      view_: 'bar',
    }
  },
  computed: {
    ...mapState(['ready', 'has_fields']),
    ...mapState('options', ['countries']),
    ...mapStateGetSet('options', ['default_country']),
    // [{id: 147209, country: 'PL', name: '', logo: 'mbank'}]
    values() {
      return Object.values(this.config)
    },
    // [{id: 'PL', name:''}]
    country() {
      return this.listCountry.map(parseSelect)
    },
    listCountry() {
      return this.countries && this.countries.length
        ? this.countries
        : this.values
            .map(item => item.country)
            .filter(removeDuplicate)
            .filter(item => item !== 'XX')
    },
    // [{id: 147209, country: 'PL', name: '', logo: 'mbank'}]
    listSelect() {
      return this.values
        .filter(this.listSelectFilter)
        .sort(sort('country_priority'))
        .sort(sort('user_priority', true))
    },
    list() {
      let search = this.search.toLowerCase()
      if (search) {
        return this.listSelect.filter(
          ({ name = '', iban = '' }) =>
            name.toLowerCase().includes(search) ||
            iban.toLowerCase().includes(search)
        )
      } else {
        return this.listSelect
      }
    },
    listMin() {
      return this.list.slice(0, this.counts)
    },
    showCountry() {
      return this.enableCountry && this.listCountry.length > 0
    },
    showSearch() {
      return !this.noSearch && this.listSelect.length > 10
    },
    showView() {
      return this.isGermany
    },
    showMore() {
      return !this.noMore && this.list.length > this.counts
    },
    isBar() {
      return this.view_ === 'bar'
    },
    isList() {
      return this.view_ === 'list'
    },
    isMin() {
      return this.values.length < 4 && this.isBreakpoint && this.ready
    },
    view() {
      return this.isMin ? 'min' : this.view_
    },
    classBankItemWrapper() {
      let className
      if (this.isMin || this.isList) {
        className = 'f-col-12'
      } else if (this.isBar) {
        className = `f-col-6 f-col-${this.breakpoint}-4`
      }
      return [className, 'f-mb-12', `f-mb-${this.breakpoint}-16`]
    },
    classBankItem() {
      return [`f-bank-item_${this.view}`, 'f-bank-item', 'f-btn-unstyled']
    },
    classBankViewBar() {
      return [{ 'f-active': this.isBar }, 'f-bank-view-icon']
    },
    classBankViewList() {
      return [{ 'f-active': this.isList }, 'f-bank-view-icon']
    },
    classBankIcon() {
      return ['f-bank-icon', `f-bank-icon_${this.view}`]
    },
    classBankItemBody() {
      return ['f-bank-item-wrapper', `f-bank-item-wrapper_${this.view}`]
    },
    isGermany() {
      return this.default_country === 'DE'
    },
    sizeBankIcon() {
      return this.isList ? 'sm' : 'md'
    },
    preloader() {
      return this.isBreakpoint ? Array(10) : Array(15)
    },
    count() {
      return this.isBreakpoint ? 10 : 15
    },
    isBreakpoint() {
      return this[`isBreakpointDown${upperFirst(this.breakpoint)}`]
    },
  },
  watch: {
    ready: 'setCountry',
  },
  created() {
    this.counts = this.count

    this.setCountry()
  },
  methods: {
    goSystem(item) {
      const { id, form, method } = item
      if (!supportSystemRoute.includes(method)) {
        this.$emit('select', item)
      } else if (form?.fields || this.has_fields) {
        this.$router
          .push({ name: 'system', params: { method, system: id } })
          .catch(() => {})
      } else {
        this.submit({ payment_system: id }).catch(errorHandler)
      }
    },
    clear() {
      this.search = ''
      this.setView('bar')
    },
    loadMore() {
      this.spin = true
      this.timeout(() => {
        this.counts += this.count
        this.spin = false
      }, 300)
    },
    setView(view) {
      this.view_ = view
    },
    listSelectFilter({ country, method }) {
      return this.enableCountry && method === 'banklinks_eu'
        ? [this.default_country, 'XX'].includes(country)
        : true
    },
    setCountry() {
      if (!this.enableCountry) return
      if (this.listCountry.includes(this.default_country)) return

      if (this.listCountry.length > 0) {
        this.default_country = this.listCountry[0]
      }
    },
  },
}
</script>
