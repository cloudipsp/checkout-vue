<template>
  <div class="f-card">
    <div class="f-block f-block-hr f-text-center">
      <img class="f-card-icon" v-for="icon in icons" :src="imagePath(icon)">
    </div>
    <div class="f-block">
      <div class="f-block-sm">
        <div class="f-form-group f-feedback" :class="{'f-has-error': errors.has('card_number')}">
          <label for="f-card_number">Номер карты</label>
          <div :class="{'f-input-group': cards.length}">
            <tooltip :text="errors.first('card_number')" :enable="errors.has('card_number')">
              <the-mask
                name="card_number"
                v-validate="validCardNumber"
                v-model="form.card_number"
                data-vv-as="Номер карты"
                type="text"
                class="f-form-control"
                id="f-card_number"
                :mask="maskCardNumber"
                maxlength="23"
                @blur.native="$validator.validate('card_number')"
              ></the-mask>
            </tooltip>
            <span v-if="!cards.length" class="f-form-control-feedback f-icon f-icon-contain f-i-card-empty"></span>
            <dropdown menu-right v-if="cards.length" class="f-input-group-btn">
              <button type="button" class="f-btn f-btn-default f-dropdown-toggle"><span class="f-caret"></span></button>
              <template slot="dropdown">
                <li v-for="card in cards"><a role="button" @click="setCardNumber(card)">{{ card.card_number }}</a></li>
              </template>
            </dropdown>
          </div>
        </div>
        <div class="f-row">
          <div class="f-col-xs-7">
            <div class="f-form-group" :class="{'f-has-error': errors.has('expiry_date')}">
              <label for="f-expiry_date">Действительна до</label>
              <tooltip :text="errors.first('expiry_date')" :enable="errors.has('expiry_date')" placement="bottom">
                <the-mask
                  name="expiry_date"
                  v-validate="validExpiryDate"
                  v-model="form.expiry_date"
                  data-vv-as="Действительна до"
                  type="text"
                  class="f-form-control"
                  id="f-expiry_date"
                  placeholder="MM/YY"
                  :mask="maskExpiryDate"
                  :masked="true"
                  @blur.native="$validator.validate('expiry_date')"
                ></the-mask>
              </tooltip>
            </div>
          </div>
          <div class="f-col-xs-5">
            <div class="f-form-group f-feedback" :class="{'f-has-error': errors.has('cvv2')}">
              <label for="f-cvv2">CVV</label>
              <tooltip :text="errors.first('cvv2')" :enable="errors.has('cvv2')">
                <input
                  name="cvv2"
                  v-validate="validCvv"
                  v-model="form.cvv2"
                  data-vv-as="CVV"
                  type="tel"
                  class="f-form-control"
                  id="f-cvv2"
                  maxlength="3"
                >
              </tooltip>
              <tooltip text="3 цифры с оборотноой стороны карты" trigger="hover" theme="">
              <span class="f-form-control-feedback f-icon  f-i-question"></span>
              </tooltip>
            </div>
          </div>
        </div>
        <input-text v-if="options.email" name="email" label="Email" validate="required|email"></input-text>
      </div>
    </div>
  </div>
</template>

<script>
//  ['#### ### ### ###', ' #### ###### #####', '#### #### #### ####', '  ######## ##########']
  import store from '@/store'
  import { sendRequest } from '@/utils/helpers'
  import Tooltip from '@/components/tooltip'
  import Dropdown from '@/components/dropdown'
  import InputText from '@/components/input-text'

  export default {
    inject: ['$validator'],
    props: ['icons', 'cards'],
    data () {
      return {
        form: store.state.form,
        options: store.state.options,
        maskExpiryDate: '##/##',
        maskCardNumber: '#### ##XX XXXX ####',
        validCvv: 'required|digits:3'
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
            credit_card: !/4444555566661111|4444111166665555|4444555511116666|4444111155556666|XXXXXX/.test(this.form.card_number)
          }
        }
      }
    },
    watch: {
      'form.card_number': function (newVal, oldVal) {
        let newFirst = newVal && newVal[0]
        let oldFirst = oldVal && oldVal[0]
        let newBin = newVal && newVal.slice(0, 6)
        let oldBin = oldVal && oldVal.slice(0, 6)
        if (newFirst && newFirst !== oldFirst) {
          sendRequest('api.checkout.card_type_fee', 'get', { first_card_digit: newFirst }, String(newFirst)).then(
            function (model) {},
            function (model) {})
        }
        if (newBin.length === 6 && newBin !== oldBin) {
          sendRequest('api.checkout.card_bin', 'get', { card_bin: newBin }, String(newBin)).then(
            function (model) {},
            function (model) {})
        }
      }
    },
    methods: {
      imagePath: function (id) {
        return require('../assets/img/' + id + '.svg')
      },
      setCardNumber: function (card) {
        this.form.card_number = card.card_number.replace(/ /g, '')
        this.form.expiry_date = card.expiry_date.replace(/ /g, '')
        this.form.email = card.email
        this.form.hash = card.hash
        this.form.cvv2 = ''
      }
    },
    components: {
      Tooltip,
      Dropdown,
      InputText
    }
  }
</script>
