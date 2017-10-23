<template>
  <div class="f-card">
    <div class="f-block f-block-hr text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group">
          <label for="x6">Номер карты</label>
          <div class="input-group">
            <input type="text" class="form-control" id="x6">
            <span class="input-group-addon"><i class="glyphicon glyphicon-triangle-bottom"></i></span>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-xs-7">
            <label for="x7">Действительна до</label>
            <input type="text" class="form-control" id="x7">
          </div>
          <div class="form-group col-xs-5">
            <label for="x8">CVC</label>
            <input type="text" class="form-control" id="x8">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['icons'],
    data () {
      return {}
    },
    methods: {
      imagePath: function (id) {
        return require('../assets/' + id + '.svg')
      }
    }
  }
</script>

<style lang="less">
  .f-card-icon{
    margin: 0 3px;
  }
</style>
