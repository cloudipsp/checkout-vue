<template>
  <span v-if="read_only">{{ label }}</span>
  <f-modal-tooltip v-else ref="mt" v-bind="attrs">
    <template #text>
      {{ label }}
      <f-svg :class="$style.arrow" name="angle-down" size="lg" />
    </template>
    <template #default>
      <f-card-list :list="list" @input="hide" />
    </template>
  </f-modal-tooltip>
</template>

<script>
// ref="label"
// :target="() => $refs.label?.$el"
import FModalTooltip from '@/components/modal-tooltip'
import FSvg from '@/components/svg'
import FCardList from '@/components/card-list'
import { parseCards } from '@/utils/card-brand'
import { isArray } from '@/utils/inspect'
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { attrsMixin } from '@/mixins/attrs'

export default {
  components: {
    FModalTooltip,
    FSvg,
    FCardList,
  },
  mixins: [attrsMixin],
  props: {
    label: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      list: [],
      showModalCard: false,
      showTooltipCard: false,
    }
  },
  computed: {
    ...mapState(['cards', 'read_only']),
    scrollable() {
      return this.cards.length > 5
    },
    attrs() {
      return {
        ...this.fAttrs,
        scrollable: this.scrollable,
        modalBodyClass: 'f-modal-body-card-list',
        modalWrapperClass: '',
        dropdownClass: 'f-tooltip-select-card',
        dropdownWrapperClass: this.$style.dropdown,
        dropdownPlacement: 'bottom',
      }
    },
  },
  created() {
    this.parseCards()
  },
  methods: {
    parseCards() {
      if (!isArray(this.cards)) return
      if (!this.cards.length) return

      parseCards(this.cards).then(cards => {
        this.list = cards
        this.store.setCardNumber(this.list[0])
      })
    },
    hide() {
      this.$refs.mt.$emit('hide')
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
