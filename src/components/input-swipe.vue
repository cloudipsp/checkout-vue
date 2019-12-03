<template>
  <div>
    <input
      :id="id"
      class="f-checkbox-swipe"
      type="checkbox"
      :value="value"
      @input="input"
    />
    <label v-t="label" :class="[css.cl]" :for="id" />
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
    },
  },
  data() {
    return {
      id: null,
    }
  },
  computed: {
    ...mapState(['css']),
  },
  mounted() {
    this.id = this._uid
  },
  methods: {
    input($event) {
      this.$emit('input', $event.target.checked)
    },
  },
}
</script>
