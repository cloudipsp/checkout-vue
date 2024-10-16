import { loadCssVars } from '@/import'
import { loadStyle } from '@/utils/helpers'
import calculator from '@/utils/calculator'
import { hasCssVariableSupport } from '@/utils/env'

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

const prefix = `--${SAAS_TEMPLATE_NAME}-`

export default function (variablesLink) {
  let variables = Object.fromEntries(
    Object.entries(variablesLink).reduce((acc, [n, v]) => {
      let name = `${prefix}${n}`

      if (!/^[#&]/.test(v)) return acc.concat([[name, v]])

      v = v.replace('&', '')

      let nameh = `${name}-h`
      let names = `${name}-s`
      let namel = `${name}-l`
      let { h, s, l } = /#/.test(v)
        ? hexToHSL(v)
        : {
            h: `var(${prefix}${v}-h)`,
            s: `var(${prefix}${v}-s)`,
            l: `var(${prefix}${v}-l)`,
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

  variablesLink['btn_success_bg_lighten'] =
    getValueNumber('btn_success_bg-l') < 30
  variablesLink['card_bg_lighten'] = getValueNumber('card_bg-l') < 30

  let css =
    Object.entries(variables).reduce(
      (acc, [n, v]) => (acc += `${n}:${getValue(v)};`),
      hasCssVariableSupport ? '#f{' : ':root{'
    ) + '}'

  loadStyle(css)

  if (!hasCssVariableSupport) {
    loadCssVars().then(cssVars => {
      cssVars({
        include: 'link[href*="checkout.css"],style',
        onSuccess,
      })
    })
  }

  function onSuccess(cssText) {
    const reg = new RegExp(
      `calc\\((var\\(${prefix}[\\w-]+\\))[ ]?([+-/*])[ ]?([\\d.+-]+)([%]?)\\)`,
      'g'
    )
    return cssText.replace(reg, (match, ref, operation, y, yUnit) => {
      let [, x, xUnit] = /([\d\\.]+)([%]?)/.exec(getValue(ref))
      return calculator(operation, x, y).toFixed(1) + (xUnit || yUnit)
    })
  }

  function getValue(value) {
    const isVariableRef = /var\(--[\w-]+\)/
    const regexp = /var\((--[\w-]+)\)/g
    if (!isVariableRef.test(value)) return value
    return value.replace(regexp, (match, prop) =>
      isVariableRef.test(variables[prop])
        ? getValue(variables[prop])
        : variables[prop]
    )
  }

  function getValueNumber(value) {
    return Number(getValue(`var(${prefix}${value})`).replace('%', ''))
  }
}
