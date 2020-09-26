export const getCookie = name => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export const setCookie = (name, value, options) => {
  options = options || {}

  let expires = options.expires

  if (typeof expires === 'number' && expires) {
    let d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString()
  }

  value = encodeURIComponent(value)

  let updatedCookie = name + '=' + value

  for (let propName in options) {
    updatedCookie += '; ' + propName
    let propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += '=' + propValue
    }
  }

  document.cookie = updatedCookie
}

export const deleteCookie = name => {
  setCookie(name, '', {
    expires: -1,
  })
}

// TODO https://github.com/TehShrike/deepmerge

export const deepMerge = (...args) => {
  let extended = args[0]

  let merge = function(obj) {
    for (let prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
          extended[prop] = deepMerge(extended[prop], obj[prop])
        } else {
          extended[prop] = obj[prop]
        }
      }
    }
  }

  for (let i = 1; i < args.length; i++) {
    merge(args[i])
  }

  return extended
}

export const findGetParameter = parameterName => {
  let result = null
  let tmp = []
  location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=')
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}

export const loadStyle = css => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

export const errorHandler = error => {
  if (error instanceof Error) console.log(error)
}

export const clearEmptyValue = object => {
  return Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(object).filter(([k, v]) => v !== '' && v !== null)
  )
}
