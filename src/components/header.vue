<template>
  <div class="f-header">
    <div class="f-header-menu">
      <dropdown
        v-if="false && show"
        class="f-visible-inline-block"
        tag="span"
        :append-to-body="false"
      >
        <a
          class="f-icon-flag"
          data-role="trigger"
          :style="styleFlag(params.lang)"
        ></a>
        <template slot="dropdown">
          <li v-for="item in options.locales" :key="item">
            <a @click="store.changeLocale(item)">
              <span class="f-icon-flag" :style="styleFlag(item)"></span>
              <span v-t="item"></span>
            </a>
          </li>
        </template>
      </dropdown>
      <select
        v-if="show"
        :value="params.lang"
        :class="[$css.fc, 'f-input-sm', 'f-visible-inline-block']"
        @input="store.changeLocale($event.target.value)"
      >
        <option
          v-for="item in options.locales"
          :key="item"
          v-t="item"
          :value="item"
        />
      </select>
      <button
        v-if="!min"
        v-t="'other'"
        type="button"
        :class="[
          $css.btn,
          $css.bd,
          $css.btnSm,
          'f-visible-mobile-inline-block',
        ]"
        @click="changeMethods"
      />
    </div>
    <div class="f-logo" :style="style" />
  </div>
</template>

<script>
import Dropdown from '@/components/dropdown'

export default {
  inject: ['$validator'],
  components: {
    Dropdown,
  },
  props: {
    min: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    style() {
      if (!this.options.logo_url) return {}
      return {
        'background-image': `url(${this.options.logo_url})`,
      }
    },
    show() {
      return this.options.langs && this.options.locales.length > 1
    },
    styleFlag() {
      return function(lang) {
        return {
          'background-image':
            'url(' + this.store.state.cdn + 'flags/' + lang + '.svg)',
        }
      }
    },
  },
  watch: {
    'state.showChangeMethods': function(show) {
      document.querySelector('#f').style.overflow = show ? 'hidden' : 'visible'
    },
  },
  methods: {
    changeMethods() {
      this.store.state.showChangeMethods = !this.store.state.showChangeMethods
    },
  },
}
</script>
