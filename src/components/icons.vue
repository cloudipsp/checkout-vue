<template>
  <div v-if="show" class="f-icons">
    <span v-if="showTitle" class="f-icons-title" v-text="$t(title)" />
    <f-icon
      v-for="item in listFirst"
      :key="item"
      size="sm"
      :name="item"
      :type="type"
    />
    <a
      v-if="showCount"
      ref="last"
      href="#"
      class="f-icons-count"
      @click.prevent
    >
      +{{ countLast }}
    </a>
    <f-tooltip-default
      ref="tooltip"
      custom-class="f-tooltip-icons"
      placement="topleft"
      :target="() => $refs.last"
      :under-sticky="underSticky"
    >
      <f-icon
        v-for="item in listLast"
        :key="item"
        size="sm"
        :name="item"
        :type="type"
      />
    </f-tooltip-default>
  </div>
</template>

<script>
import FIcon from '@/components/icon'
import FTooltipDefault from '@/components/tooltip/tooltip-default'
import { mapState } from '@/utils/store'
import configMethods from '@/config/methods.json'

export default {
  components: {
    FIcon,
    FTooltipDefault,
  },
  props: {
    position: {
      type: String,
      required: true,
      validator: value => ['sidebar', 'center'].includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'card',
      validator: value => configMethods.includes(value),
    },
    count: {
      type: Number,
      default: 3,
    },
    underSticky: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['options', 'isOnlyCard']),
    showTitle() {
      return this.position === 'center'
    },
    list() {
      return this.options[this.type + '_icons'] || []
    },
    listFirst() {
      if (this.list.length <= this.count + 1) return this.list
      return this.list.slice(0, this.count)
    },
    listLast() {
      return this.list.slice(this.count)
    },
    show() {
      return this.list.length
    },
    showCount() {
      return this.list.length > this.count + 1
    },
    countLast() {
      return this.list.length - this.count
    },
  },
  methods: {
    close() {
      this.$refs.tooltip && this.$refs.tooltip.close()
    },
  },
}
</script>
