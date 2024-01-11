import { PROP_TYPE_ANY } from '@/constants/props'
import { isObject, isUndefined } from '@/utils/inspect'

// Generates a prop object
export const makeProp = (
  type = PROP_TYPE_ANY,
  value = undefined,
  requiredOrValidator = undefined,
  validator = undefined
) => {
  const required = requiredOrValidator === true
  validator = required ? validator : requiredOrValidator

  return {
    ...(type ? { type } : {}),
    ...(required
      ? { required }
      : isUndefined(value)
        ? {}
        : { default: isObject(value) ? () => value : value }),
    ...(isUndefined(validator) ? {} : { validator }),
  }
}
