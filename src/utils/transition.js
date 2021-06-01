import { mergeData } from 'vue-functional-data-merge'
import { isPlainObject } from '@/utils/inspect'
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

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

// @vue/component
export const Transition = {
  functional: true,
  props: {
    // Has no effect if `trans-props` provided
    appear: makeProp(PROP_TYPE_BOOLEAN, false),
    // Can be overridden by user supplied `trans-props`
    mode: makeProp(PROP_TYPE_STRING),
    // Only applicable to the built in transition
    // Has no effect if `trans-props` provided
    noFade: makeProp(PROP_TYPE_BOOLEAN, false),
    // For user supplied transitions (if needed)
    transProps: makeProp(PROP_TYPE_OBJECT),
  },
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
}
