import { isBoolean, isString } from '@/utils/typeof'
import configSubscription from '@/config/subscription'

export const getType = (isSubscription, state) => {
  let type

  if (!isSubscription) return 'disable'

  if (isBoolean(state)) {
    type = state ? 'shown_edit_on' : 'shown_edit_off'
  } else if (isString(state) && state in configSubscription) {
    type = state
  } else {
    type = 'shown_readonly'
  }

  return type
}
