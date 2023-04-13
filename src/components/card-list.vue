<template>
  <div>
    <button
      v-if="showAdd"
      :class="['f-card-list-item f-card-list-item_add', 'f-btn-unstyled']"
      type="button"
      @click="setCardNumber({})"
    >
      <f-svg name="plus-circle" class="f-card-list-icon" size="lg" fw />
      <span v-text="$t('use_other_card')" />
    </button>
    <f-card-list-item
      v-for="item in list"
      :key="item.card_number"
      :item="item"
      @click="setCardNumber(item)"
    />
  </div>
</template>

<script>
import FSvg from '@/components/svg'
import FCardListItem from '@/components/card-list-item'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FSvg,
    FCardListItem,
  },
  props: {
    list: makeProp(PROP_TYPE_ARRAY),
  },
  computed: {
    ...mapState(['mode_test']),
    showAdd() {
      return !this.mode_test
    },
  },
  methods: {
    setCardNumber(card) {
      this.store.setCardNumber(card)

      this.$emit('input')
    },
  },
}
</script>
