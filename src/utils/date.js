import { sort } from '@/utils/sort'
import { arrayIncludes } from '@/utils/array'

export const createDate = (...args) => new Date(...args)

export const parse = (date, format) => {
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

export const format = (date, format = 'DD.MM.YYYY') => {
  let DD = ('0' + date.getDate()).slice(-2)
  let MM = ('0' + (date.getMonth() + 1)).slice(-2)
  let YYYY = date.getFullYear()
  let YY = String(YYYY).slice(-2)

  return [
    ['DD', DD],
    ['MM', MM],
    ['YYYY', YYYY],
    ['YY', YY],
  ].reduce((accum, [name, value]) => accum.replace(name, value), format)
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

const offsetKiev = getOffsetKiev()
const offsetLocal = getOffsetLocal()
const offsetDiff = (offsetLocal - offsetKiev) * 60 * 1000

export const formatKiev = (string, format = 'YYYY-MM-DD') => {
  let now = createDate()
  let date = parse(string, format)

  return formatYYYYMMDD(
    createDate(
      createDate(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        now.getHours(),
        now.getMinutes()
      ).getTime() - offsetDiff
    )
  )
}

function getOffsetLocal() {
  // On Firefox.24 Date#getTimezoneOffset returns a floating point.
  // https://github.com/moment/moment/pull/1871
  return -Math.round(createDate().getTimezoneOffset())
}

function getOffsetKiev() {
  let resultDefault = 3
  let include = [2, 3]
  let format = 'DD.MM.YYYY, hh:mm'
  let result
  try {
    let timeKiev = toLocaleString('Europe/Kiev')
    let timeGreenwich = toLocaleString('Greenwich')
    let dateKiev = parse(timeKiev, format)
    let dateGreenwich = parse(timeGreenwich, format)
    result = dateKiev.getHours() - dateGreenwich.getHours()
    if (!arrayIncludes(include, result)) {
      result = resultDefault
    }
  } catch (e) {
    result = resultDefault
  }

  return result * 60
}

function toLocaleString(timeZone) {
  return createDate().toLocaleString('ru-Ru', { timeZone })
}
