import { loadAxios } from '@/import'
import presetGradient from '@/config/preset-gradient'
import { cdn } from '@/config/config'

export default function (preset) {
  if (!presetGradient.includes(preset)) return Promise.resolve()

  return loadAxios()
    .then(axios => axios.get(`${cdn}json/preset/${preset}.json`))
    .then(response => response.data)
    .then(
      card_img => ({
        css_variable: {
          card_img: `url(${card_img})`,
        },
      }),
      () => {}
    )
}
