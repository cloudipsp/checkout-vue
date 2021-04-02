import configFavicon from '@/config/favicon'
import { setAttr } from '@/utils/dom'
import { cdn } from '@/config/config'

export default function () {
  let fragment = document.createDocumentFragment()

  configFavicon.forEach(([rel, href, sizes, type, color]) => {
    href = `${cdn}favicon/fondy/${href}`
    const id = href.replace(/\W/g, '_')

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
