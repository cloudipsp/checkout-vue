<template>
  <div class="f-form-group">
    <input
      :id="id"
      class="f-switch"
      type="checkbox"
      :checked="value"
      @change="input"
    />
    <label v-t="label" :class="[css.cl, 'f-switch-label']" :for="id" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import id from '@/mixins/id'

export default {
  mixins: [id],
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState(['css']),
  },
  methods: {
    input($event) {
      this.$emit('input', $event.target.checked)
    },
  },
}
</script>
