<template>
  <div>
    <h3 v-text="$t('novaposhta')" />
    <div v-for="(item, index) in type" :key="index" @click="selectType(item)">
      <f-svg v-if="item === selectedType" name="check-circle" />
      <span v-text="$t(item)" />
    </div>
    <div v-if="selectedDepartment" key="department">
      <f-input-autocomplete
        name="city-department"
        :get-list="getListCityDepartment"
        :get-data="getData"
        :get-item="getItem"
        @select="selectCity"
      />
      <f-input-autocomplete
        v-if="refCity"
        key="street-department"
        name="street-department"
        :get-list="getListStreetDepartment"
        :get-data="getData"
        :get-item="getItem"
        send
        @select="selectStreet"
      />
    </div>
    <div v-if="selectedCompany" key="company">
      <f-input-autocomplete
        name="city-company"
        :get-list="getListCityCompany"
        :get-data="getData"
        :get-item="getItem"
        @select="selectCity"
      />
      <f-input-autocomplete
        v-if="refCity"
        key="street-company"
        name="street-company"
        :get-list="getListStreetCompany"
        :get-data="getData"
        :get-item="getItem"
        send
        @select="selectStreet"
      />
      <f-form-group
        v-if="refCity && refStreet"
        v-model="building"
        name="building"
      />
      <f-form-group
        v-if="refCity && refStreet"
        v-model="apartment"
        name="apartment"
      />
    </div>
  </div>
</template>

<script>
import FInputAutocomplete from '@/components/input-autocomplete'
import FSvg from '@/components/svg'
import {
  cityDepartment,
  streetDepartment,
  cityCompany,
  streetCompany,
} from '@/store/directory'

export default {
  components: {
    FInputAutocomplete,
    FSvg,
  },
  data() {
    return {
      building: '',
      apartment: '',
      selectedType: '',
      type: ['department', 'company'],
      refCity: '',
      refStreet: '',
    }
  },
  computed: {
    selectedDepartment() {
      return this.selectedType === 'department'
    },
    selectedCompany() {
      return this.selectedType === 'company'
    },
  },
  methods: {
    selectType(type) {
      this.refCity = ''
      this.refStreet = ''
      this.selectedType = type
    },
    getListCityDepartment(value) {
      return cityDepartment(value)
    },
    getListStreetDepartment(value) {
      return streetDepartment(this.refCity, value)
    },
    getData({ data }) {
      return data
    },
    getItem({ Description }) {
      return Description
    },
    selectCity({ Ref }) {
      this.refCity = Ref
      this.refStreet = ''
    },
    selectStreet({ Ref }) {
      this.refStreet = Ref
    },
    getListCityCompany(value) {
      return cityCompany(value)
    },
    getListStreetCompany(value) {
      return streetCompany(this.refCity, value)
    },
  },
}
</script>
