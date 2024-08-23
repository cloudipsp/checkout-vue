<template>
  <f-form-group v-bind="attrs" data-e2e-click2pay-cards v-on="fListeners">
    <template #text="{ item }">
      <click2pay-card-item :item="item" no-info />
    </template>
    <template #item="{ item }">
      <click2pay-card-item :item="item" variant="secondary" />
    </template>
  </f-form-group>
</template>

<script>
import Click2payCardItem from '@/views/click2pay/card-item'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'

export default {
  components: {
    Click2payCardItem,
  },
  mixins: [attrsMixin, listenersMixin],
  inheritAttrs: false,
  props: {
    list: makeProp(PROP_TYPE_ARRAY),
  },
  computed: {
    options() {
      return this.list.map(item => ({
        data: item,
        text: item.panLastFour,
        value: item.srcDigitalCardId,
        disabled: item.digitalCardData.status !== 'ACTIVE',
      }))
    },
    attrs() {
      return {
        ...this.fAttrs,
        options: this.options,
        name: 'cards',
        label: '',
        variantItem: 'card',
        component: 'select2',
        noLabelFloating: true,
        modalBodyClass: 'f-modal-body-card-list',
        modalWrapperClass: '',
        dropdownClass: 'f-tooltip-select-card',
        dropdownWrapperClass: this.$style.dropdown,
        rules: 'required',
        placeholder: this.$t('select_card'),
      }
    },
  },
}
</script>

<style lang="scss" module>
.dropdown {
  max-height: px-to-rem(316px);
  padding: px-to-rem(2px);
  overflow: hidden;
}
</style>
