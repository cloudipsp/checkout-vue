<template>
  <div>
    <div class="f-block-hr f-title f-hidden-mobile">Методы оплаты</div>
    <div class="f-block f-title3 f-visible-mobile">Выберите способ оплаты</div>
    <div class="f-menu f-block-hr">
      <transition-group>
        <div
          class="f-item"
          v-if="item in config"
          :class="['f-i-' + item, {active: router.method === item}]"
          v-for="item in options.methods"
          :key="item"
          @click="changeMethod(item)"
        >
          {{ config[item].name }}
        </div>
      </transition-group>
    </div>
    <div class="f-block-hr f-title f-hidden-mobile">Быстрый доступ к методам оплаты:</div>
    <div class="f-block f-title3 f-visible-mobile">Быстрый доступ к методам оплаты:</div>
    <div class="f-block f-fast-access">
      <div
        class="f-icon"
        v-if="item.system !== router.system"
        v-for="item in options.fast"
        :key="item.system"
        :class="'f-i-' + item.system"
        @click="changeMethod(item.method, item.system )"
      ></div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    props: ['onChangeMethod'],
    data () {
      return {
        options: store.state.options,
        router: store.state.router,
        config: {
          card: {
            name: 'Оплата картой'
          },
          emoney: {
            name: 'Электроные деньги'
          },
          ibank: {
            name: 'Интернет–банки'
          },
          cash: {
            name: 'Наличные'
          },
          sepa: {
            name: 'Международные платежи'
          }
        }
      }
    },
    methods: {
      changeMethod: function (method, system) {
//        console.log(method, system)
        this.router.page = 'payment-method'
        this.router.method = method
        this.router.system = system
        this.onChangeMethod()
      }
    }
  }
</script>
