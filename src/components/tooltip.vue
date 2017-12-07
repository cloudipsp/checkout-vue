<script>
  import {TRIGGERS} from '@/utils/dom'
  import Popup from '@/mixins/popup'

  export default {
    mixins: [Popup],
    data () {
      return {
        name: 'f-tooltip'
      }
    },
    render (h) {
      return h(
        this.tag,
        [
          this.$slots.default,
          h('div',
            {
              ref: 'popup',
              attrs: {
                role: 'tooltip',
                'data-theme': this.theme
              },
              on: {
                mouseenter: this.showOnHover,
                mouseleave: this.hideOnLeave
              }
            },
            [
              h('div', {'class': 'f-tooltip-arrow'}),
              h('div', {
                'class': 'f-tooltip-inner',
                domProps: {innerHTML: this.text}
              })
            ]
          )
        ]
      )
    },
    props: {
      theme: {
        type: String,
        default: 'error'
      },
      text: {
        type: String,
        default: ''
      },
      trigger: {
        type: String,
        default: TRIGGERS.FOCUS
      },
      placement: {
        type: String,
        default: 'right'
      },
//      appendTo: {
//        type: String,
//        default: '#f'
//      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    },
    computed: {
      allContent () {
        return this.text
      }
    },
    watch: {
      enable (v) {
        if (v && this.triggerEl.matches(':hover, :focus')) {
          this.show()
        }
      }
    },
    methods: {
      isNotEmpty () {
        return this.text
      }
    }
  }
</script>
