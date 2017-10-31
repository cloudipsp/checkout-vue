<template>
  <div>
    <component
      :is="method"
      :icons="options[method + 'Icons']"
      :payment-systems="options[method]"
    ></component>
    <regular v-if="options.regular && method === 'card'"></regular>
    <offer v-if="options.offer"></offer>
    <div class="f-block">
      <div class="f-block-sm">
        <button @click="onSubmit()" type="button" class="btn btn-success btn-block f-submit">
          Оплатить {{options.info.full_amount}} {{options.info.currency}}
        </button>
        <div class="hidden-md hidden-lg">
          <i class="f-icon f-icon-block security"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Card from '@/components/card'
  import Emoney from '@/components/emoney'
  import Ibank from '@/components/ibank'
  import Cash from '@/components/cash'
  import Sepa from '@/components/sepa'
  import Regular from './regular'
  import Offer from './offer'

  export default {
    props: ['method', 'options', 'onSubmit'],
    data () {
      return {}
    },
    components: {
      Card,
      Emoney,
      Ibank,
      Cash,
      Sepa,
      Regular,
      Offer
    },
    methods: {}
  }
</script>

<style lang="less">
  @import '../less/style.less';

  .f-submit{
    @media (max-width: @screen-xs-max) {
      font-size: 18px;
      padding: 20px 15px;
    }
  }
</style>
