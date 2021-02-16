import presets from '@/config/presets'
import light from '@/config/css-variable-light'
import dark from '@/config/css-variable-dark'

export default function ({ type, preset }) {
  return Object.assign(
    {
      card_img: '',
    },
    {
      light,
      dark,
    }[type],
    presets[preset]
  )
}
