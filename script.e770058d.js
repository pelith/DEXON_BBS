// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"UN6U":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newPost = newPost;
exports.initDexon = exports.web3js = exports.BBSExtContract = exports.BBSContract = exports.ABIBBSExt = exports.ABIBBS = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ABIBBS = [{
  "constant": !1,
  "inputs": [{
    "name": "content",
    "type": "string"
  }],
  "name": "Post",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": !1,
  "inputs": [{
    "indexed": !1,
    "name": "content",
    "type": "string"
  }],
  "name": "Posted",
  "type": "event"
}];
exports.ABIBBS = ABIBBS;
var ABIBBSExt = [{
  "constant": !1,
  "inputs": [{
    "name": "post",
    "type": "bytes32"
  }],
  "name": "upvote",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": !1,
  "inputs": [{
    "name": "content",
    "type": "string"
  }],
  "name": "Post",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": !1,
  "inputs": [{
    "name": "origin",
    "type": "bytes32"
  }, {
    "name": "content",
    "type": "string"
  }],
  "name": "Reply",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": !1,
  "inputs": [{
    "name": "post",
    "type": "bytes32"
  }],
  "name": "downvote",
  "outputs": [],
  "payable": !1,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": !1,
  "inputs": [{
    "indexed": !1,
    "name": "origin",
    "type": "bytes32"
  }, {
    "indexed": !1,
    "name": "content",
    "type": "string"
  }],
  "name": "Replied",
  "type": "event"
}];
exports.ABIBBSExt = ABIBBSExt;
var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
exports.BBSContract = BBSContract;
var BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C";
exports.BBSExtContract = BBSExtContract;
var web3js = new Web3('https://mainnet-rpc.dexon.org');
exports.web3js = web3js;
var dexonWeb3 = '';
var activeAccount = '';

var initDexon = function initDexon(activeDexonRender) {
  if (window.dexon) {
    var dexonProvider = window.dexon;
    dexonProvider.enable();
    dexonWeb3 = new Web3();
    dexonWeb3.setProvider(dexonProvider);
    dexonWeb3.eth.net.getId().then(function (networkID) {
      if (networkID === 237) {
        startInteractingWithWeb3(activeDexonRender);
        console.log('DEXON Wallet connected');
      } else alert('Wrong network');
    });
  } else {
    alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
  }
};

exports.initDexon = initDexon;

var startInteractingWithWeb3 = function startInteractingWithWeb3(activeDexonRender) {
  var start = function start() {
    dexonWeb3.eth.getAccounts().then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          account = _ref2[0];

      activeAccount = account;
      activeDexonRender(activeAccount);
    });
  };

  start();
  setInterval(start, 1000);
};

function newPost(title, content) {
  if (dexonWeb3 === '') {
    alert('Please connect to your DEXON Wallet.');
    return;
  }

  if (title.length > 40) {
    alert('Title\'s length is over 40 characters.');
    return;
  }

  var post = '[' + title + ']' + content;
  var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
  dexBBSExt.methods.Post(post).send({
    from: activeAccount
  }).then(function (receipt) {
    window.location = 'index.html';
  }).catch(function (err) {
    alert(err);
  });
}
},{}],"FO+Z":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUser = exports.getTitle = exports.getParseText = exports.getUrlParameter = exports.htmlEntities = void 0;

var htmlEntities = function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

exports.htmlEntities = htmlEntities;

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName = [];

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
  }
};

exports.getUrlParameter = getUrlParameter;

var getParseText = function getParseText(str, len) {
  var tmp = '',
      count = 0;

  for (var i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;
    if (count >= len) break;
  }

  return tmp;
};

exports.getParseText = getParseText;

var getTitle = function getTitle(content) {
  content = getParseText(content, 40);
  var match = content.match(/^(\[).*(\])/);
  return {
    match: match,
    title: match ? match[0].substr(1, match[0].length - 2) : content
  };
};

exports.getTitle = getTitle;

var getUser = function getUser(address) {
  return address.replace(/^(0x.{3}).+(.{3})$/, '$1...$2');
};

exports.getUser = getUser;
},{}],"mpVp":[function(require,module,exports) {
"use strict";

var _dexon = require("./dexon.js");

var _utils = require("./utils.js");

var banList = ["0xdc0db75c79308f396ed6389537d4ddd2a36c920bb2958ed7f70949b1f9d3375d"];

function main() {
  var BBS = new _dexon.web3js.eth.Contract(_dexon.ABIBBS, _dexon.BBSContract);
  var BBSExt = new _dexon.web3js.eth.Contract(_dexon.ABIBBSExt, _dexon.BBSExtContract);
  BBS.getPastEvents({
    fromBlock: '990000'
  }).then(function (events) {
    events.slice().reverse().forEach(function (event) {
      if (!banList.includes(event.transactionHash)) directDisplay((0, _utils.getTitle)(event.returnValues.content.substr(0, 40)).title, event.transactionHash, event.blockNumber);
    });
  });
}

function directDisplay(content, txHash, blockNumber) {
  content = (0, _utils.htmlEntities)(content);
  var elem = $('<div class="r-ent"></div>');
  elem.html("<div class=\"nrec\"><span class=\"hl f1\"> \u7206 </span></div>\n    <div class=\"title\">\n    <a href=\"content.html?tx=".concat(txHash, "\">\n      ").concat(content, "\n    </a>\n    </div>\n    <div class=\"meta\">\n      <div class=\"author\">\n        <a target=\"_blank\" href=\"https://dexonscan.app/transaction/").concat(txHash, "\">\n           @").concat(blockNumber, "\n        </a>\n      </div>\n      <div class=\"article-menu\"></div>\n      <div class=\"date\">...</div>\n    </div>"));
  $('.r-list-container.action-bar-margin.bbs-screen').append(elem);

  _dexon.web3js.eth.getBlock(blockNumber).then(function (block) {
    var date = new Date(block.timestamp);
    $(elem).find('.date').text(date.getMonth() + 1 + '/' + ('' + date.getDate()).padStart(2, '0')).attr('title', date.toLocaleString());
  });
}

var activeDexonRender = function activeDexonRender(account) {
  $("#bbs-login")[0].style.display = 'none';
  $("#bbs-register")[0].style.display = 'none';
  $("#bbs-user")[0].style.display = '';
  $("#bbs-post")[0].style.display = '';
  $("#bbs-user")[0].innerHTML = account.replace(/^(0x.{3}).+(.{3})$/, '$1...$2');
};

$('#bbs-login').click(function () {
  (0, _dexon.initDexon)(activeDexonRender);
});
$(main);
},{"./dexon.js":"UN6U","./utils.js":"FO+Z"}]},{},["mpVp"], null)