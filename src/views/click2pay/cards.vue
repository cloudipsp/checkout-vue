<template>
  <f-form-group v-bind="attrs" data-e2e-click2pay-cards v-on="fListeners">
    <template #text="{ item }">
      <div :class="$style.text">
        <img
          :class="$style.icon"
          :src="item.data.digitalCardData.artUri"
          alt=""
        />
        <div>
          <div :class="$style.number">{{ cardNumber(item) }}</div>
          <div :class="$style['expiry-date']">
            <span v-text="$t('expires_on')" /> {{ expiryDate(item) }}
          </div>
        </div>
      </div>
    </template>
    <template #item="{ item }">
      <img
        :class="$style.icon"
        :src="item.data.digitalCardData.artUri"
        alt=""
      />
      <div>
        <div :class="[$style.number, $style.number_secondary]">
          {{ cardNumber(item) }}
        </div>
        <div :class="$style['expiry-date']">
          <span v-text="$t('expires_on')" /> {{ expiryDate(item) }}
        </div>
      </div>
    </template>
  </f-form-group>
</template>

<script>
import { makeProp } from '@/utils/props'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { getBinName } from '@/utils/get-bin-name'

export default {
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
      }
    },
    cardNumber() {
      return item =>
        `${this.$t(getBinName(item.data.panBin))} •••• ${item.data.panLastFour}`
    },
    expiryDate() {
      return item =>
        `${item.data.panExpirationMonth}/${item.data.panExpirationYear.slice(
          -2
        )}`
    },
  },
}
</script>

<style lang="scss" module>
.text {
  display: flex;
}

.icon {
  width: px-to-rem(64px);
  height: px-to-rem(40px);
  margin-right: px-to-rem(8px);
  border-radius: px-to-rem(4px);
}

.number {
  margin-bottom: px-to-rem(4px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #3d3d3d;
  }
}

.number_secondary {
  color: #3d3d3d;
}

.expiry-date {
  height: px-to-rem(16px);
  font-size: px-to-rem(12px);
  font-weight: 400;

  :global(.f-theme-light) & {
    color: #818c99;
  }
}

.expiry-date_secondary {
  color: #818c99;
}

.dropdown {
  max-height: px-to-rem(316px);
  padding: px-to-rem(2px);
  overflow: hidden;
}
</style>
