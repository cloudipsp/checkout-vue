<template>
  <div v-if="show" class="f-icons">
    <span v-if="title" class="f-icons-title">Or pay with card</span>
    <img
      v-for="icon in list"
      :key="icon"
      class="f-icons-item"
      :src="path(icon)"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    show() {
      return this.list.length
    },
    path() {
      return function(id) {
        return require('../assets/img/' + id + '.svg')
      }
    },
  },
}
</script>
