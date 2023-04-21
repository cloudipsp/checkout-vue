<template>
  <div :class="className">
    <div v-if="backdrop" :class="$style.backdrop" />
    <div :class="$style.loader">
      <f-svg name="sota" :class="$style.item" />
      <f-svg name="sota" :class="$style.item" />
      <f-svg name="sota" :class="$style.item" />
    </div>
  </div>
</template>

<script>
import FSvg from '@/components/svg'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FSvg,
  },
  props: {
    backdrop: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    className() {
      return [
        this.$style.wrapper,
        {
          [this.$style.wrapper_backdrop]: this.backdrop,
        },
      ]
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper_backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $zindex-loading;
}

.backdrop {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $container_bg;
  opacity: $modal-backdrop-opacity;

  :global(.f-no-embed) & {
    @include media-breakpoint-up(xl) {
      border-radius: px-to-rem(16px);
    }
  }
}

.loader {
  position: relative;
  width: $loading-width;
  height: $loading-width;
}

.item {
  position: absolute;
  color: #08a835;
  font-size: $loading-item;

  animation-duration: 6s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.item:nth-child(1) {
  animation-name: f-loading-left1;
}
.item:nth-child(2) {
  animation-name: f-loading-left2;
}
.item:nth-child(3) {
  color: #000;
  animation-name: f-loading-right;
}

@mixin loading-top-center {
  top: $loading-top;
  left: calc(($loading-width - $loading-item) / 2);
}

@mixin loading-right-button {
  top: $loading-width - $loading-item;
  left: $loading-width - $loading-item;
}

@mixin loading-button-left {
  top: $loading-width - $loading-item;
  left: 0;
}

@keyframes f-loading-right {
  #{calc(100 / 12) * 0%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 1%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 2%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 3%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 4%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 5%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 6%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 7%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 8%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 9%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 10%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 11%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 12%} {
    @include loading-top-center();
  }
}

@keyframes f-loading-left1 {
  #{calc(100 / 12) * 0%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 1%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 4%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 5%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 8%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 9%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 12%} {
    @include loading-right-button();
  }
}

@keyframes f-loading-left2 {
  #{calc(100 / 12) * 0%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 2%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 3%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 6%} {
    @include loading-right-button();
  }
  #{calc(100 / 12) * 7%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 10%} {
    @include loading-top-center();
  }
  #{calc(100 / 12) * 11%} {
    @include loading-button-left();
  }
  #{calc(100 / 12) * 12%} {
    @include loading-button-left();
  }
}
</style>
