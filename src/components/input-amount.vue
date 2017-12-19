<template>
  <div :class="['f-form-group', errors.has(name_) ? css.he : '']">
    <label :class="[css.cl, errors.has(name_) ? css.le : '']" :for="name_">{{ label_ }}</label>
    <div :class="css.ig">
      <input
        v-validate="'required|decimal:2'"
        v-model="amount"
        data-vv-validate-on="blur"
        :data-vv-as="label_"
        :data-vv-name="name_"
        type="text"
        :class="[css.fc, css.igi, errors.has(name_) ? css.ie : '']"
        :id="name_"
      >
      <div v-if="!options.tooltip && errors.has(name_) && $validator.flags[name_].touched" class="f-error">{{ errors.first(name_) }}</div>
      <span :class="css.iga">{{ state.form.currency }}</span>
    </div>
    <tooltip v-if="options.tooltip" :text="errors.first(name_)" :enable="errors.has(name_) && $validator.flags[name_].touched" :placement="placement" :target="'#'+name_"></tooltip>
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
