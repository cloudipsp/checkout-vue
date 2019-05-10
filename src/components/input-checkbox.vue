<template>
  <div :class="['f-form-group', hasError ? $css.he : '']">
    <input
      :id="name_"
      v-model="value_"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      type="checkbox"
      class="f-checkbox"
    />
    <label :class="[$css.cl]" :for="name_"><slot /></label>
    <tooltip
      :text="errors.first(name_)"
      :enable="hasError"
      :target="'#' + name_"
    />
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
}
</script>
