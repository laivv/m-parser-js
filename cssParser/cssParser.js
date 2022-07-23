var cssParser = function () {

  var ret = [], current = null

  function parseSelector(string) {
    var re = /(^\s*([^{};])+\s*)/i
    var matched = string.match(re)
    if (matched) {
      current = {
        selectorName: matched[1],
        propities: []
      }

      string = string.slice(matched[0].length)
      parseOpenTag(string)
    } else {
      throw new Error('解析失败')
    }

  }

  function parseOpenTag(string) {
    var re = /^(\s*\{s*)/i
    var matched = string.match(re)
    if (matched) {
      string = string.slice(matched[0].length)
      parsePropertyName(string)
    } else {
      throw new Error('解析失败')
    }
  }

  function parsePropertyName(string) {
    var re = /^(\s*([-\w]+)\s*:)/i
    var matched = string.match(re)
    if (matched) {
      string = string.slice(matched[0].length)
      parsePropertyValue(string, matched[2])
    } else {
      parseCloseTag(string)
    }
  }

  function parsePropertyValue(string, propertyName) {
    // var re = /^(\s*([-\w\d\"\(\)#][-\w\d,\"\(\)%#\.\s]*[^\s])\s*;?)/i
    var re = /^(\s*([^};]+)\s*;?)/i
    var matched = string.match(re)
    if (matched) {
      string = string.slice(matched[0].length)
      current.propities.push({
        propertyName,
        propertyValue: matched[2]
      })
      if (matched[0].indexOf(';') === -1) {
        parseCloseTag(string)
      } else {
        parsePropertyName(string)
      }
    } else {
      throw new Error('解析失败')
    }
  }


  function parseCloseTag(string) {
    var re = /^(\s*}\s*)/i
    var matched = string.match(re)
    if (matched) {
      string = string.slice(matched[0].length)
      ret.push(current)
      if (string) {
        parseSelector(string)
      } else {
      }
    } else {
      throw new Error('解析失败')
    }
  }

  return function parse(string) {
    ret = []
    string = string.replace(/[\r\n]/g, '').replace(/\s+/g, ' ').replace(/(\/\s*\*+.*\*+\s*\/)+?/g, '')
    parseSelector(string)
    return ret
  }

}()


function cssFormat(cssAst) {
  var ret = []
  cssAst.forEach(css => {
    ret.push(`<div style="margin-top: 10px">${css.selectorName} {</div>`)
    css.propities.forEach(property => {
      ret.push(`<div style="padding-left:20px;">${property.propertyName}: ${property.propertyValue};</div>`)
    })
    ret.push('<div>}</div>')
  })
  return ret.join('')
}

function cssPress(cssAst) {
  var ret = []
  cssAst.forEach(css => {
    ret.push(`${css.selectorName}{`)
    css.propities.forEach(property => {
      ret.push(`${property.propertyName}:${property.propertyValue};`)
    })
    ret.push('}')
  })
  return ret.join('')
}
