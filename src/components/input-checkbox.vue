<template>
  <div :class="['f-form-group', hasError ? $css.he : '']">
    <input
      v-model="params[field_]"
      v-validate="validate"

      :data-vv-as="label_"
      :data-vv-name="name_"
      type="checkbox"
      class="f-checkbox"
      :id="name_"
    />
    <label :class="[$css.cl]" :for="name_"><slot></slot></label>
    <tooltip :text="errors.first(name_)" :enable="hasError" :target="'#'+name_"></tooltip>
  </div>
</template>

<script>
  import Input from '@/mixins/input'

  export default {
    mixins: [Input],
  }
</script>
