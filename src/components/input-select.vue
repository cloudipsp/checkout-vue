<template>
  <div :class="classGroupName">
    <select
      :id="name_"
      v-model="params[field_]"
      v-validate="validate"
      :data-vv-as="label_"
      :data-vv-name="name_"
      :class="className"
      :readonly="readonly"
      :disabled="readonly"
      :autocomplete="autocomplete"
      @input="input"
      @focus="focus"
      @blur="blur"
    >
      <option
        v-for="item in list"
        :key="item.id || item"
        v-t="item.name || item"
        :value="item.id || item"
      />
    </select>
    <label :class="classLabel" :for="name_">{{ label_ }}</label>
    <div v-if="!tooltip && hasError" class="f-error">
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
