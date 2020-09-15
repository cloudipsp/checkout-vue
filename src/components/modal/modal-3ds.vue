<template>
  <f-modal-base v-bind="attrs" v-on="$listeners" @show="run" @hide="hide">
    <template #modal-title>
      {{ $t('submit3ds_title') }}
    </template>
    <span v-t="'submit3ds_text'" />
    <template #modal-footer="{ ok, cancel }">
      <f-button
        ref="submit"
        variant="secondary"
        text="submit3ds_submit"
        @click="submit(ok)"
      />
      <div class="f-w-100" />
      <div v-t="{ path: 'submit3ds_wait', args: [duration] }" />
    </template>
  </f-modal-base>
</template>

<script>
import { mapState } from '@/utils/store'
import timeout from '@/mixins/timeout'

export default {
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
    ...mapState(['css']),
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
