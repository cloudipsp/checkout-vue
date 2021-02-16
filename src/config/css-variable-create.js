const active = 'active'
const alert = 'alert'
const bank = 'bank'
const bg = 'bg'
const border = 'border'
const box = 'box'
const btn = 'btn'
const card = 'card'
const cell = 'cell'
const checkbox = 'checkbox'
const checked = 'checked'
const close = 'close'
const color = 'color'
const container = 'container'
const content = 'content'
const count = 'count'
const dark = 'dark'
const datepicker = 'datepicker'
const default_ = 'default'
const desc = 'desc'
const disabled = 'disabled'
const error = 'error'
const focus = 'focus'
const hover = 'hover'
const icon = 'icon'
const icons = 'icons'
const info = 'info'
const input = 'input'
const item = 'item'
const label = 'label'
const lg = 'lg'
const light = 'light'
const link = 'link'
const list = 'list'
const main = 'main'
const menu = 'menu'
const merchant = 'merchant'
const modal = 'modal'
const name = 'name'
const order = 'order'
const outline = 'outline'
const receipt = 'receipt'
const secondary = 'secondary'
const security = 'security'
const select = 'select'
const shadow = 'shadow'
const sidebar = 'sidebar'
const success = 'success'
const switch_ = 'switch'
const title = 'title'
const today = 'today'
const tooltip = 'tooltip'
const view = 'view'

const names = [
  [main, bg],
  [main, color],
  [container, bg],
  [container, box, shadow],
  [sidebar, border],
  [title, color],
  [menu, item, color],
  [menu, item, lg, color],
  [menu, item, border],
  [menu, icon, color],
  [menu, icon, lg, color],
  [menu, item, hover, bg],
  [menu, item, active, color],
  [menu, item, active, bg],
  [menu, icon, active, color],
  [menu, icons, shadow],
  [menu, count, color],
  [menu, count, active, color],
  [menu, count, bg],
  [menu, count, active, bg],
  [merchant, name, color],
  [merchant, 'url', color],
  [order, desc, color],
  [order, desc, 'more', color],
  ['amount', color],
  ['fee', color],
  ['currency', color],
  [card, shadow],
  [card, bg],
  [card, label, color],
  [card, input, color],
  [card, input, shadow],
  [card, list, item, active, bg],
  [card, list, 'number', color],
  [card, list, 'expiry', 'date', color],
  [btn, success, color],
  [btn, success, bg],
  [btn, success, shadow],
  [btn, default_, color],
  [btn, default_, bg],
  [btn, default_, hover, color],
  [btn, default_, hover, bg],
  [btn, default_, hover, shadow],
  [btn, default_, active, color],
  [btn, default_, active, bg],
  [btn, default_, active, shadow],
  [btn, secondary, color],
  [btn, secondary, bg],
  [btn, secondary, hover, color],
  [btn, secondary, hover, bg],
  [btn, secondary, hover, shadow],
  [btn, secondary, active, color],
  [btn, secondary, active, bg],
  [btn, secondary, active, shadow],
  [btn, outline, bg],
  [btn, outline, border],
  [btn, outline, color],
  [btn, outline, hover, bg],
  [btn, outline, hover, border],
  [btn, outline, hover, color],
  [btn, outline, active, bg],
  [btn, outline, active, border],
  [btn, outline, active, color],
  [btn, disabled, color],
  [btn, disabled, bg],
  [btn, link, default_, color],
  [btn, link, default_, hover, color],
  [btn, link, default_, active, color],
  [btn, link, secondary, color],
  [btn, link, secondary, hover, color],
  [btn, link, secondary, active, color],
  [input, bg],
  [input, color],
  [input, border],
  [input, hover, bg],
  [input, hover, border],
  [input, focus, border],
  [input, error, color],
  [input, error, border],
  [input, 'readonly', color],
  [input, 'prepend', color],
  [checkbox, default_, border],
  [checkbox, default_, hover, bg],
  [checkbox, default_, hover, border],
  [checkbox, default_, hover, color],
  [checkbox, default_, checked, bg],
  [checkbox, default_, checked, color],
  [checkbox, secondary, border],
  [checkbox, secondary, hover, bg],
  [checkbox, secondary, hover, border],
  [checkbox, secondary, hover, color],
  [checkbox, secondary, checked, bg],
  [checkbox, secondary, checked, color],
  [checkbox, secondary, label, color],
  [switch_, bg],
  [switch_, 'indicator', bg],
  [switch_, hover, bg],
  [switch_, checked, bg],
  ['text', error, color],
  [label, color],
  [label, hover, color],
  [label, focus, color],
  [link, color],
  [tooltip, error, color],
  [tooltip, card, color],
  [tooltip, 'cvv', color],
  [tooltip, light, bg],
  [tooltip, light, shadow],
  [tooltip, dark, color],
  [tooltip, dark, bg],
  [tooltip, icons, shadow],
  [icon, color],
  [security, icon, color],
  [security, color],
  [security, icon, hover, color],
  [security, hover, color],
  [close, color],
  [modal, 'backdrop', bg],
  [modal, content, color],
  [modal, content, bg],
  [modal, title, color],
  [modal, security, title, color],
  [modal, security, title, 'svg', color],
  [bank, item, color],
  [bank, item, hover, color],
  [bank, icon, shadow],
  [bank, view, icon, active, bg],
  [bank, view, icon, active, color],
  [bank, select, bg],
  [bank, select, close, color],
  [bank, select, close, hover, color],
  [datepicker, shadow],
  [datepicker, bg],
  [datepicker, cell, color],
  [datepicker, cell, today, color],
  [datepicker, cell, today, bg],
  [datepicker, cell, hover, color],
  [datepicker, cell, hover, bg],
  [datepicker, cell, active, color],
  [datepicker, cell, active, bg],
  [datepicker, cell, disabled, color],
  [datepicker, cell, 'not', 'current', 'month', color],
  [datepicker, 'th', color],
  [datepicker, btn, 'text', color],
  [alert, info, color],
  [alert, info, bg],
  ['scrollbar', 'thumb', bg],
  [receipt, 'props', bg],
  [receipt, 'value', color],
  ['logo', color],
  ['subscription', bg],
]

export default function (list) {
  return list.reduce((result, value, key) => {
    result[names[key].join('_')] = value
    return result
  }, {})
}
