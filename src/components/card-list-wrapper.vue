<template>
  <span v-if="read_only">{{ label }}</span>
  <f-button-unstyled v-else-if="enableModal" @click="showModalCard = true">
    {{ label }} <f-svg :class="$style.arrow" name="angle-down" size="lg" />
    <f-modal-base
      v-model="showModalCard"
      header-class="f-p-0"
      body-class="f-modal-body-card-list"
      :scrollable="scrollable"
    >
      <component :is="component">
        <f-card-list :list="list" @input="hide" />
      </component>
    </f-modal-base>
  </f-button-unstyled>
  <f-button-unstyled
    v-else
    @click="showTooltipCard = true"
    @blur="blurTooltipCard"
  >
    {{ label }}
    <f-svg
      ref="label"
      :class="$style.arrow"
      name="angle-down"
      size="lg"
      tabindex="-1"
    />
    <f-tooltip-select
      :show.sync="showTooltipCard"
      :target="() => $refs.label?.$el"
      custom-class="f-tooltip-select-card"
      triggers="click focus blur"
    >
      <f-scrollbar-vertical :wrap-class="$style.dropdown">
        <f-card-list :list="list" @input="hide" />
      </f-scrollbar-vertical>
    </f-tooltip-select>
  </f-button-unstyled>
</template>

<script>
import FButtonUnstyled from '@/components/button/button-unstyled'
import FModalBase from '@/components/modal/modal-base'
import FSvg from '@/components/svg'
import FTooltipSelect from '@/components/tooltip/tooltip-select'
import FCardList from '@/components/card-list'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import FScrollbarVertical from '@/components/scrollbar-vertical'

export default {
  components: {
    FButtonUnstyled,
    FModalBase,
    FSvg,
    FTooltipSelect,
    FCardList,
    FScrollbarVertical,
  },
  mixins: [timeoutMixin, resizeMixin],
  props: {
    label: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      showModalCard: false,
      showTooltipCard: false,
    }
  },
  computed: {
    ...mapState(['cards', 'read_only']),
    enableModal() {
      return isPhone || this.isWidthSm
    },
    component() {
      return this.scrollable ? 'f-scrollbar-vertical' : 'div'
    },
    scrollable() {
      return this.cards.length > 5
    },
    list() {
      return this.cards.map(item => ({
        ...item,
        card_number: item.card_number.replace(/ /g, ''),
        expiry_date: (item.expiry_date || '').replace(/ /g, ''),
      }))
    },
  },
  created() {
    if (this.list.length) {
      this.store.setCardNumber(this.list[0])
    }
  },
  methods: {
    hide() {
      this.showModalCard = false
      this.showTooltipCard = false
    },
    blurTooltipCard() {
      // TODO to volunteer the event setCardNumber addCardNumber
      this.timeout(() => {
        this.showTooltipCard = false
      }, 200)
    },
  },
}
</script>

<style lang="scss" module>
.dropdown {
  max-height: px-to-rem(316px);
  overflow: hidden;
}

.arrow {
  margin-left: px-to-rem(6px);
}
</style>
