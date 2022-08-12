<template>
  <div class="f-card-list">
    <button
      :class="['f-card-list-add', 'f-btn-unstyled']"
      type="button"
      @click="addCardNumber()"
    >
      <f-svg name="plus-circle" class="f-card-list-icon" size="lg" fw />
      <div v-text="$t('use_other_card')" />
    </button>
    <button
      v-for="item in list"
      :key="item.card_number"
      :class="[
        'f-card-list-item',
        'f-btn-unstyled',
        { active: hasActive(item) },
      ]"
      type="button"
      @click="setCardNumber(item)"
    >
      <f-icon
        v-if="item.card_brand"
        type="card/max"
        :name="item.card_brand"
        class="f-card-list-icon"
      />
      <div>
        <div class="f-card-list-number">{{ item.card_number }}</div>
        <div class="f-card-list-expiry-date">
          <span v-text="$t('expires_on')" /> {{ item.expiry_date }}
        </div>
      </div>
    </button>
  </div>
</template>

<script>
import FSvg from '@/components/svg'
import FIcon from '@/components/icon'
import { mapState } from '@/utils/store'
import { PROP_TYPE_ARRAY } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FSvg,
    FIcon,
  },
  props: {
    list: makeProp(PROP_TYPE_ARRAY),
  },
  computed: {
    ...mapState('params', ['card_number']),
    hasActive() {
      return card => card.card_number === this.card_number
    },
  },
  methods: {
    setCardNumber(card) {
      this.$emit('input')

      this.store.setCardNumber(card)
    },
    addCardNumber() {
      this.$emit('add')

      this.store.setCardNumber({})
    },
  },
}
</script>
