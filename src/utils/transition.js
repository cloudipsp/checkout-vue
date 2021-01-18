import Vue, { mergeData } from 'bootstrap-vue/esm/vue'
import BVTransition from 'bootstrap-vue/esm/utils/bv-transition'
import { isPlainObject } from 'bootstrap-vue/esm/utils/inspect'

const NO_FADE_PROPS = {
  name: '',
  enterClass: '',
  enterActiveClass: '',
  enterToClass: 'f-show',
  leaveClass: 'f-show',
  leaveActiveClass: '',
  leaveToClass: '',
}

const FADE_PROPS = {
  ...NO_FADE_PROPS,
  enterActiveClass: 'f-fade',
  leaveActiveClass: 'f-fade',
}

export default Vue.extend({
  extends: BVTransition,
  render(h, { children, data, props }) {
    let transProps = props.transProps
    if (!isPlainObject(transProps)) {
      transProps = props.noFade ? NO_FADE_PROPS : FADE_PROPS
      if (props.appear) {
        // Default the appear classes to equal the enter classes
        transProps = {
          ...transProps,
          appear: true,
          appearClass: transProps.enterClass,
          appearActiveClass: transProps.enterActiveClass,
          appearToClass: transProps.enterToClass,
        }
      }
    }
    transProps = {
      mode: props.mode,
      ...transProps,
      // We always need `css` true
      css: true,
    }
    return h(
      'transition',
      // Any transition event listeners will get merged here
      mergeData(data, { props: transProps }),
      children
    )
  },
})
