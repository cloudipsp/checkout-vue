<script>
  import { Tooltip } from 'uiv'

  export default {
    extends: Tooltip,
    render (h) {
      return h(
        this.tag,
        [
          this.$slots.default,
          h('div',
            {
              ref: 'tooltip',
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
              h('div', {'class': 'tooltip-arrow'}),
              h('div', {
                'class': 'tooltip-inner',
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
      trigger: {
        type: String,
        default: 'focus'
      },
      placement: {
        type: String,
        default: 'right'
      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    },
    watch: {
      enable (v) {
        if (v && this.handleAuto()) {
          this.show()
        }
        if (!v) {
          this.hide()
        }
      }
    }
  }
</script>
