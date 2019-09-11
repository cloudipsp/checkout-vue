import masker from '@/utils/masker'

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
function event(name) {
  let evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  return evt
}

function input(ev) {
  let el = ev.target
  if (!ev.isTrusted) return // avoid infinite loop
  /* other properties to try to diferentiate InputEvent of Event (custom)
  InputEvent (native)
    cancelable: false
    isTrusted: true

    composed: true
    isComposing: false
    which: 0

  Event (custom)
    cancelable: true
    isTrusted: false
  */
  // by default, keep cursor at same position as before the mask
  let position = el.selectionEnd
  // save the character just inserted
  let digit = el.value[position - 1]
  el.value = masker(el.value, el.mask, true)
  // if the digit was changed, increment position until find the digit again
  while (
    position < el.value.length &&
    el.value.charAt(position - 1) !== digit
  ) {
    position++
  }
  if (el === document.activeElement) {
    el.setSelectionRange(position, position)
    clearTimeout(el.timeout)
    el.timeout = setTimeout(function() {
      el.setSelectionRange(position, position)
    }, 0)
  }
  el.dispatchEvent(event('input'))
}

export default {
  bind(el, binding) {
    el.mask = binding.value
    el.addEventListener('input', input)

    el.dispatchEvent(event('input'))
  },
  update(el, binding) {
    let newDisplay = masker(el.value, binding.value, true)
    if (newDisplay !== el.value) {
      el.value = newDisplay
      el.dispatchEvent(event('input'))
    }
  },
  unbind(el) {
    el.removeEventListener('input', input)
  },
}
