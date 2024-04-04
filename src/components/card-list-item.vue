<template>
  <button
    :class="['f-card-list-item', 'f-btn-unstyled', { active: active }]"
    type="button"
    v-on="$listeners"
  >
    <f-icon-bin class="f-card-list-icon" :bin="item.card_number" />
    <div>
      <div :class="$style.number">{{ cardNumber }}</div>
      <div :class="$style['expiry-date']">
        <span v-text="$t('expires_on')" /> {{ item.expiry_date }}
      </div>
    </div>
    <div v-if="mode_test" :class="$style.marks">
      <f-svg
        v-if="approved"
        ref="approved"
        :class="$style.approved"
        name="check2"
        :size="24"
      />
      <f-svg
        v-if="declined"
        ref="declined"
        :class="$style.declined"
        name="xmark"
        :size="24"
      />
      <f-svg v-if="is3ds" :class="$style.ds3" name="3ds" :size="24" />
      <f-svg v-if="is2ds" :class="$style.ds2" name="2ds" :size="24" />
      <f-tooltip-default
        :boundary="$root"
        variant="secondary2"
        placement="top"
        :target="() => $refs.approved?.$el"
      >
        {{ $t('approved') }}
      </f-tooltip-default>
      <f-tooltip-default
        :boundary="$root"
        variant="secondary2"
        placement="top"
        :target="() => $refs.declined?.$el"
      >
        {{ $t('declined') }}
      </f-tooltip-default>
    </div>
  </button>
</template>

<script>
import FSvg from '@/components/svg'
import FIconBin from '@/components/icon-bin'
import { mapState } from '@/utils/store'
import { PROP_TYPE_OBJECT } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mask } from '@/utils/mask'
import FTooltipDefault from '@/components/tooltip/tooltip-default'

export default {
  components: {
    FSvg,
    FIconBin,
    FTooltipDefault,
  },
  props: {
    item: makeProp(PROP_TYPE_OBJECT),
  },
  computed: {
    ...mapState('params', ['card_number']),
    ...mapState(['mode_test']),
    active() {
      return this.item.card_number === this.card_number
    },
    cardNumber() {
      return mask(this.item.card_number, 'XXXX XXXX XXXX XXXX XXX')
    },
    approved() {
      return this.item.type === 'approved'
    },
    declined() {
      return this.item.type === 'declined'
    },
    is3ds() {
      return this.item.protocol === '3ds'
    },
    is2ds() {
      return this.item.protocol === '2ds'
    },
  },
}
</script>

<style lang="scss" module>
.number {
  margin-bottom: px-to-rem(4px);
  font-size: px-to-rem(16px);
  font-weight: 500;
  line-height: px-to-rem(20px);
  color: #3d3d3d;
}

.expiry-date {
  height: px-to-rem(16px);
  font-size: px-to-rem(12px);
  font-weight: 400;
  color: #818c99;
}

.marks {
  align-self: center;
  margin-left: auto;

  svg {
    margin-left: px-to-rem(8px);
  }
}
.approved {
  color: #08a835;
}

.declined {
  color: $error;
}

.ds3 {
  color: #313539;
}

.ds2 {
  color: #8f9395;
}
</style>
