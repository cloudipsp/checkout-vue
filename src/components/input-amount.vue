<template>
  <div :class="['f-form-group', hasError ? css.he : '']">
    <label :class="[css.cl, hasError ? css.le : '']" :for="name_">{{ label_ }}</label>
    <div :class="css.ig">
      <input
        v-validate="'required|decimal:2'"
        v-model="amount"
        data-vv-validate-on="blur"
        :data-vv-as="label_"
        :data-vv-name="name_"
        type="tel"
        :class="[css.fc, css.igi, hasError ? css.ie : '']"
        :id="name_"
        :placeholder="placeholder_"
        inputmode="numeric"
        @keyup.enter="onEnter"
      >
      <div v-if="!options.tooltip && hasError" class="f-error">{{ errors.first(name_) }}</div>
      <span :class="css.iga" v-t="state.form.currency"></span>
    </div>
    <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="hasError" :placement="placement" :target="'#'+name_"></tooltip>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    props: {
      onInput: Function
    },
    data () {
      return {
        state: store.state,
      }
    },
    computed: {
      amount: {
        get: function () {
          let amount = parseInt(this.form[this.field_])
          return amount ? amount / 100 : ''
        },
        set: function (v) {
          if (v.slice(-1) === '.') {
            return false
          }
          this.form[this.field_] = Math.round(parseFloat(v).toFixed(2) * 100) || 0
          this.$validator.validate(this.name_, v)
          if (this.onInput) {
            this.onInput(v, this.field_)
          }
        }
      }
    }
  }
</script>
