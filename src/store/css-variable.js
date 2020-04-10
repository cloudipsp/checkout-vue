import { fromEntries } from '@/utils/helpers'
import cssVars from 'css-vars-ponyfill'

function hexToHSL(H) {
  // Convert hex to RGB first
  let r = 0,
    g = 0,
    b = 0
  if (H.length === 4) {
    r = '0x' + H[1] + H[1]
    g = '0x' + H[2] + H[2]
    b = '0x' + H[3] + H[3]
  } else if (H.length === 7) {
    r = '0x' + H[1] + H[2]
    g = '0x' + H[3] + H[4]
    b = '0x' + H[5] + H[6]
  }
  // Then to HSL
  r /= 255
  g /= 255
  b /= 255
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0) h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)
  s = s + '%'
  l = l + '%'

  return { h, s, l }
}

export default function(variables) {
  variables = fromEntries(
    Object.entries(variables).reduce((acc, [n, v]) => {
      let name = `--fondy-${n}`
      let nameh = `${name}-h`
      let names = `${name}-s`
      let namel = `${name}-l`
      let { h, s, l } = /#/.test(v)
        ? hexToHSL(v)
        : {
            h: `var(--fondy-${v}-h)`,
            s: `var(--fondy-${v}-s)`,
            l: `var(--fondy-${v}-l)`,
          }

      let value = `hsl(${h},${s},${l})`

      return acc.concat([
        [name, value],
        [nameh, h],
        [names, s],
        [namel, l],
      ])
    }, [])
  )
  console.log(variables)
  cssVars({
    include: 'link[href*="checkout.css"],style',
    variables,
    onComplete: (cssText, styleNodes, cssVariables, benchmark) => {
      console.log(1, cssText, styleNodes, cssVariables, benchmark)
    },
  })
}
