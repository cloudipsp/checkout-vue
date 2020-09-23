import axios from 'axios'
import presetGradient from '@/config/preset-gradient'
import optionsDefault from '@/config/options-default'

export default function(preset) {
  if (!presetGradient.includes(preset)) return Promise.reject()

  return axios
    .get(`${optionsDefault.cdnIcons}json/preset/${preset}.json`)
    .then(response => response.data)
}
