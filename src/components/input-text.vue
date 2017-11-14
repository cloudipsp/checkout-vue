<template>
  <div :class="{'has-error': errors.has(name)}">
    <label v-if="label" :for="name">{{ label }}</label>
    <tooltip :text="errors.first(name)" :enable="errors.has(name)">
      <input
        :name="name"
        v-validate="validate"
        v-model="form[field]"
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
  export default {
    inject: ['$validator'],
    props: ['form', 'name', 'field', 'label', 'validate'],
    data () {
      return {}
    }
  }
</script>
