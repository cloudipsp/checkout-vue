import { sort } from '@/utils/sort'

export const createDate = (...args) => new Date(...args)

export const date = (date, format) => {
  let config = {
    YYYY: 'year',
    yy: 'year',
    MM: 'month',
    DD: 'day',
    hh: 'hour',
    mm: 'minute',
  }

  let order = Object.keys(config)
    .reduce(
      (accum, type) => [...accum, { type, index: format.indexOf(type) }],
      []
    )
    .filter(({ index }) => index > -1)
    .sort(sort('index'))
    .map(({ type }) => type)

  let regexp = new RegExp(
    order.reduce(
      (accum, type) => accum.replace(type, `(\\d{${type.length}})`),
      format
    )
  )

  let match = date.match(regexp)

  if (!match) return new Date('')

  let d = {
    year: 0,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
  }

  order.forEach((type, index) => {
    d[config[type]] = match[index + 1]
  })

  d.year = `20${d.year}`.slice(-4)

  if (d.month > 12) return new Date('')

  return createDate(d.year, d.month - 1, d.day, d.hour, d.minute)
}

export const formatMMYY = date => {
  let year = String(date.getFullYear()).slice(-2)
  let month = `0${date.getMonth() + 1}`.slice(-2)
  return `${month}/${year}`
}

export const formatYYYYMMDD = date =>
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2)

export const isAfter = (date, after) => {
  return date.getTime() > after.getTime()
}

export const isEqual = (dateLeft, dateRight) => {
  return dateLeft.getTime() === dateRight.getTime()
}

export const isValid = date => {
  return !isNaN(date)
}
