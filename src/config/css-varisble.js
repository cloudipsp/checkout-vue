// const ash_50 = '#FBFBFC' // 212 14 99
// const ash_100 = '#F7F8F9' // 212 14 97
const ash_200 = '#F2F3F5' // 212 13 95
const ash_300 = '#EEF0F2' // 212 13 94
const ash_400 = '#E5E8EB' // 212 13 91
const ash_500 = '#D5DAE0' // 212 14 97
const ash_600 = '#C8CED5' // 212 13 81
const ash_700 = '#BAC1CA' // 212 13 76
// const ash_800 = '#A9B2BD' // 212 13 70

const grey_1 = '#9CA7B3' // 212 13 66
const grey_2 = '#818C99' // 212 11 55
// const grey_3 = '#5A6470' // 212 11 40
// const grey_4 = '#484F57' // 212 9  31
const grey_9 = '#313539' // 212 8  21

const black = '#3D3D3D' // 0 0 24
const white = '#ffffff' // 0 0 100

const theme = {
  green: '#4ed962', // 129 65 58
  steel_blue: '#6493DE',
  light_sky_blue: '#5DABE3',
  dark_cyan: '#549B94',
  light_coral: '#EC6B34',
}

const main = theme.green

export default {
  main_bg: ash_400,
  container_color: grey_2,
  container_bg: white,
  container_border: main,
  container_box_shadow: ash_600,
  sidebar_border: ash_400,
  menu_item_color: 'container_color',
  menu_item_active_color: black,
  menu_item_active_bg: ash_200,
  menu_item_border: ash_400,
  menu_icon_color: ash_500,
  menu_icon_active_color: 'menu_item_active_color',
  menu_icons_shadow: '#cacfd6',
  merchant_name_color: ash_700,
  order_desc_color: 'container_color',
  amount_color: black,
  currency_color: grey_1,
  card_shadow: grey_9,
  card_bg: '#444749',
  card_label_color: white,
  card_input_color: white,
  card_input_shadow: '#000000',
  card_border: '#5B5F66',
  enable_btn_success_gradient: true,
  btn_success_color: white,
  btn_success_bg: main,
  btn_success_shadow: main,
  btn_disabled_color: ash_700,
  btn_disabled_bg: ash_300,
  input_bg: white,
  input_color: black,
  input_border: ash_500,
  input_hover_border: ash_700,
  input_focus_border: grey_2,
  input_error_color: '#DE4761',
  input_error_border: '#DE4761',
  label_color: grey_1,
  label_hover_color: grey_2,
  label_focus_color: grey_2,
  link_color: main,
  // card_bg:
  // success: '#62ba46',
  // btn_success: 'success',
  // btn_success_bg: 'btn_success',
  // btn_success_border: 'bn_success',
  // danger: '#a94442',
  // text: '#3d3d3d',
  // bg: '#ffffff',
  // bg2: '#fcfeff',
  // red: '#f3f3f3',
  // blue: '#d5dde0',
}
