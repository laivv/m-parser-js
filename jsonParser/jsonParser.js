var jsonParser = function () {

  var str = ''

  function isPlainNumber(str) {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(str)
  }
  function isPlainBoolean(str) {
    return /^\s*(true|false)\s*$/.test(str)
  }
  function isPlainNull(str) {
    return /^\s*null\s*$/.test(str)
  }
  function isNumber(str) {
    return /^\s*-?\d+(\.\d+)?/.test(str)
  }
  function isObject(str) {
    return /^\s*\{/.test(str)
  }
  function isNull(str) {
    return /^\s*null/.test(str)
  }
  function isBoolean(str) {
    return /^\s*(true|false)/.test(str)
  }
  function isArray(str) {
    return /^\s*\[/.test(str)
  }
  function isString(str) {
    return /^\s*\"/.test(str)
  }
  function hasNext(str) {
    return /^\s*,/.test(str)
  }
  function parseString() {
    var matched = str.match(/^\s*\"/)
    if (!matched) {
      throw new Error('错误')
    }
    str = str.slice(matched[0].length)
    var key = ''
    var current = ''
    var isClosed = false

    while (str.length) {
      key += current
      current = str[0]
      str = str.slice(1)
      if (current === '"') {
        isClosed = true
        break
      }
    }
    if (!isClosed) {
      throw new Error('错误')
    }
    return key
  }
  function parseNull() {
    var re = /^\s*null/
    var matched = str.match(re)
    if (matched) {
      str = str.slice(matched[0].length)
      if (/^\s*[,\}\]]/.test(str)) {
        return null
      } else {
        throw new Error('错误')
      }
    } else {
      throw new Error('错误')
    }
  }
  function parseBoolean() {
    var re = /^\s*(true|false)/
    var matched = str.match(re)
    if (matched) {
      var bool = matched[1]
      str = str.slice(matched[0].length)
      if (/^\s*[,\}\]]/.test(str)) {
        return bool === 'true' ? true : false
      } else {
        throw new Error('错误')
      }
    } else {
      throw new Error('错误')
    }
  }
  function parseNumber() {
    var re = /^\s*(-?\d+(\.\d+)?)/
    var matched = str.match(re)
    if (matched) {
      var numberStr = matched[1]
      str = str.slice(matched[0].length)
      if (/^\s*[,\}\]]/.test(str)) {
        return Number(numberStr)
      } else {
        throw new Error('错误')
      }
    } else {
      throw new Error('错误')
    }
  }
  function parseObjectKey() {
    var matched = str.match(/^\s*\"/)
    if (!matched) {
      throw new Error('错误')
    }
    str = str.slice(matched[0].length)

    var key = ''
    var current = ''
    var isClosed = false

    while (str.length) {
      key += current
      current = str[0]
      str = str.slice(1)
      if (current === '"') {
        isClosed = true
        break
      }
    }
    if (!isClosed) {
      throw new Error('错误')
    }
    return key
  }
  function parseObject(parent) {
    var matched = str.match(/^\s*\{/)
    if (!matched) {
      throw new Error('错误')
    }
    str = str.slice(matched[0].length)
    parent = parent || {}
    while (!str.match(/^\s*\}/)) {
      var key = parseObjectKey()
      matched = str.match(/^\s*\:/)
      if (matched) {
        str = str.slice(matched[0].length)
      } else {
        throw new Error('错误')
      }
      var value = parseValue()
      parent[key] = value
      if (hasNext(str)) {
        str = str.replace(/^\s*,/, '')
        if (str.match(/^\s*\}/)) {
          throw new Error('错误')
        }
      } else {
        break
      }
    }
    matched = str.match(/\s*\}/)
    if (matched) {
      str = str.slice(matched[0].length)
    } else {
      throw new Error('错误')
    }
    return parent
  }
  function parseValue() {
    if (isNumber(str)) {
      return parseNumber()
    }
    if (isString(str)) {
      return parseString()
    }
    if (isObject(str)) {
      return parseObject()
    }
    if (isArray(str)) {
      return parseArray()
    }
    if (isNull(str)) {
      return parseNull()
    }
    if (isBoolean(str)) {
      return parseBoolean()
    }
    throw new Error('错误')
  }
  function parseArray(parent) {
    var matched = str.match(/^\s*\[/)
    if (!matched) {
      throw new Error('错误')
    }
    str = str.slice(matched[0].length)
    var parent = parent || []

    while (!str.match(/^\s*\]/)) {
      parent.push(parseValue())
      if (hasNext(str)) {
        str = str.replace(/^\s*,/, '')
        if (str.match(/^\s*\]/)) {
          throw new Error('错误')
        }
      } else {
        break
      }
    }
    matched = str.match(/\s*\]/)
    if (matched) {
      str = str.slice(matched[0].length)
    } else {
      throw new Error('错误')
    }
    return parent
  }
  return function (string) {
    str = string.replace(/^\s+|\s+$/, '').replace(/[\n]+/g, '')
    if (isPlainNumber(str)) {
      return Number(str)
    }
    if (isPlainNull(str)) {
      return null
    }
    if (isPlainBoolean(str)) {
      return str === 'true' ? true : false
    }
    if (isObject(str)) {
      var ret = parseObject()
      if (str.length) {
        throw new Error('错误')
      }
      return ret
    }
    if (isArray(str)) {
      var ret = parseArray()
      if (str.length) {
        throw new Error('错误')
      }
      return ret
    }
    throw new Error('错误')
  }
}()