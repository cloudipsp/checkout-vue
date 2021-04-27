import { isArray, isPlainObject } from '@/utils/inspect'
import { keys } from '@/utils/object'

export const cloneDeep = (obj, defaultValue = obj) => {
  if (isArray(obj)) {
    return obj.reduce((result, val) => [...result, cloneDeep(val, val)], [])
  }
  if (isPlainObject(obj)) {
    return keys(obj).reduce(
      (result, key) => ({ ...result, [key]: cloneDeep(obj[key], obj[key]) }),
      {}
    )
  }
  return defaultValue
}
