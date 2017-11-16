<template>
  <div>
    <div class="f-block-hr f-title hidden-xs">Методы оплаты</div>
    <div class="f-block f-title3 visible-xs">Выберите способ оплаты</div>
    <div class="f-menu f-block-hr">
      <transition-group>
        <router-link
          class="f-item"
          v-if="item in config"
          :class="[item]"
          v-for="item in options.methods"
          :key="item"
          :to="{ name: 'payment-method', params: { method: item }}"
          @click.native="onChangeMethod()"
        >
          {{ config[item].name }}
        </router-link>
      </transition-group>
    </div>
    <div class="f-block-hr f-title hidden-xs">Быстрый доступ к методам оплаты:</div>
    <div class="f-block f-fast-access">
      <router-link
        class="f-icon"
        v-if="item.system !== $route.params.system"
        v-for="item in options.fast"
        :key="item.system"
        :class="item.system"
        :to="{ name: 'payment-method', params: { method: item.method, system: item.system }}"
        @click.native="onChangeMethod()"
      ></router-link>
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
    }
  }
</script>
