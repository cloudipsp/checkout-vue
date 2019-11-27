<template>
  <div v-if="show" class="f-icons">
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
