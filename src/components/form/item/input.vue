<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <form-input
      ref="input"
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      v-on="$listeners"
      @keyup.enter="onEnter"
    />
  </ValidationProvider>
</template>

<script>
import item from '@/mixins/item'
import mask from '@/mixins/mask'
import FormInput from './helpers/form-input'

export default {
  components: {
    FormInput,
  },
  mixins: [item, mask],
}
</script>
