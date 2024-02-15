export const memoizePromise = fn => {
  const memoized = (...args) => {
    const key = JSON.stringify(args)
    const cache = memoized.cache

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn.apply(null, args).catch(error => {
      cache.delete(key)

      return Promise.reject(error)
    })
    cache.set(key, result)

    return result
  }

  memoized.cache = new Map()

  return memoized
}
