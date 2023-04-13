import { createConfig } from '@/utils/helpers'
import { namesDefault } from '@/config/css-variable-names'
import {
  ash_100,
  ash_200,
  ash_300,
  ash_400,
  ash_500,
  ash_600,
  ash_700,
  ash_800,
  black,
  error,
  grey,
  grey_1,
  grey_2,
  grey_3,
  grey_4,
  grey_9,
  main,
  white,
  warning,
} from '@/config/color'

export default createConfig(namesDefault, [
  white,
  warning,
  error,
  main, // card_bg
  white, // card_label_color
  white, // card_input_color
  black, // card_input_shadow
  ash_200, // card_list_item_active_bg
  ash_100, // card_list_item_hover_bg
  white, // btn_success_color
  main, // btn_success_bg
  grey_3, // btn_secondary_color
  ash_500, // btn_secondary_bg
  grey_4, // btn_secondary_hover_color
  ash_600, // btn_secondary_hover_bg
  ash_400, // btn_secondary_hover_shadow
  grey_4, // btn_secondary_active_color
  ash_800, // btn_secondary_active_bg
  ash_600, // btn_secondary_active_shadow
  white, // btn_light, bg,
  black, // btn_light_color,
  black, // btn_dark_bg,
  white, // btn_dark_color,
  grey_2, // tooltip_card_color
  white, // tooltip_secondary_bg
  grey_3, // tooltip_secondary_color
  grey_3, // tooltip_secondary2_bg
  white, // tooltip_secondary2_color
  ash_800, // icon_color
  white, // close_color
  '#32353A', // modal_backdrop_bg
  grey_3, // modal_content_color
  white, // modal_content_bg
  grey, // modal_title_color
  grey_3, // modal_security_title_color
  grey_1, // modal_security_title_svg_color
  grey_9, // datepicker_shadow
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
  white, // input_secondary_bg,
  grey, // input_secondary_color,
  ash_500, // input_secondary_border,
  white, // input_secondary_hover_bg
  ash_700, // input_secondary_hover_border
  grey_2, // input_secondary_focus_border
  grey_1, // input_secondary_disabled_color
])
