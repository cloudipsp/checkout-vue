<template>
  <div
    :class="$style.wrapper"
    role="listitem"
    tabindex="0"
    @keydown.enter="click"
    @click="click"
  >
    <f-icon
      :name="item.logo"
      :type="item.method"
      :class="$style.icon"
      :size="iconSize"
    />
    <div :class="$style.header">
      <div :class="$style.name">{{ item.name }}</div>
      <div :class="[$style.desc, $style.desc_1]">
        <span v-text="$t('from_amount_month', [amountMonth])" />
        <span> {{ min }}–{{ max }} {{ $t('payments') }}</span>
      </div>
    </div>
    <div :class="$style.break" />
    <div :class="$style['col-parts']">
      <f-form-group
        v-model="parts"
        :class="$style.parts"
        :label-class="$style.label"
        component="select2"
        :options="list"
        :name="$t('Payments')"
        :input-class="$style.select"
        no-label-floating
        size="48"
        @input="input"
      />
    </div>
    <div :class="$style['col-amount']">
      <div :class="$style['wrapper-amount']">
        <f-amount
          :value="amountTotal"
          :currency="$t('currency_month', [$t(currency)])"
          :amount-class="$style.amount"
          :currency-class="$style.currency"
          sup
        />
      </div>
    </div>
    <div :class="$style['col-btn']">
      <f-button variant="success" size="icon" @click="goSystem">
        <span><f-svg name="arrow-right" size="lg" /></span>
      </f-button>
    </div>
    <div :class="[$style.desc, $style.desc_2]">
      <span v-text="$t('from_amount_month', [amountMonth])" />
      <span> {{ min }}–{{ max }} {{ $t('payments') }}</span>
    </div>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import FSvg from '@/components/svg'
import FAmount from '@/components/base/amount'
import FButton from '@/components/button/button'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { mapState } from '@/utils/store'
import { parseSelect } from '@/utils/sort'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FIcon,
    FSvg,
    FAmount,
    FButton,
  },
  mixins: [resizeMixin],
  props: {
    item: makeProp(PROP_TYPE_OBJECT),
  },
  data() {
    return {
      parts: 0,
      amountTotal: 0,
    }
  },
  computed: {
    ...mapState('params', ['currency', 'token', 'button', 'amount']),
    min() {
      return this.item.available_payments_number[0]
    },
    max() {
      return this.item.available_payments_number[
        this.item.available_payments_number.length - 1
      ]
    },
    amount_min() {
      return this.item.amount_min
    },
    amountMonth() {
      return (
        this.$n(this.amount_min / 100, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) +
        ' ' +
        this.$t(this.currency)
      )
    },
    list() {
      return this.item.available_payments_number.map(parseSelect)
    },
    iconSize() {
      return this.isBreakpointDownMd ? 36 : 48
    },
  },
  created() {
    this.parts = this.max
    this.amountTotal = this.amount_min
  },
  methods: {
    goSystem() {
      this.$router
        .push({
          name: 'installments-system',
          params: { method: 'installments', system: this.item.id },
          query: { parts: this.parts },
        })
        .catch(() => {})
    },
    click() {
      if (!this.isBreakpointDownMd) return

      this.goSystem()
    },
    input(value) {
      this.store
        .sendRequest(
          'api.checkout.partial',
          'calc',
          {
            payment_id: this.item.id,
            payment_parts: value,
            token: this.token,
            button: this.button,
            amount: this.token || this.button ? undefined : this.amount,
          },
          { cached: true }
        )
        .then(model => {
          this.amountTotal = model.attr('amount_partial')
        })
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  cursor: pointer;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      cursor: default;
    }
  }
}

.icon {
  margin-right: px-to-rem(12px);
  border-radius: px-to-rem(8px);
  box-shadow: 0 px-to-rem(1px) px-to-rem(4px) $bank_icon_shadow;
}

.header {
  flex-basis: 0;
  flex-grow: 1;
  padding-right: px-to-rem(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: px-to-rem(36px);
  margin-bottom: px-to-rem(8px);

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      margin-bottom: 0;
      min-height: px-to-rem(48px);
    }
  }
}

.name {
  font-weight: 500;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(18px);

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      font-size: px-to-rem(14px);
      line-height: px-to-rem(20px);
    }

    @include media-breakpoint-up(lg) {
      margin-bottom: px-to-rem(2px);
    }
  }

  :global(.f-theme-light) & {
    color: #3d3d3d;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #818c99;
  }

  :global(.f-theme-dark) & {
    color: #838688;
  }
}

.desc_1 {
  display: none;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(lg) {
      display: block;
    }

    @include media-breakpoint-up(xxl) {
      display: none;
    }
  }
}

.break {
  :global(.f-no-embed) & {
    display: none;

    @include media-breakpoint-up(lg) {
      display: block;
      width: 100%;
      margin-bottom: px-to-rem(12px);
    }

    @include media-breakpoint-up(xxl) {
      display: none;
    }
  }
}

.col-parts {
  display: none;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      padding-right: px-to-rem(20px);
    }

    @include media-breakpoint-up(lg) {
      padding-left: px-to-rem(60px);
    }
  }
}

.parts {
  display: flex;
  align-items: center;
  margin-bottom: 0;

  :global(.f-form-group-inner) {
    width: px-to-rem(72px);
  }
}

.label {
  font-weight: 400;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  margin: 0 px-to-rem(10px) 0 0;

  :global(.f-theme-light) & {
    color: #818c99;
  }

  :global(.f-theme-dark) & {
    color: #838688;
  }
}

.select {
  width: px-to-rem(72px);
}

.col-amount {
  display: none;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      padding-right: px-to-rem(20px);
    }
  }
}

.wrapper-amount {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: px-to-rem(48px);
  white-space: nowrap;
}

.amount {
  font-weight: 600;
  font-size: px-to-rem(24px);
  line-height: px-to-rem(28px);

  :global(.f-theme-light) & {
    color: #3d3d3d;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }

  sup {
    font-size: px-to-rem(14px);
  }
}

.currency {
  font-weight: 400;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(18px);

  :global(.f-theme-light) & {
    color: #818c99;
  }

  :global(.f-theme-dark) & {
    color: #838688;
  }
}

.col-btn {
  display: none;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      display: block;
    }
  }
}

.desc_2 {
  padding-left: px-to-rem(48px);
  width: 100%;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      display: flex;
      flex-direction: column;
      padding-left: px-to-rem(60px);
    }

    @include media-breakpoint-up(lg) {
      display: none;
    }

    @include media-breakpoint-up(xxl) {
      display: flex;
    }
  }
}
</style>
