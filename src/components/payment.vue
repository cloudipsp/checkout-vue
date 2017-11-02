<template>
  <div class="f-wrapper">
    <div v-if="!isMin" class="f-mobile-menu visible-xs">
      <button class="btn btn-default btn-sm" @click="show = !show"><i class="glyphicon glyphicon-th-large"></i>
        Другие способы
      </button>
    </div>
    <div class="f-info" ref="info">
      <info :info="options.info"></info>
    </div>
    <div v-if="!isMin" class="f-methods" :class="{open : show}">
      <methods :methods="options.methods" :fast="fast" :on-change-method="changeMethod"></methods>
    </div>
    <div class="f-center" ref="center">
      <fields v-if="options.fields" :form="form"></fields>
      <router-view :options="options" :on-submit="submit" :form="form" :valid="!this.errors.items.length"></router-view>
      <div v-if="loading">
        <div class="f-loading"></div>
        <div class="f-loading-i"></div>
      </div>
      <popover :title="errorTitle" trigger="manual" v-model="error">
        <div class="f-center-error"></div>
        <div slot="popover">
          {{ errorMessage }}
        </div>
      </popover>
    </div>
  </div>
</template>

<script>
  import Info from './info'
  import Methods from './methods'
  import Fields from './payment-fields'
  import Verify from './verify'

  export default {
    props: ['options2', 'onSetMin'],
    data () {
      return {
        options: this.options2,
        loading: false,
        show: false,
        form: {
          recurring_data: {}
        },
        error: false,
        errorFlag: false,
        errorTitle: 'Ошибка #2013',
        errorMessage: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах на берегу Семантика большого языкового океана. Маленький ручеек Даль жур.',
        timeoutId: 0
      }
    },
    watch: {
      options: {
        handler: function () {
          this.firstResize()
        },
        deep: true,
        immediate: true
      },
      '$route': 'firstResize'
    },
    mounted: function () {
      window.addEventListener('resize', this.resize)
    },
    beforeDestroy: function () {
      window.removeEventListener('resize', this.resize)
    },
    computed: {
      fast: function () {
        let fast = []
        this.options.fast.forEach(function (system) {
          ['emoney', 'ibank', 'cash'].forEach(function (method) {
            if (this.options[method].indexOf(system) > -1) {
              fast.push({
                method: method,
                system: system
              })
            }
          }, this)
        }, this)
        return fast
      },
      isMin: function () {
        let result = this.options.methods.length === 1 && this.options.methods[0] === 'card'
        this.onSetMin(result)
        return result
      }
    },
    components: {
      Info,
      Methods,
      Fields,
      Verify
    },
    $_veeValidate: {
      validator: 'new'
    },
    methods: {
      submit: function () {
        this.$validator.validateAll()
        this.autoFocus()
        console.log('errors', this.errors.items)
        console.log('fields', this.fields)
        console.log('form', this.form)
//      this.errors.clear()

        this.$nextTick(function () {
          if (!this.errors.items.length && !this.loading) {
            this.loading = true
            this.error = false
            setTimeout(() => {
              if (Math.random() >= 0.5) {
                this.error = true
              } else {
                this.$router.push({name: 'verify'})
              }
              this.loading = false
            }, 1000)
          }
        })
      },
      autoFocus: function () {
        if (this.errors.items.length) {
          let $firstErrorField = this.$el.querySelector('[data-vv-id=' + this.$validator.errors.items[0].id + ']')
          $firstErrorField.scrollIntoView()
          $firstErrorField.focus()
        }
      },
      changeMethod: function () {
        this.show = false
      },
      resize () {
        let width = document.body.clientWidth

        this.$refs.center.style.minHeight = 'auto'
        let wraperH = this.$el.offsetHeight
        let centerH = this.$refs.center.offsetHeight
        let infoH = this.$refs.info.offsetHeight

        if (width >= 992) {
          this.$refs.center.style.minHeight = centerH < wraperH ? wraperH + 'px' : 'auto'
        } else if (width >= 768 && !this.isMin) {
          this.$refs.center.style.minHeight = centerH < wraperH - infoH ? wraperH - infoH + 'px' : 'auto'
        }

        this.resizeError()
      },
      resizeError: function () {
        if (this.error) {
          this.errorFlag = this.error
        }
        this.error = false
        if (this.timeoutId > 0) {
          clearTimeout(this.timeoutId)
          this.timeoutId = 0
        }
        this.timeoutId = setTimeout(() => {
          this.error = this.errorFlag
          this.errorFlag = false
        }, 150)
      },
      firstResize: function () {
        setTimeout(() => {
          this.resize()
        })
      }
    }
  }
</script>

<style lang="less">
  @import '../less/style.less';

  @f-sm-width: 33%;
  @f-md-width: 26%;
  @f-min-width: 35%;

  .f-wrapper {
    background-color: #FCFEFF;
    &:extend(.clearfix all);

    @media (min-width: @screen-sm-min) {
      .f-min & {
        height: auto;
      }
      height: calc(~'100% - 62px');
    }
    @media (min-width: @screen-md-min) {
      height: auto;
      border: 1px solid #E0E8EF;
      border-radius: 8px;
      box-shadow: 0 16px 16px 0 rgba(0, 0, 0, 0.04);
    }
  }

  .f-mobile-menu {
    position: absolute;
    top: 8px;
    right: 23px;

  }

  .f-center-error{
    position: absolute;
    top: 0;
    right: 30px;
    bottom: 0;
    left: 30px;
    z-index: -1;
  }

  .f-info,
  .f-methods,
  .f-center {
    position: relative;
    min-height: 1px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .f-info { // col-md-3 col-md-push-9
    color: #A9A9A9;

    border-top: 2px solid #EAF1F6;
    border-bottom: 2px solid #EAF1F6;

    @media (min-width: @screen-sm-min) {
      border-top: none;
      border-bottom: 2px solid #E0E8EF;
      box-shadow: inset 0 -10px 40px -8px rgba(72, 133, 149, 0.24);
    }
    @media (min-width: @screen-md-min) {
      .f-min & {
        width: @f-min-width;
        left: 100% - @f-min-width;
      }

      float: left;
      width: @f-md-width; // col-md-3
      left: 100% - @f-md-width; // col-md-push-9
      border: none;
      box-shadow: none;
    }

    @media (max-width: @screen-sm-max) {
      .f-block-hr {
        border: none;
      }
    }
  }

  .f-methods { // col-sm-4 col-md-3 col-md-pull-3
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    background-color: #fff;
    padding: 0;
    overflow-y: auto;

    transition: transform .3s cubic-bezier(.25, .8, .25, 1);
    transform: translate3d(-100%, 0, 0);

    &.open {
      transform: translate3d(0, 0, 0);
    }

    @media (min-width: @screen-sm-min) {
      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      background: none;
      padding-left: 15px;
      padding-right: 15px;
      transform: translate3d(0, 0, 0);

      float: left;
      width: @f-sm-width; // col-sm-4
    }
    @media (min-width: @screen-md-min) {
      width: @f-md-width; // col-md-3
      right: @f-md-width; // col-md-pull-3
    }

    @media (max-width: @screen-xs-max) {
      .f-block-hr {
        border: none;
      }
    }
  }

  .f-center { // col-sm-8 col-md-6 col-md-pull-3
    .f-min & {

    }
    background: #fff;

    @media (min-width: @screen-sm-min) {
      .f-min & {
        width: 100%;
        border-left: none;
      }

      float: left;
      width: 100% - @f-sm-width; // col-sm-8
      border-left: 2px solid rgba(61, 61, 61, 0.06);
    }
    @media (min-width: @screen-md-min) {
      .f-min & {
        width: 100% - @f-min-width;
        right: @f-min-width;
        border-radius: 8px 0 0 8px;
      }

      width: 100% - @f-md-width*2; // col-md-6
      right: @f-md-width; // col-md-pull-3
      border-right: 2px solid rgba(61, 61, 61, 0.06);
    }
  }
</style>
