<template>
  <div class="f-button">
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group">
          <button @click="onSubmit()" type="button" class="btn btn-success btn-block" :disabled="!valid"><slot></slot></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['valid', 'onSubmit'],
    data () {
      return {}
    }
  }
</script>

<style lang="less">

</style>
