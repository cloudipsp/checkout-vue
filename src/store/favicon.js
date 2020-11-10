import configFavicon from '@/config/favicon'
import { setAttr } from '@/utils/dom'
import { getId } from '@/utils/helpers'

export default function (cdnIcons, full_screen) {
  if (!full_screen) return

  let fragment = document.createDocumentFragment()

  configFavicon.forEach(([rel, href, sizes, type, color]) => {
    href = `${cdnIcons}favicon/fondy/${href}`
    const id = getId(href)

    if (document.getElementById(id)) return

    let link = document.createElement('link')
    setAttr(link, 'id', id)
    setAttr(link, 'rel', rel)
    setAttr(link, 'href', href)
    if (sizes) {
      setAttr(link, 'sizes', sizes)
    }
    if (type) {
      setAttr(link, 'type', type)
    }
    if (color) {
      setAttr(link, 'color', color)
    }

    fragment.appendChild(link)
  })

  document.head.appendChild(fragment)
}
