<template>
  <div>
    <div class="f-system">
      <f-icon
        :name="item[logo]"
        :type="$route.params.method"
        class="f-system-icon"
      />
      <div class="f-system-name">{{ item.name }}</div>

      <div>{{ item.iban }}</div>
      <f-button-close class="f-system-close" @click="goMethod" />
    </div>
    <div class="f-bank-desc" v-text="$t('bank_desc')" />
    <div class="f-container-sm">
      <f-fields-bank v-if="showFieldsBank" :fields="item.form.fields" />
      <f-fields />
      <f-offer />
      <f-button-pay />
    </div>
  </div>
</template>

<script>
import FFieldsBank from '@/components/fields-bank'
import { isPlainObject } from '@/utils/typeof'
import { mapState } from '@/utils/store'

export default {
  components: {
    FFieldsBank,
  },
  data() {
    return {
      logo: 'bank_logo',
      item: {},
    }
  },
  computed: {
    ...mapState(['tabs']),
    payment_systems() {
      return this.tabs[this.$route.params.method]?.payment_systems || {}
    },
    showFieldsBank() {
      return isPlainObject(this.item.form)
    },
  },
  watch: {
    $route: 'initSystem',
  },
  created() {
    this.initSystem()
  },
  methods: {
    goMethod() {
      this.$router.push({ name: this.$route.params.method }).catch(() => {})
    },
    initSystem() {
      this.item = this.payment_systems[this.$route.params.system]
    },
  },
}
</script>
