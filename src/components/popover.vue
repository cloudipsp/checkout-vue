<!--v0.31.5-->
<script>
import { TRIGGERS } from '@/utils/dom'
import Popup from '@/mixins/popup'

export default {
  mixins: [Popup],
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    trigger: {
      type: String,
      default: TRIGGERS.OUTSIDE_CLICK,
    },
    placement: {
      type: String,
      default: 'right',
    },
    transitionDuration: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      name: 'f-popover',
    }
  },

  computed: {
    allContent() {
      return this.title + this.content
    },
  },
  methods: {
    isNotEmpty() {
      return this.title || this.content || this.$slots.popover
    },
  },
  render(h) {
    return h(this.tag, [
      this.$slots.default,
      h(
        'div',
        {
          style: {
            display: 'block',
          },
          ref: 'popup',
          on: {
            mouseleave: this.hideOnLeave,
          },
        },
        [
          h('div', { class: 'arrow' }),
          h(
            'h3',
            {
              class: 'f-popover-title',
              directives: [{ name: 'show', value: this.title }],
            },
            this.title
          ),
          h(
            'div',
            {
              class: 'f-popover-content',
              domProps: {
                innerHTML: this.content,
              },
            },
            [this.content || this.$slots.popover]
          ),
        ]
      ),
    ])
  },
}
</script>
