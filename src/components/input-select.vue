<template>
  <div :class="['f-form-group', hasError ? $css.he : '']">
    <label
      v-t="label_"
      :class="[$css.cl, hasError ? $css.le : '']"
      :for="name_"
      >{{ label_ }}</label
    >
    <select
      :id="name_"
      v-model="params[field_]"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :class="[$css.fc, hasError ? $css.ie : '', classReadonly]"
      :readonly="readonly"
      :disabled="readonly"
      @input="input"
    >
      <option
        v-for="item in list"
        :key="item.id || item"
        v-t="item.name || item"
        :value="item.id || item"
      />
    </select>
    <tooltip
      v-if="options.tooltip"
      :text="errors.first(name_)"
      :enable="hasError"
      :placement="placement"
      :target="'#' + name_"
    />
    <div v-if="!options.tooltip && hasError" class="f-error">
      {{ errors.first(name_) }}
    </div>
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    input($event) {
      this.$emit('input', $event.target.value)
    },
  },
}
</script>
