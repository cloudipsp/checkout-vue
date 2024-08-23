<template>
  <div v-if="show">
    <click2pay-cards
      v-model="srcDigitalCardId"
      :list="cards"
      @input="setDigitalCardId"
    />
    <div :class="$style.or">
      <div :class="$style.or_hr" />
      <div :class="$style.or_text" v-text="$t('or')" />
    </div>
    <f-button
      :class="$style.mb_32"
      block
      size="lg"
      :text="$t('enter_card_details')"
      @click="goCard"
    />
  </div>
</template>

<script>
import Click2payCards from '@/views/click2pay/cards'
import FButton from '@/components/button/button'
import { profiles, setSrcDigitalCardId } from '@/click2pay'

export default {
  components: {
    Click2payCards,
    FButton,
  },
  data() {
    return {
      show: false,
      cards: [],
      srcDigitalCardId: '',
    }
  },
  created() {
    profiles()
      .then(({ profiles }) => {
        this.show = true
        this.cards = profiles[0].maskedCards
        this.cardsActive = this.cards.filter(
          item => item.digitalCardData.status === 'ACTIVE'
        )

        if (this.cardsActive.length) {
          this.setDigitalCardId(this.cardsActive[0].srcDigitalCardId)
        }
      })
      .catch(() => {})
  },
  methods: {
    setDigitalCardId(id) {
      setSrcDigitalCardId(id)
      this.srcDigitalCardId = id
    },
    goCard() {
      this.$router.push({ name: 'card' }).catch(() => {})
    },
  },
}
</script>

<style lang="scss" module>
.or {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: px-to-rem(32px);
  margin-bottom: px-to-rem(32px);
}

.or_hr {
  position: absolute;
  height: 1px;
  top: 50%;
  left: 0;
  right: 0;

  :global(.f-theme-light) & {
    background-color: #d5dae0;
  }
}

.or_text {
  position: relative;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);
  font-weight: 400;
  padding: 0 px-to-rem(12px);
  background-color: $container-bg;

  :global(.f-theme-light) & {
    color: #5a6470;
  }
}

.mb_32 {
  margin-bottom: px-to-rem(32px);
}
</style>
