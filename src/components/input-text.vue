<template>
  <div :class="['form-group', {'has-error': errors.has(name)}]">
    <label v-if="label" :for="name">{{ label }}</label>
    <tooltip :text="errors.first(name)" :enable="errors.has(name)">
      <input
        :name="name"
        v-validate="validate"
        v-model="form_[field_]"
        :data-vv-as="label"
        type="text"
        class="form-control"
        :id="name"
      >
    </tooltip>
    <div v-if="false && errors.has(name)" class="f-error">{{ errors.first(name) }}</div>
  </div>
</template>

<script>
  import store from '@/store'
  import Tooltip from '@/components/tooltip'

  export default {
    inject: ['$validator'],
    props: ['form', 'name', 'field', 'label', 'validate'],
    data () {
      return {
        field_: this.field || this.name,
        form_: this.form || store.state.form
      }
    },
    components: {
      Tooltip
    }
  }
</script>
