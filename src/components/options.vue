<template>
  <div class="f-options">
    <div>
      <button class="btn btn-default" @click="toggle()">{{ btnText }}</button>
      <slot></slot>
    </div>
    <div v-show="show">
      <div v-if="error" class="text-danger">json is not valid</div>
      <textarea
        ref="textarea"
        class="form-control"
        @input="updateValue($event.target.value)"
      ></textarea>
    </div>
  </div>

</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      error: false,
      show: false
    }
  },
  mounted: function () {
    this.$refs.textarea.value = JSON.stringify(this.value, null, 2)
  },
  computed: {
    btnText: function () {
      return this.show ? 'hide' : 'show'
    }
  },
  methods: {
    toggle: function () {
      this.show = !this.show
    },
    updateValue: function (value) {
      try {
        this.$emit('input', JSON.parse(value))
        this.error = false
      } catch (e) {
        this.error = true
      }
    }
  }
}
</script>

<style lang="less">
.f-options{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;

  textarea{
    height: 500px;
    width: 320px;
  }
}
</style>
