<template>
  <div :class="['f-form-group', hasError ? $css.he : '']">
    <label :class="[$css.cl, hasError ? $css.le : '']" :for="name_">{{
      label_
    }}</label>
    <div :class="[$css.ig, classReadonly]">
      <input
        :id="name_"
        v-model="amount"
        v-validate="'required|decimal:2'"
        :data-vv-as="label_"
        :data-vv-name="name_"
        type="tel"
        :class="[$css.fc, $css.igi, hasError ? $css.ie : '', classReadonly]"
        :placeholder="placeholder_"
        :readonly="readonly"
        :disabled="readonly"
        inputmode="numeric"
        @keyup.enter="onEnter"
      />
      <div v-if="!options.tooltip && hasError" class="f-error">
        {{ errors.first(name_) }}
      </div>
      <span v-t="store.state.params.currency" :class="$css.iga" />
    </div>
    <f-tooltip
      v-if="options.tooltip"
      :text="errors.first(name_)"
      :enable="hasError"
      :placement="placement"
      :target="'#' + name_"
    />
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
  data() {
    return {}
  },
  computed: {
    amount: {
      get: function() {
        let amount = parseInt(this.params[this.field_])
        return amount ? amount / 100 : ''
      },
      set: function(v) {
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
