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
      custom-class="f-tooltip-icons"
      placement="topleft"
      :target="() => $refs.last"
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
import { PROP_TYPE_STRING, PROP_TYPE_NUMBER } from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'

export default {
  components: {
    FIcon,
    FTooltipDefault,
  },
  props: {
    title: makeProp(PROP_TYPE_STRING),
    type: makeProp(PROP_TYPE_STRING, 'card', value =>
      arrayIncludes(configMethods, value)
    ),
    count: makeProp(PROP_TYPE_NUMBER, 3),
  },
  computed: {
    ...mapState(['options']),
    showTitle() {
      return this.title
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
}
</script>
