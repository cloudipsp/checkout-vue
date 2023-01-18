<template>
  <div>
    <div class="f-system">
      <f-icon :name="logo" :type="method" class="f-system-icon" />
      <div class="f-system-name">{{ name }}</div>

      <f-button-close class="f-system-close" @click="goMethod" />
    </div>
    <div class="f-container-sm">
      <div :class="$style.desc">
        <h3 :class="$style.h3" v-text="$t('conditions')" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <ul :class="$style.ul" v-html="descT" />
      </div>
      <div class="f-mb-32">
        <f-fields-bank :fields="fields" />
        <f-fields-customer />
        <f-fields-button />
        <f-fields-user />
        <div class="f-row f-mb-16">
          <div class="f-col-5">
            <f-form-group
              v-model="params.payment_parts"
              class="f-mb-0"
              component="select2"
              :options="list"
              :name="$t('Payments')"
              @input="input"
            />
          </div>
          <div class="f-col-7">
            <div :class="$style.price">
              <f-amount
                :value="amountTotal"
                :currency="currency"
                :amount-class="$style.amount"
                :currency-class="$style.currency"
                sup
              />
            </div>
          </div>
        </div>
      </div>
      <f-offer />
      <f-button
        class="f-button-pay"
        variant="success"
        size="lg"
        block
        @click="pay"
      >
        <span v-text="$t('pay')" />&nbsp;
        <f-amount :value="amountTotal" :currency="currency" />
      </f-button>
    </div>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import { FButtonClose } from '@/components/button/button-close'
import FFieldsBank from '@/components/fields/bank'
import FFieldsCustomer from '@/components/fields/customer'
import FFieldsButton from '@/components/fields/button'
import FFieldsUser from '@/components/fields/user'
import FOffer from '@/components/offer'
import FButton from '@/components/button/button'
import FAmount from '@/components/base/amount'
import { mapState } from '@/utils/store'
import { parseSelect } from '@/utils/sort'
import { errorHandler } from '@/utils/helpers'
import { LoadingMono } from '@/import'

export default {
  components: {
    FIcon,
    FButtonClose,
    FFieldsBank,
    FFieldsCustomer,
    FFieldsButton,
    FFieldsUser,
    FOffer,
    FButton,
    FAmount,
  },
  inject: ['formRequest', 'validate'],
  data() {
    return {
      id: '',
      alias: '',
      name: '',
      logo: '',
      available_payments_number: [],
      amountTotal: 0,
      fields: {},
    }
  },
  computed: {
    ...mapState(['tabs', 'params']),
    ...mapState('params', ['currency', 'token', 'button', 'amount']),
    method() {
      return this.$route.params.method
    },
    system() {
      return this.$route.params.system
    },
    descT() {
      return this.$t(`${this.method}_desc_${this.alias}`)
    },
    list() {
      return this.available_payments_number.map(parseSelect)
    },
  },
  watch: {
    $route: 'initSystem',
  },
  created() {
    this.initSystem()
    LoadingMono()
  },
  methods: {
    goMethod() {
      this.$router.push({ name: this.method }).catch(() => {})
    },
    initSystem() {
      let {
        id,
        alias,
        name,
        logo,
        form,
        available_payments_number,
        amount_min,
      } = this.tabs[this.method][this.system]

      this.id = id
      this.alias = alias
      this.name = name
      this.logo = logo
      this.fields = form?.fields || []
      this.available_payments_number = available_payments_number
      this.amountTotal = amount_min

      this.params.payment_parts = this.$route.query.parts
    },
    pay() {
      return this.$nextTick()
        .then(() => this.validate())
        .then(() => LoadingMono())
        .then(() => {
          if (this.alias === 'monobank') {
            return this.$router.push({
              name: 'loading-monobank',
              params: {
                system: this.id,
              },
              query: {
                next: `${this.$route.path}?parts=${this.params.payment_parts}`,
              },
            })
          }
        })
        .then(() => {
          return this.formRequest()
        })
        .catch(errorHandler)
    },
    input(value) {
      this.store
        .sendRequest(
          'api.checkout.partial',
          'calc',
          {
            payment_id: this.system,
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
.desc {
  :global(.f-theme-light) & {
    color: #3d3d3d;
  }

  :global(.f-theme-dark) & {
    color: #d6d7d7;
  }
}

.h3 {
  font-size: px-to-rem(18px);
  line-height: px-to-rem(20px);
  font-weight: 600;
}

.ul {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  padding-left: px-to-rem(20px);
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

.price {
  border-radius: px-to-rem(8px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 px-to-rem(12px);

  :global(.f-theme-light) & {
    background: #f7f8f9;
  }

  :global(.f-theme-dark) & {
    background: #3b3f43;
    border: px-to-rem(1px) solid #5a5d61;
  }
}
</style>
