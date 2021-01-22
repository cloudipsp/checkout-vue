<template>
  <div id="f" :style="style" :class="className">
    <div v-if="show" class="f-container" :class="classNameContainer">
      <div v-if="isDemo" class="f-demo">
        <div class="f-demo-title" v-text="$t('demo-title')" />
      </div>
      <f-header />
      <payment />
    </div>
    <ul v-else-if="isError">
      <div>{{ COMMITHASH }} {{ BRANCH }}</div>
      <li v-for="item in error.errors" :key="item.message">
        {{ item.message }}
      </li>
    </ul>
    <f-modal-base
      v-else
      v-model="showModalError"
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <template #modal-title>
        <svg-decline />
        <h5 class="f-modal-title" v-text="$t(`${idError}_title`)" />
      </template>

      <p class="f-text-center" v-text="$t(`${idError}_text`)" />
    </f-modal-base>
  </div>
</template>

<script>
import Payment from '@/components/payment'
import FHeader from '@/components/header'
import { mapState } from '@/utils/store'
import Resize from '@/mixins/resize'
import Attr from '@/mixins/attr'
import { errorHandler } from '@/utils/helpers'
import configTheme from '@/config/theme'
import initFavicon from '@/store/favicon'
import { isExist } from '@/utils/typeof'

export default {
  components: {
    FHeader,
    Payment,
  },
  mixins: [Resize, Attr],
  props: {
    optionsUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      load: false,
      showModalError: false,
      idError: '',
      // eslint-disable-next-line no-undef
      COMMITHASH,
      // eslint-disable-next-line no-undef
      BRANCH,
      height: null,
    }
  },
  computed: {
    ...mapState(['isOnlyCard', 'error', 'cdnIcons']),
    ...mapState('options', [
      'show_menu_first',
      'full_screen',
      'disable_request',
    ]),
    ...mapState('options.theme', ['type']),
    ...mapState('router', ['page', 'method']),
    className() {
      return { 'f-embed': !this.full_screen }
    },
    classNameContainer() {
      return [
        {
          'f-only-card': this.isOnlyCard,
          'f-open': this.show_menu_first,
        },
        `f-page-${this.page}-${this.method}`,
        `f-theme-${this.type}`,
      ]
    },
    style() {
      return {
        height: this.height,
        // .f-sidebar transform: translateX(0);
        overflow:
          this.show_menu_first && (this.isBreakpointMd || !this.full_screen)
            ? 'hidden'
            : 'visible',
      }
    },
    show() {
      return !this.isError && this.load
    },
    isError() {
      return this.error.errors.length
    },
    isDemo() {
      return this.disable_request
    },
  },
  created() {
    this.initFavicon()

    Promise.all([
      this.store.loadButton(),
      this.store.loadCardImg(this.getPreset()),
    ])
      .finally(() => {
        this.store.setOptions(this.optionsUser)
        this.initHeight()
      })
      .then(() => {
        this.load = true
      })
      .catch(error => {
        this.idError = error.id
        this.showModalError = true
        return Promise.reject(error)
      })
      .catch(errorHandler)
  },
  methods: {
    initFavicon() {
      const userFullScreen = this.attr('optionsUser.options.full_screen')
      const full_screen = isExist(userFullScreen)
        ? userFullScreen
        : this.full_screen

      initFavicon(this.cdnIcons, full_screen)
    },
    initHeight() {
      this.height = this.full_screen ? window.innerHeight + 'px' : 'auto'
    },
    resize() {
      this.initHeight()
    },
    getPreset() {
      const userPreset = this.attr('optionsUser.options.theme.preset')
      const userTheme = this.attr('optionsUser.options.theme.type')

      if (userPreset) {
        return userPreset
      } else if (userTheme) {
        this.attr('optionsUser.options.theme.preset', configTheme[userTheme])
        return configTheme[userTheme]
      }
    },
  },
}
</script>
