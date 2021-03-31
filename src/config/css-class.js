import light from '@/config/css-class-light'
import dark from '@/config/css-class-dark'

export default function (type) {
  return Object.assign(
    {
      light,
      dark,
    }[type]
  )
}
