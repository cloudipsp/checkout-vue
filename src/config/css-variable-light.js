import {
  ash_100,
  ash_200,
  ash_300,
  ash_400,
  ash_500,
  ash_600,
  ash_700,
  ash_800,
  grey_1,
  grey_2,
  grey_3,
  grey_4,
  grey_9,
  black,
  grey,
  white,
  error,
  inherit,
  main,
} from '@/config/color'
import createConfig from '@/config/css-variable-create'

const color1 = '#CACFD6'
const color2 = '#B6B9BF'

export default createConfig([
  ash_400, // main_bg
  grey_2, // main_color
  white, // container_bg
  ash_600, // container_box_shadow
  ash_400, // sidebar_border
  grey, // title_color
  grey, // menu_item_color
  grey_2, // menu_item_lg_color
  ash_400, // menu_item_border
  grey_2, // menu_icon_color
  ash_500, // menu_icon_lg_color
  ash_100, // menu_item_hover_bg
  grey, // menu_item_active_color
  ash_200, // menu_item_active_bg
  grey, // menu_icon_active_color
  color1, // menu_icons_shadow
  grey_2, // menu_count_color
  grey_4, // menu_count_active_color
  ash_200, // menu_count_bg
  white, // menu_count_active_bg
  ash_700, // merchant_name_color
  ash_700, // merchant_url_color
  grey_2, // order_desc_color
  grey_3, // order_desc_more_color
  grey, // amount_color
  ash_700, // fee_color
  grey_1, // currency_color
  main, // card_shadow
  main, // card_bg
  white, // card_label_color
  white, // card_input_color
  black, // card_input_shadow
  ash_300, // card_list_item_active_bg
  grey, // card_list_number_color
  grey_2, // card_list_expiry_date_color
  white, // btn_success_color
  main, // btn_success_bg
  main, // btn_success_shadow
  grey_3, // btn_default_color
  ash_500, // btn_default_bg
  grey_4, // btn_default_hover_color
  ash_600, // btn_default_hover_bg
  ash_400, // btn_default_hover_shadow
  grey_4, // btn_default_active_color
  ash_800, // btn_default_active_bg
  ash_600, // btn_default_active_shadow
  grey_3, // btn_secondary_color
  ash_500, // btn_secondary_bg
  grey_4, // btn_secondary_hover_color
  ash_600, // btn_secondary_hover_bg
  ash_400, // btn_secondary_hover_shadow
  grey_4, // btn_secondary_active_color
  ash_800, // btn_secondary_active_bg
  ash_600, // btn_secondary_active_shadow
  white, // btn_outline_bg
  ash_500, // btn_outline_border
  grey_2, // btn_outline_color
  ash_100, // btn_outline_hover_bg
  ash_600, // btn_outline_hover_border
  grey_2, // btn_outline_hover_color
  ash_300, // btn_outline_active_bg
  ash_600, // btn_outline_active_border
  grey_2, // btn_outline_active_color
  ash_700, // btn_disabled_color
  ash_300, // btn_disabled_bg
  grey_2, // btn_link_default_color
  grey_4, // btn_link_default_hover_color
  ash_600, // btn_link_default_active_color
  ash_500, // btn_link_secondary_color
  white, // btn_link_secondary_hover_color
  ash_800, // btn_link_secondary_active_color
  white, // input_bg
  grey, // input_color
  ash_500, // input_border
  white, // input_hover_bg
  ash_700, // input_hover_border
  grey_2, // input_focus_border
  error, // input_error_color
  error, // input_error_border
  grey_1, // input_readonly_color
  grey, // input_prepend_color
  ash_800, // checkbox_default_border
  ash_300, // checkbox_default_hover_bg
  ash_800, // checkbox_default_hover_border
  ash_500, // checkbox_default_hover_color
  grey_2, // checkbox_default_checked_bg
  white, // checkbox_default_checked_color
  ash_500, // checkbox_secondary_border
  grey_2, // checkbox_secondary_hover_bg
  ash_500, // checkbox_secondary_hover_border
  grey_1, // checkbox_secondary_hover_color
  white, // checkbox_secondary_checked_bg
  '#6A747E', // checkbox_secondary_checked_color
  white, // checkbox_secondary_label_color
  ash_400, // switch_bg
  white, // switch_indicator_bg
  ash_600, // switch_hover_bg
  grey_2, // switch_checked_bg
  error, // text_error_color
  grey_1, // label_color
  grey_2, // label_hover_color
  grey_2, // label_focus_color
  grey_2, // link_color
  error, // tooltip_error_color
  grey_2, // tooltip_card_color
  grey_3, // tooltip_cvv_color
  grey_9, // tooltip_default_bg
  white, // tooltip_default_color
  white, // tooltip_secondary_bg
  color2, // tooltip_secondary_shadow
  grey_9, // tooltip_icons_shadow
  ash_800, // icon_color
  ash_700, // security_icon_color
  ash_800, // security_color
  grey_2, // security_icon_hover_color
  grey_3, // security_hover_color
  white, // close_color
  '#32353A', // modal_backdrop_bg
  grey_3, // modal_content_color
  white, // modal_content_bg
  grey, // modal_title_color
  grey_3, // modal_security_title_color
  grey_1, // modal_security_title_svg_color
  grey_2, // bank_item_color
  grey_4, // bank_item_hover_color
  color1, // bank_icon_shadow
  ash_200, // bank_view_icon_active_bg
  inherit, // bank_view_icon_active_color
  ash_300, // bank_select_bg
  grey, // bank_select_close_color
  grey, // bank_select_close_hover_color
  color2, // datepicker_shadow
  white, // datepicker_bg
  grey_2, // datepicker_cell_color
  grey_3, // datepicker_cell_today_color
  ash_300, // datepicker_cell_today_bg
  grey_3, // datepicker_cell_hover_color
  ash_500, // datepicker_cell_hover_bg
  white, // datepicker_cell_active_color
  ash_800, // datepicker_cell_active_bg
  ash_400, // datepicker_cell_disabled_color
  ash_500, // datepicker_cell_not_current_month_color
  ash_700, // datepicker_th_color
  grey, // datepicker_btn_text_color
  white, // alert_info_color
  grey_3, // alert_info_bg
  grey_2, // scrollbar_thumb_bg
  ash_100, // receipt_props_bg
  grey, // receipt_value_color
  black, // logo_color
  ash_200, // subscription_bg
])
