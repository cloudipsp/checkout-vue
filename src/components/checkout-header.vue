<template>
  <div class="f-header">
    <div class="pull-right">
      <select class="form-control input-sm">
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
  .f-header {
    height: 64px;
    padding: 16px;
  }
  .logo {
    height: 32px;
    width: 137px;
    background: url(../assets/logo.svg) no-repeat 50% 50%;
  }
</style>
