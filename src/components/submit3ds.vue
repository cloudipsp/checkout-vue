<template>
  <modal :value="value" size="md" :backdrop="false" @input="toggle">
    <div slot="title" class="f-text-danger">
      {{ $t('submit3ds_title') }}
    </div>
    <span v-t="'submit3ds_text'" />
    <div slot="footer">
      <button
        type="button"
        :class="[$css.btn, 'f-btn-link']"
        @click="toggle(false)"
      >
        <span v-t="'back'" />
      </button>
      <button type="button" :class="[$css.btn, $css.bs]" @click="submit">
        <span v-t="'submit3ds_submit'" />
      </button>
      <div
        v-t="{ path: 'submit3ds_wait', args: [duration] }"
        class="f-text-muted"
      />
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/modal'

export default {
  components: {
    Modal,
  },
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
  watch: {
    value(v) {
      clearTimeout(this.timeout)
      if (v) {
        this.wait()
      }
    },
  },
  methods: {
    submit: function() {
      this.toggle(false)
      this.$emit('submit3ds')
    },
    toggle: function(show) {
      this.$emit('input', show)
    },
    wait: function() {
      if (!this.duration) return this.submit()
      this.timeout = setTimeout(() => {
        this.$emit('update:duration', this.duration - 1)
        this.wait()
      }, 1000)
    },
  },
}
</script>
