import {
  ash_300,
  ash_500,
  ash_600,
  ash_800,
  black,
  grey_1,
  grey_2,
  grey_4,
  grey_9,
  inherit,
  white,
} from '@/config/color'
import { createConfig } from '@/utils/helpers'
import { namesTheme } from '@/config/css-variable-names'

const color1 = '#CBCCCD'
const color2 = '#797C7E'

const white_005 = '#3B3F43'
const white_007 = '#3F4347'
const white_01 = '#46494D'
const white_015 = '#505357'
const white_02 = '#5A5D61'
const white_03 = '#6F7274'
const white_04 = '#838688'
const white_05 = '#989A9C'
const white_06 = '#ADAEB0'
const white_08 = '#D6D7D7'

export default createConfig(namesTheme, [
  '#1C1F22', // main_bg
  white_05, // main_color
  grey_9, // container_bg
  '#262a2d', // container_box_shadow
  '#222528', // sidebar_border
  white, // title_color
  white_06, // menu_item_color
  white_05, // menu_item_lg_color
  white_02, // menu_item_border
  white_04, // menu_icon_color
  white_03, // menu_icon_lg_color
  white_005, // menu_item_hover_bg
  white, // menu_item_active_color
  white_01, // menu_item_active_bg
  white, // menu_icon_active_color
  white_01, // menu_icons_shadow
  '#CECFD0', // menu_count_color
  '#D8D8D9', // menu_count_active_color
  white_02, // menu_count_bg
  '#626468', // menu_count_active_bg
  white_04, // merchant_name_color
  white_04, // merchant_url_color
  white, // order_desc_color
  color1, // order_desc_more_color
  white, // amount_color
  white_04, // fee_color
  white_04, // currency_color
  black, // card_shadow
  black, // btn_success_shadow
  white, // btn_default_color
  white_04, // btn_default_bg
  white, // btn_default_hover_color
  white_02, // btn_default_hover_bg
  black, // btn_default_hover_shadow
  white, // btn_default_active_color
  white_01, // btn_default_active_bg
  black, // btn_default_active_shadow
  inherit, // btn_outline_bg
  white_02, // btn_outline_border
  white_06, // btn_outline_color
  white_01, // btn_outline_hover_bg
  '#6B6D71', // btn_outline_hover_border
  '#B5B6B8', // btn_outline_hover_color
  white_02, // btn_outline_active_bg
  '#7B7D81', // btn_outline_active_border
  '#BDBEC0', // btn_outline_active_color
  grey_9, // btn_disabled_color
  white_02, // btn_disabled_bg
  white_04, // btn_link_default_color
  white, // btn_link_default_hover_color
  ash_800, // btn_link_default_active_color
  grey_2, // btn_link_secondary_color
  grey_4, // btn_link_secondary_hover_color
  ash_600, // btn_link_secondary_active_color
  white_005, // input_bg
  white, // input_color
  white_02, // input_border
  white_005, // input_hover_bg
  '#898C8E', // input_hover_border
  white_06, // input_focus_border
  white_06, // input_disabled_color
  white_04, // input_prepend_color
  white_04, // checkbox_default_border
  '#585B5F', // checkbox_default_hover_bg
  white_04, // checkbox_default_hover_border
  white_01, // checkbox_default_hover_color
  white, // checkbox_default_checked_bg
  grey_9, // checkbox_default_checked_color
  ash_800, // checkbox_secondary_border
  ash_300, // checkbox_secondary_hover_bg
  ash_800, // checkbox_secondary_hover_border
  ash_500, // checkbox_secondary_hover_color
  grey_2, // checkbox_secondary_checked_bg
  white, // checkbox_secondary_checked_color
  grey_2, // checkbox_secondary_label_color
  white_02, // switch_bg
  grey_9, // switch_indicator_bg
  white_03, // switch_hover_bg
  white_08, // switch_checked_bg
  white_04, // label_color
  '#B1B2B4', // label_hover_color
  white_04, // label_focus_color
  white_05, // link_color //
  white, // tooltip_default_bg
  grey_2, // tooltip_default_color
  '#B6B9BF', // tooltip_secondary_shadow
  '#CACFD6', // tooltip_icons_shadow
  color2, // security_icon_color
  color2, // security_color
  white_08, // security_icon_hover_color
  white_08, // security_hover_color
  white_06, // bank_item_color
  white, // bank_item_hover_color
  grey_9, // bank_icon_shadow
  inherit, // bank_view_icon_active_bg
  white, // bank_view_icon_active_color
  '#414549', // bank_select_bg
  '#8D8F92', // bank_select_close_color
  white, // bank_select_close_hover_color
  grey_2, // alert_info_color
  white, // alert_info_bg
  grey_9, // alert_warning_bg
  white_02, // scrollbar_thumb_bg
  white_005, // receipt_props_bg
  white, // receipt_value_color
  white_007, // box_bg
  white_06, // outline_border
  white_015, // outline_bg
  grey_1, // outline_secondary_border
  ash_300, // outline_secondary_bg
])
