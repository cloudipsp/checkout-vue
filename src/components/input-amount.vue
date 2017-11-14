<template>
  <div :class="{'has-error': errors.has(name)}">
    <label v-if="label" :for="name">{{ label }}</label>
    <div class="input-group">
      <tooltip :text="errors.first(name)" :enable="errors.has(name)">
        <input
          :name="name"
          v-validate="'required|decimal:2'"
          v-model="amount"
          data-vv-validate-on="blur"
          :data-vv-as="label"
          type="text"
          class="form-control"
          :id="name"
        >
      </tooltip>
      <span class="input-group-addon">{{ state.form.currency }}</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    inject: ['$validator'],
    props: ['form', 'name', 'onInput', 'field', 'label'],
    data () {
      return {
        state: store.state
      }
    },
    computed: {
      amount: {
        get: function () {
          let amount = parseInt(this.form[this.field])
          return amount ? amount / 100 : ''
        },
        set: function (v) {
          if (v.slice(-1) === '.') {
            return false
          }
          this.form[this.field] = Math.round(parseFloat(v).toFixed(2) * 100) || 0
          this.$validator.validate(this.name, v)
          if (this.onInput) {
            this.onInput(v, this.field)
          }
        }
      }
    }
  }
</script>
