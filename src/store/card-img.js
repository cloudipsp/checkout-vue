import { presetsWithGradient } from '@/config/presets-with-gradient'

export default function (preset) {
  if (!presetsWithGradient.includes(preset)) return Promise.resolve()
  const url = `${PUBLIC_PATH}presets/${preset}.jpeg`

  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = url
    img.onload = () =>
      resolve({
        css_variable: {
          card_img: `url(${url})`,
        },
      })
    img.onerror = () => resolve()
  })
}
