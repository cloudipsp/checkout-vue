import { FEvent } from '@/utils/event.class'
import { defineProperties, readonlyDescriptor } from '@/utils/object'

export class FModalEvent extends FEvent {
  constructor(type, eventInit = {}) {
    super(type, eventInit)
    // Freeze our new props as readonly, but leave them enumerable
    defineProperties(this, {
      trigger: readonlyDescriptor(),
    })
  }

  static get Defaults() {
    return {
      ...super.Defaults,
      trigger: null,
    }
  }
}
