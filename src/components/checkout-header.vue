<template>
  <div class="f-header">
    <div class="pull-right">
      <select class="form-control input-sm hidden-xs">
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="uk">Українською</option>
        <option value="lv">Latviešu</option>
        <option value="fr">Français</option>
        <option value="cs">Čeština</option>
        <option value="sk">Slovenský</option>
      </select>
    </div>
    <div class="logo"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="less">
  @import '../less/style.less';

  .f-header {
    padding: 15px 23px;

    @media (min-width: @screen-sm-min) {
      padding: 15px;
    }
  }
  .logo {
    height: 20px;
    width: 137px;
    background: url(../assets/logo.svg) no-repeat 0 50%;
    background-size: contain;

    @media (min-width: @screen-sm-min) {
      height: 32px;
    }
  }
</style>
