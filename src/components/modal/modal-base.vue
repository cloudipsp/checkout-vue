<template>
  <modal v-bind="attrs" v-on="$listeners">
    <slot v-for="slot in Object.keys($slots)" :slot="slot" :name="slot" />
    <template
      v-for="slot in Object.keys($scopedSlots)"
      :slot="slot"
      slot-scope="scope"
    >
      <slot :name="slot" v-bind="scope" />
    </template>
  </modal>
</template>

<script>
import Modal from './helpers/modal'

export default {
  components: {
    Modal,
  },
  inheritAttrs: false,
  model: {
    prop: 'visible',
    event: 'change',
  },
  computed: {
    attrs() {
      return {
        centered: true,
        hideFooter: true,
        static: true,
        titleClass: 'f-title',
        ...this.$attrs,
      }
    },
  },
}
</script>
