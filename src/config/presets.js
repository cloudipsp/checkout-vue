function linearGradient(deg, colors, bg = '') {
  colors = colors.map(item => '#' + item + '%').join(',')
  return 'linear-gradient(' + deg + 'deg,' + colors + ') ' + bg
}

function createConfig(main, shadow, colors) {
  colors.push(main.slice(1) + ' 100')
  return {
    main,
    card_shadow: shadow,
    btn_success_gradient_custom: linearGradient(90, colors, main),
    btn_success_shadow: shadow,
  }
}

const card_black = {
  card_gradient_custom: linearGradient(180, [
    '606466 0',
    '444749 35',
    '181E22 100',
  ]),
  card_shadow: '#313539',
}

const btn_green = {
  btn_success_gradient_custom: linearGradient(
    90,
    ['2FD769 30', '1CB751 74'],
    '#1CB751'
  ),
  btn_success_shadow: '#30D769',
}

const card_gradient_white = linearGradient(180, ['FFF 0', 'F5F5F5 100'])

export default {
  reset: {
    main: '#000',
  },
  black: {
    main: '#444749',
    ...card_black,
    ...btn_green,
  },
  silver: {
    main: '#121517',
    card_shadow: '#5A6470',
    ...btn_green,
  },
  vibrant_silver: {
    main: '#121517',
    card_shadow: '#5A6470',
  },
  vibrant_gold: {
    main: '#121517',
    card_shadow: '#B98B3C',
  },
  solid_black: {
    main: '#121517',
    ...card_black,
  },
  black_and_white: {
    main: '#121517',
    card_gradient_custom: card_gradient_white,
    card_shadow_custom: '0px 1px 2px inset #DEE4EA',
    card_shadow: '#9CA7B3',
    card_input_color: '#3D3D3D',
    card_label_color: '#9C9C9C',
  },
  euphoric_pink: createConfig('#3E72C8', '#C95D9D', [
    'EF7656 0',
    'EA5D5E 33',
    'C95D9D 67',
  ]),
  heated_steel: createConfig('#576A9C', '#7B6399', [
    '7F8A9F 0',
    '938392 54',
    '7B6399 77',
  ]),
  nude_pink: createConfig('#4B629D', '#9F6A6E', [
    'F0AA2A 0',
    'B0735E 37',
    '805A8D 67',
  ]),
  tropical_gold: createConfig('#2B8D60', '#938737', ['B78529 30']),
  navy_shimmer: createConfig('#2049B2', '#2892C5', ['2AA8CA 35']),
}
