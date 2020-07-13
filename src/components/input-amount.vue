<template>
  <div :class="classGroupName">
    <input
      :id="name_"
      v-model="amount"
      v-validate="'required|decimal:2'"
      :data-vv-as="label_"
      :data-vv-name="name_"
      type="tel"
      :class="className"
      :placeholder="placeholder_"
      :readonly="readonly"
      :disabled="readonly"
      inputmode="numeric"
      @keyup.enter="onEnter"
      @focus="focus"
      @blur="blur"
    />
    <label :class="classLabel" :for="name_">{{ label_ }}</label>
    <span v-t="currency" class="f-form-group-currency" />
    <transition name="slide-fade">
      <div v-if="showError" class="f-error">
        {{ errors.first(name_) }}
      </div>
    </transition>
  </div>
</template>

<script>
import Input from '@/mixins/input'
import { mapState } from '@/utils/store'

export default {
  mixins: [Input],
  computed: {
    ...mapState('params', ['currency']),
    amount: {
      get() {
        let amount = parseInt(this.params[this.field_])
        return amount ? amount / 100 : ''
      },
      set(v) {
        if (v.slice(-1) === '.') {
          return false
        }
        this.params[this.field_] =
          Math.round(parseFloat(v).toFixed(2) * 100) || 0
        this.$validator.validate(this.name_, v)
      },
    },
  },
}
</script>
