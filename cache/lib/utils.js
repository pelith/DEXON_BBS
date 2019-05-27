'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseContent = exports.parseUser = exports.parseText = exports.getUrlParameter = exports.htmlEntities = undefined;

var _linkifyIt = require('linkify-it');

var _linkifyIt2 = _interopRequireDefault(_linkifyIt);

var _urlParse = require('url-parse');

var _urlParse2 = _interopRequireDefault(_urlParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linkify = (0, _linkifyIt2.default)();

var embedWhiteListAndCode = {
  'www.youtube.com': {
    type: 'youtube',
    code: '<iframe class="youtube-player" type="text/html" src="" frameborder="0"  allowfullscreen></iframe>'
  }
};

var htmlEntities = exports.htmlEntities = function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

var getUrlParameter = exports.getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName = [];

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? '' : decodeURIComponent(sParameterName[1]);
  }
  return '';
};

var parseText = exports.parseText = function parseText(str, len) {
  var tmp = '',
      count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;

    if (count === len) break;else if (count > len) tmp = tmp.substr(0, tmp.length - 1);
  }
  return tmp;
};

var parseUser = exports.parseUser = function parseUser(address) {
  return address.replace(/^(0x.{4}).+(.{4})$/, '$1…$2');
};

var createEmbedObject = function createEmbedObject(url) {
  var parsedUrl = new _urlParse2.default(url);
  // console.log(parsedUrl)
  var ret = {
    allowed: true,
    element: null

    // https://www.npmjs.com/package/url-parse
    // host: Host name with port number.
    // hostname: Host name without port number.
  };var embedMap = embedWhiteListAndCode[parsedUrl.hostname];
  if (embedMap === undefined) {
    // Not in white list
    ret.allowed = false;
    return ret;
  }

  var elParent1 = $('<div class="richcontent"></div>');
  var elParent2 = $('<div class="resize-container"></div>');
  var elParent3 = $('<div class="resize-content"></div>');
  var el = $(embedMap.code);

  if (embedMap.type === 'youtube') {
    var processedUrl = 'https://www.youtube.com/embed/' + parsedUrl.query.replace('?v=', '');
    el.attr('src', processedUrl);
    elParent3.html(el);
    elParent2.html(elParent3);
    elParent1.html(elParent2);
  }

  ret.element = elParent1[0];

  return ret;
};

var parseContent = exports.parseContent = function parseContent(content, loc) {
  var matches = linkify.match(content);
  var result = [];

  if (matches) {
    var last = 0;
    matches.forEach(function (match) {
      if (last < match.index) {
        result.push(document.createTextNode(content.slice(last, match.index)));
      }

      var el = $('<a target="_blank"></a>');
      el.attr('href', match.url);
      el.text(match.text);
      result.push(el[0]);

      // Handle embedded links, only in post not reply
      var embedObject = loc === 'post' ? createEmbedObject(match.url) : null;
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