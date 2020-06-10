<template>
  <div :class="classGroupName">
    <input
      :id="name_"
      v-model="value_"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      type="checkbox"
      class="f-checkbox"
    />
    <label :class="[css.cl]" :for="name_"><slot /></label>
    <f-tooltip
      v-if="tooltip"
      :text="errors.first(name_)"
      :enable="hasError"
      :placement="placement"
      :target="'#' + name_"
    />
    <div v-if="!tooltip && hasError" class="f-error">
      {{ errors.first(name_) }}
    </div>
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
}
</script>
