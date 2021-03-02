export const createDate = (...args) => new Date(...args)

export const date = (date, format) => {
  let regexp = new RegExp(
    format
      .replace('YYYY', '(?<year>\\d{4})')
      .replace('yy', '(?<year>\\d{2})')
      .replace('MM', '(?<month>\\d{2})')
      .replace('DD', '(?<day>\\d{2})')
      .replace('hh', '(?<hour>\\d{2})')
      .replace('mm', '(?<minute>\\d{2})')
  )

  let match = date.match(regexp)

  if (!match) return new Date('')

  let { year = 0, month = 1, day = 1, hour = 0, minute = 0 } = match.groups
  year = `20${year}`.slice(-4)

  if (month > 12) return new Date('')

  return createDate(year, month - 1, day, hour, minute)
}

export const isAfter = (date, after) => {
  return date.getTime() > after.getTime()
}

export const isEqual = (dateLeft, dateRight) => {
  return dateLeft.getTime() === dateRight.getTime()
}

export const isValid = date => {
  return !isNaN(date)
}
