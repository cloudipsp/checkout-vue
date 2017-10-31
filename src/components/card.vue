<template>
  <div class="f-card">
    <div class="f-block f-block-hr text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group has-feedback" :class="{'has-error': errors.has('card_number') }">
          <label for="f-card_number">Номер карты</label>
          <input name="card_number" v-validate="'required|credit_card'" v-model="model.card_number"  type="text" class="form-control" id="f-card_number">
          <span class="form-control-feedback f-icon f-icon-contain card-empty"></span>
          <div v-if="false" class="input-group">
            <input type="text" class="form-control" id="x6">
            <span class="input-group-addon"><i class="glyphicon glyphicon-triangle-bottom"></i></span>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-xs-7" :class="{'has-error': errors.has('expiry_date') }">
            <label for="f-expiry_date">Действительна до</label>
            <input name="expiry_date" v-validate="'required|date_format:MM/YY'" v-model="model.expiry_date" type="text" class="form-control" id="f-expiry_date">
          </div>
          <div class="form-group col-xs-5" :class="{'has-error': errors.has('cvv2') }">
            <label for="f-cvv2">CVC</label>
            <input name="cvv2" v-validate="'required|digits:3'" v-model="model.cvv2" type="text" class="form-control" id="f-cvv2">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ValidateChild from './validate-child'

  export default {
    name: 'card',
    mixins: [ValidateChild],
    props: ['icons'],
    data () {
      return {
        model: {}
      }
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
