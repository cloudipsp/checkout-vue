<template>
  <div :class="className">
    <template v-if="isBreakpointDownLg">
      <div v-if="full_screen" class="f-top"><div class="f-top-inner" /></div>
      <f-info />
      <f-price />
      <f-button-wallet-el v-if="!has_fields" />
    </template>
    <f-bank
      :config="config"
      enable-country
      :more="false"
      breakpoint="lg"
      @select="select"
    />
    <div v-if="isBreakpointDownLg" :class="$style.btn">
      <f-button variant="default" block @click="goMenu">
        <span v-text="$t('see_all_other_methods')" />
        <span><f-svg class="f-ml-8" name="arrow-right" size="lg" /></span>
      </f-button>
    </div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import FInfo from '@/components/info'
import FPrice from '@/components/price'
import FButtonWalletEl from '@/components/button-pay-wallet-el'
import FBank from '@/views/checkout/method/bank'
import FButton from '@/components/button/button'
import FSvg from '@/components/svg'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FInfo,
    FPrice,
    FButtonWalletEl,
    FBank,
    FButton,
    FSvg,
  },
  mixins: [resizeMixin],
  computed: {
    ...mapState('tabs', ['most_popular']),
    ...mapState(['ready', 'has_fields']),
    className() {
      return [
        this.$style.wrapper,
        {
          'f-container-sm': this.isBreakpointDownLg,
        },
      ]
    },
    config() {
      return this.most_popular || {}
    },
  },
  methods: {
    select({ method }) {
      if (method === 'wallets' && !this.has_fields) {
        this.$root.$emit('click-wallet')
      } else {
        this.$router.push({ name: method }).catch(() => {})
      }
    },
    goMenu() {
      this.$router.push({ name: 'menu' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.btn {
  margin-top: auto;
  padding-top: px-to-rem(24px);
  @include sticky-bottom(px-to-rem(32px));

  background: linear-gradient(
    to bottom,
    fade($container_bg, 0),
    $container_bg #{px-to-rem(16px)},
    $container_bg
  );
}
</style>
