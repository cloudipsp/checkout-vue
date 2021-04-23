<template>
  <f-modal-base v-bind="attrs" v-on="$listeners" @show="run" @hide="hide">
    <template #modal-title>
      <span v-text="$t('submit3ds_title')" />
    </template>
    <span v-text="$t('submit3ds_text')" />
    <template #modal-footer="{ ok }">
      <f-button
        ref="submit"
        variant="secondary"
        text="submit3ds_submit"
        @click="submit(ok)"
      />
      <div class="f-w-100" />
      <div v-text="$t('submit3ds_wait', [duration])" />
    </template>
  </f-modal-base>
</template>

<script>
import FButton from '@/components/button/button'
import timeout from '@/mixins/timeout'

export default {
  components: {
    FButton,
  },
  mixins: [timeout],
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    duration: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    attrs() {
      return {
        hideFooter: false,
        ...this.$attrs,
      }
    },
  },
  methods: {
    hide() {
      this.clearTimeout('tick')
    },
    submit(cb) {
      this.$emit('submit3ds')
      cb()
    },
    run() {
      if (!this.duration) return this.$refs.submit.$el.click()

      this.timeout('tick', 1000)
    },
    tick() {
      this.$emit('update:duration', this.duration - 1)
      this.run()
    },
  },
}
</script>
