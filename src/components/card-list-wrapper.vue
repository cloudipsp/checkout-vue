<template>
  <a
    v-if="enableModal"
    href="#"
    :class="[classLabel, 'f-control-label-card-list']"
    @click.prevent="showModalCard = true"
  >
    {{ label }} <f-svg name="angle-down" size="lg" />
    <f-modal-base
      v-model="showModalCard"
      content-class="f-modal-content-card-list"
      header-class="f-p-0"
      body-class="f-modal-body-card-list"
      :return-focus="returnFocus"
    >
      <f-card-list :list="list" @input="setCardNumber" @add="addCardNumber" />
    </f-modal-base>
  </a>
  <a
    v-else
    ref="tooltip"
    href="#"
    :class="[classLabel, 'f-control-label-card-list']"
    tabindex="-1"
    @click.prevent="showTooltipCard = true"
    @blur="blurTooltipCard"
  >
    {{ label }}
    <f-svg ref="label" name="angle-down" size="lg" tabindex="0" />
    <f-tooltip-card
      :show.sync="showTooltipCard"
      :target="() => $refs.label && $refs.label.$el"
    >
      <f-card-list :list="list" @input="setCardNumber" @add="addCardNumber" />
    </f-tooltip-card>
  </a>
</template>

<script>
import FSvg from '@/components/svg'
import FTooltipCard from '@/components/tooltip/tooltip-card'
import FCardList from '@/components/card-list'
import { timeoutMixin } from '@/mixins/timeout'
import { resizeMixin } from '@/mixins/resize'
import { isPhone } from '@/utils/mobile'
import { parseCards } from '@/utils/card-brand'
import { isArray } from '@/utils/inspect'
import { mapState } from '@/utils/store'

export default {
  components: {
    FSvg,
    FTooltipCard,
    FCardList,
  },
  mixins: [timeoutMixin, resizeMixin],
  props: {
    classLabel: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [],
      showModalCard: false,
      showTooltipCard: false,
      returnFocus: null,
    }
  },
  computed: {
    ...mapState(['cards']),
    enableModal() {
      return isPhone || this.isWidthSm
    },
  },
  created() {
    this.parseCards()
  },
  methods: {
    setCardNumber() {
      this.returnFocus = this.$parent.$parent.$refs.cvv2.$children[0].$children[0].$refs.input.$el
      this.hide()
    },
    addCardNumber() {
      this.returnFocus = this.$parent.$parent.$refs.card_number.$children[0].$children[0].$refs.input.$el
      this.hide()
    },
    hide() {
      this.showModalCard = false
      this.showTooltipCard = false
      // for focus after hiding the tooltip
      this.timeout(() => {
        this.returnFocus.focus()
      }, 100)
    },
    blurTooltipCard() {
      // TODO to volunteer the event setCardNumber addCardNumber
      this.timeout(() => {
        this.showTooltipCard = false
      }, 100)
    },
    parseCards() {
      if (!isArray(this.cards)) return
      if (!this.cards.length) return

      parseCards(this.cards).then(cards => {
        this.list = cards
        this.store.setCardNumber(this.list[0])
      })
    },
  },
}
</script>
