<template>
  <div class="f-card">
    <div class="f-block f-block-hr text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group has-feedback" :class="{'has-error': errors.has('card_number')}">
          <label for="f-card_number">Номер карты</label>
          <tooltip :text="errors.first('card_number')" :enable="errors.has('card_number')">
          <the-mask
            name="card_number"
            v-validate="'required|credit_card'"
            v-model="form.card_number"
            data-vv-as="Номер карты"
            type="tel"
            class="form-control"
            id="f-card_number"
            :mask="['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']"
            maxlength="23"
          ></the-mask>
          <!--<div v-if="errors.has('card_number')" class="f-error">{{ errors.first('card_number') }}</div>-->
          </tooltip>
          <span class="form-control-feedback f-icon f-icon-contain card-empty"></span>
          <!--<div v-if="false" class="input-group">-->
            <!--<input type="text" class="form-control" id="x6">-->
            <!--<span class="input-group-addon"><i class="glyphicon glyphicon-triangle-bottom"></i></span>-->
          <!--</div>-->
        </div>
        <div class="row">
          <div class="form-group col-xs-7" :class="{'has-error': errors.has('expiry_date')}">
            <label for="f-expiry_date">Действительна до</label>
            <tooltip :text="errors.first('expiry_date')" :enable="errors.has('expiry_date')" placement="bottom">
            <the-mask
              name="expiry_date"
              v-validate="'required|date_format:MM/YY|after:after_field_target,true'"
              v-model="form.expiry_date"
              data-vv-as="Действительна до"
              type="text"
              class="form-control"
              id="f-expiry_date"
              placeholder="MM/YY"
              mask="##/##"
              :masked="true"
            ></the-mask>
            <!--<div v-if="errors.has('expiry_date')" class="f-error">{{ errors.first('expiry_date') }}</div>-->
            </tooltip>
            <input
              name="after_field_target"
              :data-vv-as="getMinExpiry"
              type="hidden"
              value="11/17">
          </div>
          <div class="form-group col-xs-5" :class="{'has-error': errors.has('cvv2')}">
            <label for="f-cvv2">CVV</label>
            <tooltip :text="errors.first('cvv2')" :enable="errors.has('cvv2')">
            <input
              name="cvv2"
              v-validate="'required|digits:3'"
              v-model="form.cvv2"
              data-vv-as="CVV"
              type="tel"
              class="form-control"
              id="f-cvv2"
              maxlength="3"
            >
            <!--<div v-if="errors.has('cvv2')" class="f-error">{{ errors.first('cvv2') }}</div>-->
            </tooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    inject: ['$validator'],
    props: ['icons', 'form'],
    data () {
      return {}
    },
    computed: {
      getMinExpiry: function () {
        return '10/17'
      }
    },
    methods: {
      imagePath: function (id) {
        return require('../assets/img/' + id + '.svg')
      }
    }
  }
</script>

<style lang="less">
  .f-card-icon{
    margin: 0 3px;
  }
</style>
