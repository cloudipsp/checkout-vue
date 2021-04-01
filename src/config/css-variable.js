import presets from '@/config/presets'
import cssVariableLight from '@/config/css-variable-light'
import cssVariableDark from '@/config/css-variable-dark'
import { createConfig } from '@/utils/helpers'
import { btn, light, dark, color, bg } from '@/config/const'
import { white, black } from '@/config/color'

export default function ({ type, preset }) {
  return Object.assign(
    {
      card_img: '',
    },
    createConfig(
      [
        [btn, light, bg],
        [btn, light, color],
        [btn, dark, bg],
        [btn, dark, color],
      ],
      [white, black, black, white]
    ),
    {
      light: cssVariableLight,
      dark: cssVariableDark,
    }[type],
    presets[preset]
  )
}
