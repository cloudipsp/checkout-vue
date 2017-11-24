<script>
  import {TRIGGERS} from '@/utils/dom'
  import Popup from '@/mixins/popup'

  export default {
    mixins: [Popup],
    data () {
      return {
        name: 'f-popover'
      }
    },
    render (h) {
      return h(this.tag,
        [
          this.$slots.default,
          h('div',
            {
              style: {
                display: 'block'
              },
              ref: 'popup',
              on: {
                mouseenter: this.showOnHover,
                mouseleave: this.hideOnLeave
              }
            },
            [
              h('div', {'class': 'arrow'}),
              h('h3', {
                'class': 'f-popover-title',
                directives: [
                  {name: 'show', value: this.title}
                ]
              }, this.title),
              h('div', {'class': 'f-popover-content'}, [this.content || this.$slots.popover])
            ]
          )
        ]
      )
    },
    props: {
      title: {
        type: String,
        default: ''
      },
      content: {
        type: String,
        default: ''
      },
      trigger: {
        type: String,
        default: TRIGGERS.OUTSIDE_CLICK
      },
      placement: {
        type: String,
        default: 'right'
      },
      appendTo: {
        type: String,
        default: '#f'
      },
      transitionDuration: {
        type: Number,
        default: 0
      }
    },
    computed: {
      allContent () {
        return this.title + this.content
      }
    },
    watch: {
      allContent (value, oldValue) {
        // reset position while content changed & is shown
        // nextTick is required
        if (value && value !== oldValue) {
          this.$nextTick(() => {
            if (this.isShown()) {
              this.resetPosition()
            }
          })
        }
      }
    },
    methods: {
      isNotEmpty () {
        return this.title || this.content || this.$slots.popover
      }
    }
  }
</script>
