<template>
  <div class="f-card">
    <div class="f-block f-block-hr text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="form-group has-feedback" :class="{'has-error': errors.has('card_number')}">
          <label for="f-card_number">Номер карты</label>
          <div :class="{'input-group': cards.length}">
            <tooltip :text="errors.first('card_number')" :enable="errors.has('card_number')">
              <the-mask
                name="card_number"
                v-validate="validCardNumber"
                :value="card_number"
                @input="inputCardNumber"
                data-vv-as="Номер карты"
                type="text"
                class="form-control"
                id="f-card_number"
                :mask="maskCardNumber"
                maxlength="23"
                @blur.native="$validator.validate('card_number')"
              ></the-mask>
              <!--<div v-if="errors.has('card_number')" class="f-error">{{ errors.first('card_number') }}</div>-->
            </tooltip>
            <span v-if="!cards.length" class="form-control-feedback f-icon f-icon-contain card-empty"></span>
            <dropdown menu-right v-if="cards.length" class="input-group-btn">
              <button type="button" class="btn btn-default dropdown-toggle"><span class="caret"></span></button>
              <template slot="dropdown">
                <li v-for="card in cards"><a role="button" @click="setCardNumber(card)">{{ card.card_number }}</a></li>
              </template>
            </dropdown>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-7">
            <div class="form-group" :class="{'has-error': errors.has('expiry_date')}">
              <label for="f-expiry_date">Действительна до</label>
              <tooltip :text="errors.first('expiry_date')" :enable="errors.has('expiry_date')" placement="bottom">
                <the-mask
                  name="expiry_date"
                  v-validate="validExpiryDate"
                  v-model="form.expiry_date"
                  data-vv-as="Действительна до"
                  type="text"
                  class="form-control"
                  id="f-expiry_date"
                  placeholder="MM/YY"
                  :mask="maskExpiryDate"
                  :masked="true"
                  @blur.native="$validator.validate('expiry_date')"
                ></the-mask>
                <!--<div v-if="errors.has('expiry_date')" class="f-error">{{ errors.first('expiry_date') }}</div>-->
              </tooltip>
            </div>
          </div>
          <div class="col-xs-5">
            <div class="form-group has-feedback" :class="{'has-error': errors.has('cvv2')}">
              <label for="f-cvv2">CVV</label>
              <tooltip :text="errors.first('cvv2')" :enable="errors.has('cvv2')">
                <input
                  name="cvv2"
                  v-validate="validCvv"
                  v-model="form.cvv2"
                  data-vv-as="CVV"
                  type="tel"
                  class="form-control"
                  id="f-cvv2"
                  maxlength="3"
                >
                <!--<div v-if="errors.has('cvv2')" class="f-error">{{ errors.first('cvv2') }}</div>-->
              </tooltip>
              <tooltip text="3 цифры с оборотноой стороны карты" trigger="hover" theme="">
              <span class="form-control-feedback f-icon  question"></span>
              </tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
  export default {
    inject: ['$validator'],
    props: ['icons', 'form', 'cards'],
    data () {
      return {
        maskExpiryDate: '##/##',
        maskCardNumber: '#### ##XX XXXX ####',
        validCvv: 'required|digits:3',
        card_number: ''
      }
    },
    computed: {
      validExpiryDate: function () {
        let date = new Date()
        let year = String(date.getFullYear()).slice(-2)
        let month = ('0' + (date.getMonth() + 1)).slice(-2)
        return 'required|date_format:MM/YY|after:' + month + '/' + year + ',true'
      },
      validCardNumber: function () {
        return {
          rules: {
            required: true,
            credit_card: !/4444555566661111|4444111166665555|4444555511116666|4444111155556666|XXXXXX/.test(this.card_number)
          }
        }
      }
    },
    methods: {
      imagePath: function (id) {
        return require('../assets/img/' + id + '.svg')
      },
      setCardNumber: function (card) {
        this.card_number = card.card_number.replace(/ /g, '')
        this.form.expiry_date = card.expiry_date.replace(/ /g, '')
        this.form.hash = card.hash
        this.form.email = card.email
        this.form.cvv2 = ''
      },
      inputCardNumber: function (value) {
        this.card_number = value
        this.form.card_number = value
      }
    }
  }
</script>
