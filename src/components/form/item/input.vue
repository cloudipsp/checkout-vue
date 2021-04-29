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
    <slot />
  </ValidationProvider>
</template>

<script>
import { itemMixin } from '@/mixins/item'
import { maskMixin } from '@/mixins/mask'
import FormInput from '@/components/form/item/helpers/form-input'
import { removeAddEventListenerMixin } from '@/mixins/remove-add-event-listener'

export default {
  components: {
    FormInput,
  },
  mixins: [itemMixin, maskMixin, removeAddEventListenerMixin],
}
</script>
