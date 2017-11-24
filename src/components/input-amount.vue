<template>
  <div :class="['f-form-group', {'f-has-error': errors.has(name)}]">
    <label v-if="label" :for="name">{{ label }}</label>
    <div class="f-input-group">
      <tooltip :text="errors.first(name)" :enable="errors.has(name)">
        <input
          :name="name"
          v-validate="'required|decimal:2'"
          v-model="amount"
          data-vv-validate-on="blur"
          :data-vv-as="label"
          type="text"
          class="f-form-control"
          :id="name"
        >
      </tooltip>
      <span class="f-input-group-addon">{{ state.form.currency }}</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    props: ['form', 'name', 'onInput', 'field', 'label'],
    data () {
      return {
        state: store.state,
        field_: this.field || this.name,
        form_: this.form || store.state.form
      }
    },
    computed: {
      amount: {
        get: function () {
          let amount = parseInt(this.form_[this.field_])
          return amount ? amount / 100 : ''
        },
        set: function (v) {
          if (v.slice(-1) === '.') {
            return false
          }
          this.form_[this.field_] = Math.round(parseFloat(v).toFixed(2) * 100) || 0
          this.$validator.validate(this.name, v)
          if (this.onInput) {
            this.onInput(v, this.field_)
          }
        }
      }
    },
    components: {
      Tooltip
    }
  }
</script>
