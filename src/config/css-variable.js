import presets from '@/config/presets'
import cssVariableDefault from '@/config/css-variable-default'
import cssVariableLight from '@/config/css-variable-light'
import cssVariableDark from '@/config/css-variable-dark'

export default function ({ type, preset }) {
  return Object.assign(
    {
      card_img: '',
    },
    cssVariableDefault,
    {
      light: cssVariableLight,
      dark: cssVariableDark,
    }[type],
    presets[preset] || { main: preset }
  )
}
