<template>
  <ValidationProvider ref="validation" v-bind="attrsValidation">
    <form-input
      ref="input"
      v-model="innerValue"
      :class="classInput"
      v-bind="attrs"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @keyup.enter="onEnter"
    />
  </ValidationProvider>
</template>

<script>
import item from '@/mixins/item'
import mask from '@/mixins/mask'
import FormInput from './helpers/form-input'
import remove_add_event_listener from '@/mixins/remove_add_event_listener'

export default {
  components: {
    FormInput,
  },
  mixins: [item, mask, remove_add_event_listener],
}
</script>
