<template>
  <div v-if="show" class="f-icons">
    <span v-if="title" class="f-icons-title">{{ title }}</span>
    <f-icon
      v-for="item in listFirst"
      :key="item"
      size="sm"
      :name="item"
      :type="type"
    />
    <div v-if="showCount" class="f-icons-count">+{{ countLast }}</div>
  </div>
</template>

<script>
import { mapState } from '@/utils/store'
import configMethods from '@/config/methods'

export default {
  props: {
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
  },
  computed: {
    ...mapState(['options']),
    list() {
      return this.options[this.type + '_icons'] || []
    },
    listFirst() {
      return this.list.slice(0, this.count)
    },
    listLast() {
      return this.list.slice(this.count)
    },
    show() {
      return this.list.length
    },
    showCount() {
      return this.list.length > this.count
    },
    countLast() {
      return this.list.length - this.count
    },
  },
}
</script>
