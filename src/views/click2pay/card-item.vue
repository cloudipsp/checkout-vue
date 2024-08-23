<template>
  <div :class="$style.style">
    <img :class="$style.icon" :src="item.data.digitalCardData.artUri" alt="" />
    <div>
      <div :class="classNumber">{{ cardNumber }}</div>
      <div v-if="!noInfo" :class="$style.info">
        <span :class="classInfo" v-text="$t(status)" />
        <template v-if="isActive">
          <span :class="$style.hr" />
          <span :class="$style['expiry-date']"
            >{{ $t('expires_on') }} {{ expiryDate }}</span
          >
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { makeProp } from '@/utils/props'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { getBinName } from '@/utils/get-bin-name'

export default {
  inheritAttrs: false,
  props: {
    item: makeProp(PROP_TYPE_OBJECT),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      ['default', 'secondary'].includes(value)
    ),
    noInfo: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    classNumber() {
      return [this.$style.number, this.$style[this.variant]]
    },
    classInfo() {
      return [this.$style.status, this.$style[this.status]]
    },
    cardNumber() {
      return `${this.$t(getBinName(this.item.data.panBin))} •••• ${this.item.data.panLastFour}`
    },
    expiryDate() {
      return `${this.item.data.panExpirationMonth}/${this.item.data.panExpirationYear.slice(-2)}`
    },
    status() {
      // $t('active')
      // $t('suspended')
      // $t('expired')
      // $t('pending')
      // $t('cancelled')
      return this.item.data.digitalCardData.status.toLowerCase()
    },
    isActive() {
      return this.status === 'active'
    },
  },
}
</script>

<style lang="scss" module>
.style {
  display: flex;
  align-items: center;
}

.icon {
  width: px-to-rem(64px);
  height: px-to-rem(40px);
  margin-right: px-to-rem(8px);
  border-radius: px-to-rem(4px);
}

.number {
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(20px);
}

.default {
  :global(.f-theme-light) & {
    color: #3d3d3d;
  }
}

.secondary {
  color: #3d3d3d;
}

.info {
  display: flex;
  align-items: center;
  margin-top: px-to-rem(4px);
}

.expiry-date {
  line-height: px-to-rem(16px);
  font-size: px-to-rem(12px);
  font-weight: 400;
  color: #818c99;
}

.status {
  line-height: px-to-rem(16px);
  font-size: px-to-rem(12px);
  font-weight: 400;
}

.active {
  color: #818c99;
}

.suspended {
  color: #dea447;
}

.pending {
  color: #dea447;
}

.cancelled {
  color: $error;
}

.expired {
  color: $error;
}

.hr {
  display: block;
  width: px-to-rem(1px);
  height: px-to-rem(10px);
  margin: 0 px-to-rem(8px);
  background: #e5e8eb;
}
</style>
