import presets from './presets'
import light from './css-varisble-light'
import dark from './css-varisble-dark'

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
