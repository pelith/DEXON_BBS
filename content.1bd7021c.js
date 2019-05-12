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
})({"FO+Z":[function(require,module,exports) {
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
  content = getParseText(content, 42);
  var match = content.match(/^(\[).*(\])/);
  return {
    match: match,
    title: match ? match[0].substr(1, match[0].length - 2) : content
  };
};

exports.getTitle = getTitle;

var getUser = function getUser(address) {
  return address.replace(/^(0x.{4}).+(.{4})$/, '$1…$2');
};

exports.getUser = getUser;
},{}],"UN6U":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newReply = exports.newPost = exports.loginDexon = exports.initDexon = exports.web3js = exports.BBSExtContract = exports.BBSContract = exports.ABIBBSExt = exports.ABIBBS = void 0;
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
  "constant": false,
  "inputs": [{
    "name": "content",
    "type": "string"
  }],
  "name": "Post",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "constant": false,
  "inputs": [{
    "name": "origin",
    "type": "bytes32"
  }, {
    "name": "vote",
    "type": "uint256"
  }, {
    "name": "content",
    "type": "string"
  }],
  "name": "Reply",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "name": "origin",
    "type": "bytes32"
  }, {
    "indexed": false,
    "name": "vote",
    "type": "uint256"
  }, {
    "indexed": false,
    "name": "content",
    "type": "string"
  }],
  "name": "Replied",
  "type": "event"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "bytes32"
  }],
  "name": "downvotes",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "bytes32"
  }],
  "name": "upvotes",
  "outputs": [{
    "name": "",
    "type": "uint256"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}, {
  "constant": true,
  "inputs": [{
    "name": "",
    "type": "address"
  }, {
    "name": "",
    "type": "bytes32"
  }],
  "name": "voted",
  "outputs": [{
    "name": "",
    "type": "bool"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}];
exports.ABIBBSExt = ABIBBSExt;
var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
exports.BBSContract = BBSContract;
var BBSExtContract = "0xec368ba43010056abb3e5afd01957ea1fdbd3d8f";
exports.BBSExtContract = BBSExtContract;
var web3js = new Web3('https://mainnet-rpc.dexon.org');
exports.web3js = web3js;
var dexonWeb3 = '';
var activeAccount = '';

var initDexon = function initDexon(activeDexonRender) {
  if (window.dexon) {
    dexonWeb3 = new Web3(window.dexon);
    dexonWeb3.eth.getAccounts().then(function (accounts) {
      if (accounts.length > 0) {
        detectDexonNetwrok(activeDexonRender);
      }
    });
  }
};

exports.initDexon = initDexon;

var loginDexon = function loginDexon(activeDexonRender) {
  if (window.dexon) {
    window.dexon.enable();
    detectDexonNetwrok(activeDexonRender);
  } else return alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
};

exports.loginDexon = loginDexon;

var detectDexonNetwrok = function detectDexonNetwrok(activeDexonRender) {
  dexonWeb3.eth.net.getId().then(function (networkID) {
    if (networkID === 237) {
      startInteractingWithWeb3(activeDexonRender);
      console.log('DEXON Wallet connected');
    } else alert('Wrong network');
  });
};

var startInteractingWithWeb3 = function startInteractingWithWeb3(activeDexonRender) {
  var start = function start() {
    dexonWeb3.eth.getAccounts().then(function (accounts) {
      if (accounts.length) {
        activeAccount = accounts[0];
        activeDexonRender(activeAccount);
      }
    });
  };

  start();
  setInterval(start, 1000);
};

var newPost = function newPost(title, content) {
  if (!dexonWeb3) return alert('Please connect to your DEXON Wallet.');
  if (title.length > 40) return alert('Title\'s length is over 40 characters.');
  var post = '[' + title + ']' + content;
  var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
  dexBBSExt.methods.Post(post).estimateGas().then(function (gas) {
    dexBBSExt.methods.Post(post).send({
      from: activeAccount,
      gas: gas
    }).then(function (receipt) {
      window.location = 'index.html';
    }).catch(function (err) {
      alert(err);
    });
  });
};

exports.newPost = newPost;

var newReply = function newReply(tx, replyType, content) {
  if (!dexonWeb3) return alert('Please connect to your DEXON Wallet first.');
  if (![0, 1, 2].includes(+replyType)) return alert('Wrong type of replyType.');
  if (!content.length) return alert('No content.');

  if (tx) {
    var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
    dexBBSExt.methods.Reply(tx, +replyType, content).estimateGas().then(function (gas) {
      dexBBSExt.methods.Reply(tx, +replyType, content).send({
        from: activeAccount,
        gas: gas
      }).then(function (receipt) {
        window.location.reload();
      }).catch(function (err) {
        alert(err);
      });
    });
  }
};

exports.newReply = newReply;
},{}],"pILq":[function(require,module,exports) {
"use strict";

var _utils = require("./utils.js");

var _dexon = require("./dexon.js");

var tx = '';
var account = '';
var isShowReply = false,
    isShowReplyType = false;

var activeDexonRender = function activeDexonRender(account) {
  account = (0, _utils.getUser)(account);

  if (account) {
    // show User 
    $("#bbs-login").hide();
    $("#bbs-register").hide();
    $("#bbs-user").show(); // only show reply btn at first time 

    if (!$("#reply-user").text()) $("#reply-btn").show();
  } else {
    // show Login/Register
    $("#bbs-login").show();
    $("#bbs-register").show();
    $("#bbs-user").hide(); // hide reply btn

    $("#reply-btn").hide();
  }

  $("#bbs-user").text(account);
  $("#reply-user").text(account);
};

var showReplyType = function showReplyType() {
  $('#reply-btn').hide();
  $('#reply-type0').show();
  $('#reply-type1').show();
  $('#reply-type2').show();
  isShowReplyType = true;
};

var hideReplyTypeBtn = function hideReplyTypeBtn() {
  $('#reply-type0').hide();
  $('#reply-type1').hide();
  $('#reply-type2').hide();
};

var showReply = function showReply(type) {
  hideReplyTypeBtn();
  $("#reply").show();
  $('#reply-cancel').show();
  var typeColor = {
    0: '#f66',
    1: '#fff',
    2: '#ff6'
  };
  $("#reply-type").css('color', typeColor[type]);
  $("#reply-type").val(type);
  $("html").stop().animate({
    scrollTop: $('#reply').position().top
  }, 500, 'swing');
  $("#reply-content").focus();
  isShowReply = true;
  isShowReplyType = false;
};

var hideReply = function hideReply() {
  hideReplyTypeBtn();
  $("#reply").hide();
  $('#reply-cancel').hide();
  $('#reply-btn').show();
  $("#reply-content").val('');
  isShowReply = false;
};

var main = function main() {
  tx = (0, _utils.getUrlParameter)('tx');
  if (!tx) return;
  (0, _dexon.initDexon)(activeDexonRender);
  $('#bbs-login').click(function () {
    (0, _dexon.loginDexon)(activeDexonRender);
  });
  $('#reply-btn').click(function () {
    showReplyType();
  });
  $('#reply-type0').click(function () {
    showReply(0);
  });
  $('#reply-type1').click(function () {
    showReply(1);
  });
  $('#reply-type2').click(function () {
    showReply(2);
  });
  $('#reply-cancel').click(function () {
    hideReply();
  });
  $('#reply-send').click(function () {
    (0, _dexon.newReply)(tx.substr(0, 66), $("#reply-type").val(), $("#reply-content").val());
  });
  $("#reply-content").blur(function () {
    $("#reply-content").val((0, _utils.getParseText)($("#reply-content").val(), 56));
  });
  keyboardHook();

  _dexon.web3js.eth.getTransaction(tx).then(function (transaction) {
    var content = (0, _utils.htmlEntities)(_dexon.web3js.utils.hexToUtf8('0x' + transaction.input.slice(138)));
    var author = '@' + transaction.blockNumber;
    var title = (0, _utils.getTitle)(content.substr(0, 40));
    document.title = title.title + ' - Gossiping - DEXON BBS';
    $('#main-content-author').text(author);
    $('#main-content-author')[0].href = 'https://dexonscan.app/transaction/' + tx;
    $('#main-content-title').text(title.title);
    $('#main-content-content').text(title.match ? content.slice(title.title.length + 2) : content);

    _dexon.web3js.eth.getBlock(transaction.blockNumber).then(function (block) {
      $('#main-content-date').text(('' + new Date(block.timestamp)).substr(0, 24));
    });

    $('#main-content-href').attr('href', window.location.href);
    $('#main-content-href').text(window.location.href);
    $('#main-content-from').text((0, _utils.getUser)(transaction.from));
  });

  var BBSExt = new _dexon.web3js.eth.Contract(_dexon.ABIBBSExt, _dexon.BBSExtContract);
  var originTx = (0, _utils.getUrlParameter)('tx').substr(0, 66);
  BBSExt.getPastEvents({
    fromBlock: '990000'
  }).then(function (events) {
    events.slice().forEach(function (event) {
      if (originTx == event.returnValues.origin) displayReply(event.returnValues.vote, event.returnValues.content, event.transactionHash, event.blockNumber);
    });
  });
};

var keyboardHook = function keyboardHook() {
  var returnCode = 13;
  $(document).keyup(function (e) {
    if (!isShowReply && !isShowReplyType && e.keyCode == 'X'.charCodeAt()) {
      showReplyType();
    } else if (!isShowReply && isShowReplyType && '1'.charCodeAt() <= e.keyCode && e.keyCode <= '3'.charCodeAt()) {
      if (e.key == '1') showReply(1);else if (e.key == '2') showReply(2);else if (e.key == '3') showReply(0);
    } else if (isShowReply && !isShowReplyType && e.keyCode == returnCode) {
      if ($("#reply-content").val().length > 0) (0, _dexon.newReply)(tx.substr(0, 66), $("#reply-type").val(), $("#reply-content").val());else hideReply();
    }
  });
};

function displayReply(vote, content, txHash, blockNumber) {
  content = (0, _utils.htmlEntities)(content);
  var voteName = ["→", "推", "噓"];
  var elem = $('<div class="push"></div>');

  _dexon.web3js.eth.getTransaction(txHash).then(function (transaction) {
    $(elem).find('.push-userid').text((0, _utils.getUser)(transaction.from));
  });

  elem.html("<span class=\"".concat(vote != 1 ? 'f1 ' : '', "hl push-tag\">").concat(voteName[vote], " </span><span class=\"f3 hl push-userid\"></span><span class=\"f3 push-content\">: ").concat(content, "</span><span class=\"push-ipdatetime\"></span>"));
  $('#main-content.bbs-screen.bbs-content').append(elem);

  _dexon.web3js.eth.getBlock(blockNumber).then(function (block) {
    var date = new Date(block.timestamp);
    $(elem).find('.push-ipdatetime').text(date.getMonth() + 1 + '/' + ('' + date.getDate()).padStart(2, '0') + ' ' + ('' + date.getHours()).padStart(2, '0') + ':' + ('' + date.getMinutes()).padStart(2, '0'));
  });
}

$(main);
},{"./utils.js":"FO+Z","./dexon.js":"UN6U"}]},{},["pILq"], null)