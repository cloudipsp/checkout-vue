<template>
  <f-modal :value="value" size="md" :backdrop="false" @input="toggle">
    <template #title>
      <div class="f-text-danger">
        {{ $t('submit3ds_title') }}
      </div>
    </template>
    <span v-t="'submit3ds_text'" />
    <template #footer>
      <button
        type="button"
        :class="[css.btn, 'f-btn-link']"
        @click="toggle(false)"
      >
        <span v-t="'back'" />
      </button>
      <button type="button" :class="[css.btn, css.bs]" @click="submit">
        <span v-t="'submit3ds_submit'" />
      </button>
      <div
        v-t="{ path: 'submit3ds_wait', args: [duration] }"
        class="f-text-muted"
      />
    </template>
  </f-modal>
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      timeout: null,
    }
  },
  computed: {
    ...mapState(['css']),
  },
  watch: {
    value(v) {
      clearTimeout(this.timeout)
      if (v) {
        this.wait()
      }
    },
  },
  methods: {
    submit() {
      this.toggle(false)
      this.$emit('submit3ds')
    },
    toggle(show) {
      this.$emit('input', show)
    },
    wait() {
      if (!this.duration) return this.submit()
      this.timeout = setTimeout(() => {
        this.$emit('update:duration', this.duration - 1)
        this.wait()
      }, 1000)
    },
  },
}
</script>
