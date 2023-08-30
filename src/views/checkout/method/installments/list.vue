<template>
  <transition name="f-fade-enter">
    <div v-if="ready" key="1" :class="$style.wrapper" role="list">
      <div>
        <f-item
          v-for="item in list"
          :key="item.id"
          :class="$style.item"
          :item="item"
        />
      </div>
      <div v-if="listSoon.length" :class="$style.list_soon">
        <span :class="$style.soon">{{ $t('expect_soon') }}</span>
        <f-item-soon
          v-for="item in listSoon"
          :key="item.id"
          :class="$style.item"
          :item="item"
        />
      </div>
    </div>
    <div v-else key="2">
      <div class="f-row">
        <div v-for="item in Array(3)" :key="item" class="f-col-12 f-mb-20">
          <div class="f-bank-item">
            <div class="f-mr-12 f-w-48 f-preloader f-h-48" />
            <div class="f-bank-item-wrapper">
              <div class="f-preloader f-h-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from '@/utils/store'
import FItem from '@/views/checkout/method/installments/item'
import FItemSoon from '@/views/checkout/method/installments/item-soon'

export default {
  components: {
    FItem,
    FItemSoon,
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('tabs', ['installments']),
    list() {
      return Object.values(this.installments || {})
    },
    listSoon() {
      return []
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  margin-top: px-to-rem(-16px);
}

.list_soon {
  position: relative;
  margin-top: px-to-rem(40px);
  padding-top: px-to-rem(12px);

  :global(.f-theme-light) & {
    border-top: px-to-rem(1px) solid #d5dae0;
  }

  :global(.f-theme-dark) & {
    border-top: px-to-rem(1px) solid #5a5d61;
  }
}

.soon {
  position: absolute;
  top: px-to-rem(-12px);
  left: 50%;
  font-weight: 500;
  font-size: px-to-rem(14px);
  line-height: px-to-rem(20px);
  padding: 0 px-to-rem(12px);
  background: $container_bg;
  transform: translateX(-50%);

  :global(.f-theme-light) & {
    color: #a9b2bd;
  }

  :global(.f-theme-dark) & {
    color: #adaeb0;
  }
}

.item {
  padding-top: px-to-rem(20px);
  padding-bottom: px-to-rem(20px);

  :global(.f-theme-light) & {
    border-bottom: px-to-rem(1px) solid #eef0f2;
  }

  :global(.f-theme-dark) & {
    border-bottom: px-to-rem(1px) solid #5a5d61;
  }

  &:last-child {
    border: none;
  }
}
</style>
