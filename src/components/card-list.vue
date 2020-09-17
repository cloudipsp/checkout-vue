<template>
  <div class="f-card-list">
    <a href="#" :class="['f-card-list-add']" @click.prevent="addCardNumber()">
      <f-svg class="f-card-list-icon" name="plus-circle" size="lg" fw />
      <div v-t="'use_other_card'" />
    </a>
    <a
      v-for="item in cards"
      :key="item.card_number"
      href="#"
      :class="['f-card-list-item', { active: hasActive(item) }]"
      @click.prevent="setCardNumber(item)"
    >
      <f-icon
        v-if="item.card_brand"
        type="card_system/max"
        :name="item.card_brand"
        class="f-card-list-icon"
      />
      <div>
        <div class="f-card-list-number">{{ item.card_number }}</div>
        <div class="f-card-list-expiry-date">
          <span v-t="'expires_on'" /> {{ item.expiry_date }}
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  // inject: ['$validator'],
  computed: {
    ...mapState(['cards']),
    ...mapState('params', ['card_number']),
    hasActive() {
      return card => card.card_number === this.card_number
    },
  },
  methods: {
    setCardNumber(card) {
      this.$emit('input')

      this.store.setCardNumber(card)
      // this.$nextTick(() => {
      //   this.$validator.validateAll()
      // })
    },
    addCardNumber() {
      this.$emit('add')

      this.store.setCardNumber({})
    },
  },
}
</script>
