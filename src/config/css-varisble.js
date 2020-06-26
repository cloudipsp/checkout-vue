// const ash_50 = '#FBFBFC' // 212 14 99
// const ash_100 = '#F7F8F9' // 212 14 97
const ash_200 = '#F2F3F5' // 212 13 95
const ash_300 = '#EEF0F2' // 212 13 94
const ash_400 = '#E5E8EB' // 212 13 91
const ash_500 = '#D5DAE0' // 212 14 97
const ash_600 = '#C8CED5' // 212 13 81
const ash_700 = '#BAC1CA' // 212 13 76
const ash_800 = '#A9B2BD' // 212 13 70

const grey_1 = '#9CA7B3' // 212 13 66
const grey_2 = '#818C99' // 212 11 55
const grey_3 = '#5A6470' // 212 11 40
const grey_4 = '#484F57' // 212 9  31
const grey_9 = '#313539' // 212 8  21

const black = '#3D3D3D' // 0 0 24
const white = '#ffffff' // 0 0 100
const error = '#DE4761'

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
  container_box_shadow: ash_600,
  sidebar_border: ash_400,
  menu_item_color: 'container_color',
  menu_item_active_color: black,
  menu_item_active_bg: ash_200,
  menu_item_border: ash_400,
  menu_icon_color: ash_500,
  menu_icon_active_color: 'menu_item_active_color',
  menu_icons_shadow: '#cacfd6',
  menu_count_color: grey_2,
  menu_count_active_color: grey_4,
  menu_count_bg: ash_200,
  menu_count_active_bg: white,
  merchant_name_color: ash_700,
  merchant_url_color: ash_800,
  order_desc_color: 'container_color',
  order_desc_more_color: grey_3,
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
  btn_secondary_color: grey_3,
  btn_secondary_bg: ash_500,
  btn_secondary_shadow: ash_600,
  btn_secondary_hover_color: grey_4,
  btn_secondary_hover_bg: ash_600,
  btn_secondary_hover_shadow: ash_600,
  btn_secondary_active_color: white,
  btn_secondary_active_bg: grey_2,
  btn_secondary_active_shadow: grey_2,
  btn_disabled_color: ash_700,
  btn_disabled_bg: ash_300,
  input_bg: white,
  input_color: black,
  input_border: ash_500,
  input_hover_border: ash_700,
  input_focus_border: grey_2,
  input_error_color: error,
  input_error_border: error,
  checkbox_border: ash_800,
  checkbox_enabled_bg: grey_2,
  checkbox_enabled_color: white,
  form_error_color: error,
  label_color: grey_1,
  label_hover_color: grey_2,
  label_focus_color: grey_2,
  link_color: main,
  tooltip_error_color: error,
  tooltip_error_bg: white,
  tooltip_error_shadow: '#b6b9bf',
  tooltip_card_color: grey_2,
  tooltip_card_bg: white,
  tooltip_card_shadow: '#b6b9bf',
  tooltip_default_color: white,
  tooltip_default_bg: grey_9,
  security_color: ash_800,
  security_hover_color: grey_3,
  close_color: white,
  modal_backdrop_bg: '#32353A',
  modal_content_color: grey_3,
  modal_content_bg: white,
  modal_security_title_color: grey_3,
  modal_security_title_svg_color: grey_1,
}
