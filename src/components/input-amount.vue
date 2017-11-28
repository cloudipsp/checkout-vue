<template>
  <div :class="['f-form-group', {'f-has-error': errors.has(name_)}]">
    <label v-if="label" :for="name_">{{ label }}</label>
    <div class="f-input-group">
      <tooltip :text="errors.first(name_)" :enable="errors.has(name_)">
        <input
          :name="name_"
          v-validate="'required|decimal:2'"
          v-model="amount"
          data-vv-validate-on="blur"
          :data-vv-as="label"
          type="text"
          class="f-form-control"
          :id="name_"
        >
      </tooltip>
      <span class="f-input-group-addon">{{ state.form.currency }}</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
    inject: ['$validator'],
    props: {
      onInput: Function
    },
    data () {
      return {
        state: store.state
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
