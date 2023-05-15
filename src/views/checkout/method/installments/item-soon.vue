<template>
  <div :class="$style.wrapper" role="listitem">
    <f-icon
      :name="item.logo"
      :type="item.method"
      :class="$style.icon"
      :size="iconSize"
    />
    <div :class="$style.header">
      <div :class="$style.name">{{ item.name }}</div>
    </div>
    <div :class="$style.break" />
    <div :class="$style['col-parts']">
      <f-form-group
        value=""
        :class="$style.parts"
        :label-class="$style.label"
        component="select2"
        :name="$t('Payments')"
        :input-class="$style.select"
        disabled
        no-label-floating
        size="48"
      />
    </div>
    <div :class="$style['col-amount']" />
    <div :class="$style['col-btn']">
      <f-button variant="default" size="icon" disabled>
        <span><f-svg name="arrow-right" size="lg" /></span>
      </f-button>
    </div>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import FSvg from '@/components/svg'
import FButton from '@/components/button/button'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { resizeMixin } from '@/mixins/resize'

export default {
  components: {
    FIcon,
    FSvg,
    FButton,
  },
  mixins: [resizeMixin],
  props: {
    item: makeProp(PROP_TYPE_OBJECT),
  },
  computed: {
    iconSize() {
      return this.isBreakpointDownMd ? 36 : 48
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-wrap: wrap;
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
    color: #a9b2bd;
  }

  :global(.f-theme-dark) & {
    color: #838688;
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
    color: #6f7274;
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

.col-btn {
  display: none;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(md) {
      display: block;
    }
  }
}
</style>
