<template>
  <div v-if="show" :class="$style.wrapper">
    <div :class="$style.header">
      <svg-click2pay-visa-mastercard
        :class="$style.icon"
        @click.native="goClick2pay"
      />
      <div :class="$style.right">
        <div :class="$style.email">{{ email }}</div>
        <f-link @click="goSwitchId">{{ $t('another_user') }}</f-link>
      </div>
    </div>
    <div v-if="showMessage">
      <h3 :class="$style.h3" v-text="$t('c2p_access_to_saved_cards')" />
      <div :class="$style.desc" v-text="$t('c2p_no_saved_cards')" />
    </div>
  </div>
</template>

<script>
import { profiles, hasCards } from '@/click2pay'
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'
import FLink from '@/components/link.vue'

export default {
  components: {
    SvgClick2payVisaMastercard,
    FLink,
  },
  data() {
    return {
      show: false,
      email: '',
      cards: [],
    }
  },
  computed: {
    showMessage() {
      return !this.cards.length
    },
  },
  created() {
    profiles()
      .then(({ profiles }) => {
        this.show = true
        this.email = profiles[0].maskedConsumer.maskedEmailAddress
        this.cards = profiles[0].maskedCards
      })
      .catch(() => {})

    this.goClick2pay()
  },
  methods: {
    goClick2pay() {
      hasCards()
        .then(() => {
          this.$router.push({ name: 'click2pay' }).catch(() => {})
        })
        .catch(() => {})
    },
    goSwitchId() {
      this.$router.push({ name: 'click2pay_switch_id' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(16px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: px-to-rem(16px);
}

.icon {
  cursor: pointer;
  min-width: px-to-rem(149px);

  :global(.f-theme-light) & {
    color: #1434cb;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.email {
  font-size: px-to-rem(14px);
  font-weight: 400;
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.h3 {
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 600;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #313539;
  }
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  margin-bottom: px-to-rem(8px);

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.right {
  text-align: right;
}
</style>
