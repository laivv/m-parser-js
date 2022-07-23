var htmlParser = function (template) {
  var simpleTag = "input|meta|br|hr|img|link".split('|')
  var isSingle = function (tag) {
    return simpleTag.indexOf(tag) > - 1
  }
  var parseTag = function (template) {
    template = template.replace(/[\r\n]/g, '')
    var re = /(<(\w+))|(<\/\s*(\w+)\s*>)/i
    var ret = []
    var stack = []
    var match = template.match(re)
    var index
    var isOpen
    var parent
    var node
    while (match) {
      isOpen = match[0].indexOf('</') === -1 ? true : false
      name = (isOpen ? match[2] : match[4]).toLowerCase()
      index = match.index
      if (isOpen) {
        if (stack.length) {
          var pop = stack[stack.length - 1]
          if (!pop.children) {
            pop.children = []
          }
          parent = pop.children
        } else {
          parent = ret
        }

        node = {
          name: name
        }
        parent.push(node)
        if (!isSingle(name)) {
          stack.push(node)
        }
      } else {
        if (stack.pop().name !== name) {
          throw new Error('错误')
        }
      }
      template = template.slice(match[0].length + index)
      if (isOpen) {
        var attrs = parseAttr(template)
        if (Object.keys(attrs).length) {
          node.attrs = attrs
        }
      }
      match = template.match(re)
    }
    if (stack.length) {
      throw new Error('标签未闭合')
    }
    return ret
  }

  var parseAttr = function (template) {
    var attrs = {}
    var re = /^(\s*([\w\d-_@]+)(=("|')([^>\r\n\4]*)\4)+?)+?/
    var match = re.exec(template)
    if (match) {
      match[1].split(/\s+/).forEach(function (item) {
        var kv = item.split('=')
        if (kv[0]) {
          attrs[kv[0]] = kv[1] ? kv[1].replace(/^"|"$/g, '') : null
        }
      })
    }
    return attrs
  }

  return parseTag
}()