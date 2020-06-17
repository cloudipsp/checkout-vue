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
      @focus="focus"
      @blur="blur"
    />
    <label :class="[css.cl]" :for="name_"><slot /></label>
    <transition name="slide-fade">
      <div v-if="!tooltip && hasError && focused" class="f-error">
        {{ errors.first(name_) }}
      </div>
    </transition>
  </div>
</template>

<script>
import Input from '@/mixins/input'

export default {
  mixins: [Input],
}
</script>
