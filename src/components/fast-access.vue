<template>
  <div v-if="show" class="f-fast-access">
    <div v-t="'fast'" class="f-block-hr f-title f-hidden-mobile" />
    <div v-t="'fast'" class="f-block f-title3 f-visible-mobile" />
    <div class="f-block f-block-hr">
      <div
        v-for="item in list"
        :key="item.system"
        class="f-icon"
        :class="'f-i-' + item.system"
        :style="style(item.system)"
        @click="$emit('on-change-method', item.method, item.system)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    show: function() {
      return this.list.length
    },
    list: function() {
      return this.options.fast.filter(
        item => item.system !== this.router.system
      )
    },
    style: function() {
      return function(item) {
        return {
          'background-image':
            'url(' + this.store.state.cdn + 'banks/' + item + '.svg)',
        }
      }
    },
  },
}
</script>
