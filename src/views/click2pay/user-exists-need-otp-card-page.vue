<template>
  <f-box :class="$style.wrapper" @click.native="open">
    <div :class="$style.header">
      <svg-click2pay :class="$style.svg" /><span
        :class="$style.title"
        v-text="$t('click2pay')"
      />
    </div>
    <div v-html="$t('c2p_need_otp_desc', { click2pay })" />
    <click2pay-modal-about ref="about" />
  </f-box>
</template>

<script>
import SvgClick2pay from '@/svg/click2pay.svg'
import FBox from '@/components/box.vue'
import Click2payModalAbout from '@/views/click2pay/modal-about.vue'

export default {
  components: {
    SvgClick2pay,
    FBox,
    Click2payModalAbout,
  },
  computed: {
    click2pay() {
      return `<a href="">${this.$t('click2pay')}</a>`
    },
  },
  methods: {
    open(ev) {
      if (ev.target === this.$el.querySelector('a')) {
        ev.preventDefault()

        this.$refs.about.show()
      } else {
        this.$router.push({ name: 'click2pay_otp' }).catch(() => {})
      }
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-bottom: px-to-rem(32px);
  cursor: pointer;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: px-to-rem(8px);
}

.title {
  font-weight: 600;
  font-size: px-to-rem(16px);
  line-height: px-to-rem(20px);

  :global(.f-theme-light) & {
    color: #313539;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}

.svg {
  margin-right: px-to-rem(8px);
  min-width: px-to-rem(36px);

  :global(.f-theme-light) & {
    color: #1434cb;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}
</style>
