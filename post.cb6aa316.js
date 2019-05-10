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
  return address.replace(/^(0x.{3}).+(.{3})$/, '$1...$2');
};

exports.getUser = getUser;
},{}],"UN6U":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newPost = newPost;
exports.newReply = newReply;
exports.loginDexon = exports.initDexon = exports.web3js = exports.BBSExtContract = exports.BBSContract = exports.ABIBBSExt = exports.ABIBBS = void 0;
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
  } else alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
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
      if (accounts.length > 0) {
        activeAccount = accounts[0];
        activeDexonRender(activeAccount);
      }
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
}

function newReply(tx, replyType, content) {
  if (dexonWeb3 === '') {
    alert('Please connect to your DEXON Wallet first.');
    return;
  }

  if (![0, 1, 2].includes(+replyType)) {
    alert('Wrong type of replyType.');
    return;
  }

  if (content.length === 0) {
    alert('No content.');
    return;
  }

  if (tx) {
    var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
    dexBBSExt.methods.Reply(tx, replyType, content).estimateGas().then(function (gas) {
      dexBBSExt.methods.Reply(tx, replyType, content).send({
        from: activeAccount,
        gas: gas
      }).then(function (receipt) {
        window.location.reload();
      }).catch(function (err) {
        alert(err);
      });
    });
  }
}
},{}],"DCbj":[function(require,module,exports) {
"use strict";

var _utils = require("./utils.js");

var _dexon = require("./dexon.js");

var checkContent = function checkContent() {
  return $("#bbs-content")[0].value.length > 0;
};

var checkTitle = function checkTitle() {
  return $("#bbs-title")[0].value.length > 0;
};

var check = function check() {
  return checkContent() && checkTitle();
};

var activeDexonRender = function activeDexonRender(account) {
  $(".bbs-post")[0].disabled = !check(); // Handle mobile version

  if ($(".bbs-post")[1] !== undefined) $(".bbs-post")[1].disabled = !check();
  $("#bbs-user")[0].innerHTML = (0, _utils.getUser)(account);
};

var keyboardHook = function keyboardHook() {
  var ctrlKey = 17,
      cmdKey = 91,
      QKey = 81,
      XKey = 88,
      YKey = 89;
  var ctrlDown = false;
  var checkSave = false,
      checkPost = false;
  $(document).keydown(function (e) {
    if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
  }).keyup(function (e) {
    if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
  });
  $(document).keydown(function (e) {
    if (ctrlDown && e.keyCode == QKey) {
      $("#bbs-footer")[0].style.display = 'none';
      $("#bbs-checksave")[0].style.display = '';
      $("#bbs-title")[0].disabled = true;
      $("#bbs-content")[0].disabled = true;
      checkSave = true; // window.location = 'index.html'
    } else if (ctrlDown && e.keyCode == XKey) {
      console.log("x");

      if (check()) {
        $("#bbs-footer")[0].style.display = 'none';
        $("#bbs-checkpost")[0].style.display = '';
        $("#bbs-title")[0].disabled = true;
        $("#bbs-content")[0].disabled = true;
        checkPost = true;
      }
    } else if (!ctrlDown && 48 <= e.keyCode && e.keyCode <= 222) {
      if (checkSave) {
        $("#bbs-footer")[0].style.display = '';
        $("#bbs-checksave")[0].style.display = 'none';
        $("#bbs-title")[0].disabled = false;
        $("#bbs-content")[0].disabled = false;
        checkSave = false;
        if (e.keyCode == YKey) window.location = 'index.html';
      } else if (checkPost) {
        $("#bbs-footer")[0].style.display = '';
        $("#bbs-checkpost")[0].style.display = 'none';
        $("#bbs-title")[0].disabled = false;
        $("#bbs-content")[0].disabled = false;
        checkPost = false;
        if (e.keyCode == YKey) if (check()) (0, _dexon.newPost)($("#bbs-title")[0].value, $("#bbs-content")[0].value);
      }
    }
  });
};

function main() {
  // String.prototype.lines = function() { return this.split(/\r*\n/); }
  // String.prototype.lineCount = function() { return this.lines().length; }
  keyboardHook();

  $("#bbs-title")[0].onblur = function () {
    $("#bbs-title")[0].value = (0, _utils.getParseText)($("#bbs-title")[0].value, 40);
  };

  $("#bbs-content")[0].onkeyup = function () {};

  if ($(window).width() > 992) {
    $("#bbs-content")[0].placeholder = "~\r\n".repeat(20);
  } else {
    // mobile
    $("#bbs-content")[0].placeholder = "請輸入您欲發布的內容";
  }

  var postFunc = function postFunc() {
    if (!checkContent() && !checkTitle() || confirm('確定發文?')) (0, _dexon.newPost)($("#bbs-title")[0].value, $("#bbs-content")[0].value);
  };

  $(".bbs-post")[0].onclick = postFunc; // 電腦版

  $(".bbs-post")[1].onclick = postFunc; // 手機版

  var cancelFunc = function cancelFunc() {
    console.log('.bbs-cancel clicked');
    if (!checkContent() && !checkTitle() || confirm('結束但不儲存?')) window.location = 'index.html';
  };

  $(".bbs-cancel")[0].onclick = cancelFunc; // 電腦版

  $(".bbs-cancel")[1].onclick = cancelFunc; // 手機版

  (0, _dexon.initDexon)(activeDexonRender);
}

$(main());
},{"./utils.js":"FO+Z","./dexon.js":"UN6U"}]},{},["DCbj"], null)