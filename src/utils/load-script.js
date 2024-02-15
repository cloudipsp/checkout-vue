import { getById, setAttr } from '@/utils/dom'

export const loadScript = src => {
  const id = src.replace(/\W/g, '_')
  const loadEl = getById(id)

  if (loadEl) return loadEl._promise_

  const el = document.createElement('script')
  setAttr(el, 'id', id)
  setAttr(el, 'type', 'text/javascript')
  setAttr(el, 'src', src)
  const promise = new Promise(function (resolve, reject) {
    el.addEventListener('load', () => {
      resolve(src)
    })
    el.addEventListener('error', () => {
      el.remove()
      reject()
    })
    document.head.appendChild(el)
  })
  el._promise_ = promise

  return promise
}
