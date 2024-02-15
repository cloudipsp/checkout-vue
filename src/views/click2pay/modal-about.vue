<template>
  <f-modal-base v-bind="attrs" v-on="$listeners">
    <template #title>
      <svg-click2pay-circle :class="$style.svg" />
      <h5 class="f-modal-title" v-text="$t('c2p_how_does_work')" />
    </template>
    <div :class="$style.box">
      <svg-click2pay-about />
    </div>
    <ul :class="$style.desc" v-html="$t('c2p_about_desc')" />
    <div :class="$style.center">
      <svg-click2pay-visa-mastercard :class="$style.icon" />
    </div>
  </f-modal-base>
</template>

<script>
import FModalBase from '@/components/modal/modal-base'
import SvgClick2payCircle from '@/svg/click2pay-circle.svg'
import SvgClick2payAbout from '@/svg/click2pay-about.svg'
import SvgClick2payVisaMastercard from '@/svg/click2pay-visa-mastercard.svg'

export default {
  components: {
    FModalBase,
    SvgClick2payCircle,
    SvgClick2payAbout,
    SvgClick2payVisaMastercard,
  },
  computed: {
    attrs() {
      return {
        titleTag: 'div',
        ...this.$attrs,
        ref: 'modal',
      }
    },
  },
  methods: {
    show() {
      this.$refs.modal.show()
    },
  },
}
</script>

<style lang="scss" module>
.svg {
  margin-bottom: px-to-rem(12px);
}

.box {
  text-align: center;
  margin-bottom: px-to-rem(16px);
}

.desc {
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  color: #5a6470;
  margin-bottom: px-to-rem(16px);
}

.center {
  text-align: center;
}

.icon {
  min-width: px-to-rem(100px);

  :global(.f-theme-light) & {
    color: #1434cb;
  }

  :global(.f-theme-dark) & {
    color: #fff;
  }
}
</style>
