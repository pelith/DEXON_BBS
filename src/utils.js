import LinkifyIt from 'linkify-it'
import UrlParse from 'url-parse'

const linkify = LinkifyIt()

const embedWhiteListAndCode = {
  'www.youtube.com': {
    type: 'youtube',
    code:  '<iframe src="" width="560" height="315" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  },
}

const htmlEntities = (str) => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const getUrlParameter = (sParam) => {
  let sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName=[];

  for (let i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam)
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
  }
}

const getParseText = (str, len) => {
  let tmp = '', count = 0;
  for(let i=0;i<str.length; i++){
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp+=str[i],count+=2
    else if (str[i].match(/[\u0800-\u4e00]/g)) tmp+=str[i],count+=2
    else if (str[i].match(/[\uff00-\uffff]/g)) tmp+=str[i],count+=2
    else tmp+=str[i],count++

    if (count === len) break
    else if (count>len)
      tmp = tmp.substr(0,tmp.length-1)
  }
  return tmp
}

const getTitle = (content) => {
  content = getParseText(content, 42)
  const match = content.match(/^(\[).*(\])/)
  return {
    match: match,
    title: match ? match[0].substr(1,match[0].length-2) : content
  }
}

const getUser = (address) => {
  return address.replace(/^(0x.{4}).+(.{4})$/, '$1…$2')
}

const createEmbedObject = (url) => {
  const parsedUrl = new UrlParse(url)
  console.log(parsedUrl)
  const ret = {
    allowed: true,
    element: null
  }

  // https://www.npmjs.com/package/url-parse
  // host: Host name with port number.
  // hostname: Host name without port number.
  const embedMap = embedWhiteListAndCode[parsedUrl.hostname]
  if (embedMap === undefined) {
    // Not in white list
    ret.allowed = false
    return ret
  }

  const el = $(embedMap.code)

  if (embedMap.type === 'youtube') {
    const processedUrl = `https://www.youtube.com/embed/${parsedUrl.query.replace('?v=', '')}`
    el.attr('src', processedUrl)
  }

  ret.element = el[0]

  return ret
}

const parseContent = (content, loc) => {
  let matches = linkify.match(content)
  let result = []

  if (matches) {
    let last = 0
    matches.forEach(match => {
      if (last < match.index) {
        result.push(document.createTextNode(content.slice(last, match.index)));
      }

      const el = $('<a target="_blank"></a>')
      el.attr('href', match.url)
      el.text(match.text)
      result.push(el[0])

      // Handle embedded links, only in post not reply
      let embedObject = loc === 'post' ? createEmbedObject(match.url) : null
      if (embedObject && embedObject.allowed) {
        result.push("<br/><br/>")
        result.push(embedObject.element)
        result.push("<br/><br/>")
      }

      last = match.lastIndex
    });
    if (last < content.length) {
      result.push(document.createTextNode(content.slice(last)))
    }
  } else {
    result.push(document.createTextNode(content))
  }

  return result
}

export {htmlEntities, getUrlParameter, getParseText, getTitle, getUser, parseContent}