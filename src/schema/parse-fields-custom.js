export const parseFieldsCustom = ({
  value = '',
  name,
  label,
  placeholder,
  type = 'input',
  hidden,
  required,
  valid = {},
  readonly,
}) => {
  let { pattern, min_length, max_length } = valid
  let rules = {}
  if (required) rules.required = required
  if (pattern) rules.regex = pattern
  if (min_length) rules.min = min_length
  if (max_length) rules.max = max_length

  let noLabelFloating = Boolean(
    (label && placeholder) || (!label && !placeholder)
  )

  return {
    value,
    name,
    noLabelFloating,
    label: label || placeholder,
    placeholder: noLabelFloating ? placeholder : '',
    componentName: hidden ? 'input-hidden' : 'f-form-group',
    component: type,
    custom: true,
    rules,
    autocomplete: 'on',
    readonly,
    disabled: readonly,
  }
}
