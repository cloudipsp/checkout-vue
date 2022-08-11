<template>
  <f-alert-base v-bind="attrs" v-on="fListeners">
    <div class="f-row">
      <div class="f-alert-storage-content f-col-12 f-col-md f-mb-16 f-mb-md-0">
        <slot />
      </div>
      <div class="f-alert-storage-buttons f-col-12 f-col-md-auto">
        <f-button-link
          variant="secondary"
          @click="close"
          v-text="$t('not_now')"
        />
        <f-button variant="secondary" text="accept" @click="ok" />
      </div>
    </div>
  </f-alert-base>
</template>

<script>
import FAlertBase from '@/components/alert/alert-base'
import FButtonLink from '@/components/button/button-link'
import FButton from '@/components/button/button'

import { localStorage, sessionStorage } from '@/utils/store'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_STRING } from '@/constants/props'

export default {
  components: {
    FAlertBase,
    FButtonLink,
    FButton,
  },
  mixins: [attrsMixin, listenersMixin],
  props: {
    name: makeProp(PROP_TYPE_STRING),
  },
  data() {
    return {
      show: true,
    }
  },
  computed: {
    attrs() {
      return {
        show: this.show,
        class: 'f-alert-storage',
        ...this.fAttrs,
      }
    },
  },
  methods: {
    close() {
      sessionStorage.set(this.name, 1)
      this.show = false
    },
    ok() {
      localStorage.set(this.name, 1)
      this.show = false
      this.$emit('ok')
    },
  },
}
</script>
