<template>
  <f-modal-base v-bind="attrs" v-on="$listeners" @show="run" @hide="hide">
    <template #title>
      <span v-text="$t('submit3ds_title')" />
    </template>
    <span v-text="$t('submit3ds_text')" />
    <template #footer="{ ok }">
      <f-button
        ref="submit"
        variant="secondary"
        :text="$t('submit3ds_submit')"
        @click="submit(ok)"
      />
      <div class="f-w-100" />
      <div v-text="$t('submit3ds_wait', [duration])" />
    </template>
  </f-modal-base>
</template>

<script>
import FButton from '@/components/button/button'
import { timeoutMixin } from '@/mixins/timeout'
import { PROP_TYPE_NUMBER } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  components: {
    FButton,
  },
  mixins: [timeoutMixin],
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    duration: makeProp(PROP_TYPE_NUMBER, 0),
  },
  computed: {
    attrs() {
      return {
        noFooter: false,
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
