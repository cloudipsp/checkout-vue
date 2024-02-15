<template>
  <div :class="$style.wrapper">
    <svg-click2pay-visa-mastercard :class="$style.icon" />
    <div :class="$style.right">
      <div v-if="email" :class="$style.email">{{ emailText }}</div>
      <div v-if="emailShort" :class="$style.email">{{ emailShort }}</div>
      <slot />
    </div>
  </div>
</template>

<script>
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    SvgClick2payVisaMastercard,
  },
  props: {
    email: makeProp(PROP_TYPE_STRING),
    emailShort: makeProp(PROP_TYPE_STRING),
  },
  computed: {
    emailText() {
      const [name, domain] = this.email.split('@')
      return `${name.slice(0, 2)}***@${domain}`
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon {
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

.right {
  text-align: right;
}
</style>
