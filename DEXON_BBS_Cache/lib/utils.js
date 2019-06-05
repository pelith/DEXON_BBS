"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.awaitTx = exports.parseContent = exports.parseUser = exports.parseText = exports.getUrlParameter = exports.htmlEntities = void 0;

var _linkifyIt = _interopRequireDefault(require("linkify-it"));

var _urlParse = _interopRequireDefault(require("url-parse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const linkify = (0, _linkifyIt.default)();
const embedWhiteListAndCode = {
  'www.youtube.com': {
    type: 'youtube',
    code: '<iframe class="youtube-player" type="text/html" src="" frameborder="0"  allowfullscreen></iframe>'
  }
};

const htmlEntities = str => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

exports.htmlEntities = htmlEntities;

const getUrlParameter = sParam => {
  let sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName = [];

  for (let i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1]);
  }

  return '';
};

exports.getUrlParameter = getUrlParameter;

const parseText = (str, len) => {
  let tmp = '',
      count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;
    if (count === len) break;else if (count > len) tmp = tmp.substr(0, tmp.length - 1);
  }

  return tmp;
};

exports.parseText = parseText;

const parseUser = address => {
  return address.replace(/^(0x.{4}).+(.{4})$/, '$1…$2');
};

exports.parseUser = parseUser;

const createEmbedObject = url => {
  const parsedUrl = new _urlParse.default(url); // console.log(parsedUrl)

  const ret = {
    allowed: true,
    element: null // https://www.npmjs.com/package/url-parse
    // host: Host name with port number.
    // hostname: Host name without port number.

  };
  const embedMap = embedWhiteListAndCode[parsedUrl.hostname];

  if (embedMap === undefined) {
    // Not in white list
    ret.allowed = false;
    return ret;
  }

  const elParent1 = $('<div class="richcontent"></div>');
  const elParent2 = $('<div class="resize-container"></div>');
  const elParent3 = $('<div class="resize-content"></div>');
  const el = $(embedMap.code);

  if (embedMap.type === 'youtube') {
    const processedUrl = `https://www.youtube.com/embed/${parsedUrl.query.replace('?v=', '')}`;
    el.attr('src', processedUrl);
    elParent3.html(el);
    elParent2.html(elParent3);
    elParent1.html(elParent2);
  }

  ret.element = elParent1[0];
  return ret;
};

const parseContent = (content, loc) => {
  let matches = linkify.match(content);
  let result = [];

  if (matches) {
    let last = 0;
    matches.forEach(match => {
      if (last < match.index) {
        result.push(document.createTextNode(content.slice(last, match.index)));
      }

      const el = $('<a target="_blank"></a>');
      el.attr('href', match.url);
      el.text(match.text);
      result.push(el[0]); // Handle embedded links, only in post not reply

      let embedObject = loc === 'post' ? createEmbedObject(match.url) : null;

      if (embedObject && embedObject.allowed) {
        result.push(embedObject.element);
      }

      last = match.lastIndex;
    });

    if (last < content.length) {
      result.push(document.createTextNode(content.slice(last)));
    }
  } else {
    result.push(document.createTextNode(content));
  }

  return result;
};

exports.parseContent = parseContent;

const awaitTx = promiseEvent => {
  let fulfilled = false;
  return new Promise((resolve, reject) => {
    promiseEvent.on('confirmation', (no, receipt) => {
      if (fulfilled) return;
      fulfilled = true;
      resolve(receipt);
    }).catch(err => {
      if (fulfilled) return;
      fulfilled = true;
      reject(err);
    });
  });
};

exports.awaitTx = awaitTx;