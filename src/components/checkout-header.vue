<template>
  <div class="f-header">
    <div class="f-header-menu">
      <select :class="[css.fc, 'f-input-sm', 'f-hidden-mobile']">
        <option value="ru">Русский</option>
        <option value="en">English</option>
        <option value="uk">Українською</option>
        <option value="lv">Latviešu</option>
        <option value="fr">Français</option>
        <option value="cs">Čeština</option>
        <option value="sk">Slovenský</option>
      </select>
    </div>
    <div class="f-logo"></div>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    data () {
      return {
        css: store.state.css
      }
    }
  }
</script>
