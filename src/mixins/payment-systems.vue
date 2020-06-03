<template>
  <div :class="['f-' + method]">
    <div class="f-block">
      <div class="f-block-sm">
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
      <div v-if="showTitle" v-t="method + '_t'" class="f-block f-title2" />
      <div class="f-text-center" :class="'f-ps-' + list.length">
        <div
          v-for="item in listMin"
          :key="item.id"
          class="f-ps"
          @click="locationSystem(item)"
        >
          <div class="f-wrapper-icon">
            <f-icon :name="item.bank_logo" />
          </div>
          <div v-t="item.name" />
          <div class="f-iban">
            {{ item.iban }}
          </div>
        </div>
        <div v-if="showMore" class="f-ps" @click="loadMore">
          <div class="f-wrapper-icon">
            <f-svg name="redo" size="3x" :spin="spin" />
          </div>
          <div v-t="'load_more'" />
        </div>
      </div>
    </div>
    <f-modal-form-bank
      v-if="item"
      v-model="open"
      :config="item"
      @submit="submit"
    />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FModalFormBank from '@/components/modal-form-bank'
import { isObject } from '@/utils/typeof'

export default {
  inject: ['formRequest'],
  components: {
    FModalFormBank,
  },
  props: {
    paymentSystems: {
      type: Array,
      required: true,
    },
  },
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
    ...mapState('router', ['method']),
    country() {
      return []
    },
    listFull() {
      return this.paymentSystems.map(function(item) {
        return {
          id: item,
          name: item,
          bank_logo: item,
        }
      })
    },
    listFilter() {
      return this.listFull
    },
    list() {
      let search = this.form.search.toLowerCase()
      if (search) {
        return this.listFilter.filter(function(item) {
          let name = item.name.toLowerCase()
          let iban = item.iban.toLowerCase()

          return name.indexOf(search) > -1 || iban.indexOf(search) > -1
        }, this)
      } else {
        return this.listFilter
      }
    },
    listMin() {
      return this.list.slice(0, this.more)
    },
    showCountry() {
      return this.isMethod('trustly') && this.country.length > 1
    },
    showSearch() {
      return this.listFilter.length > 10
    },
    showTitle() {
      return this.list.length > 1
    },
    showMore() {
      return this.list.length > this.more
    },
    isMethod() {
      return function(method) {
        return this.method === method
      }
    },
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
