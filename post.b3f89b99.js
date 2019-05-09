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
})({"DCbj":[function(require,module,exports) {
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
var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
var BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C";
var web3js = new Web3('https://mainnet-rpc.dexon.org');
var dexonWeb3 = '';
var activeAccount = '';

function convert(str) {
  var tmp = '',
      count = 0;

  for (i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;
    if (count >= 40) break;
  }

  return tmp;
}

function main() {
  String.prototype.lines = function () {
    return this.split(/\r*\n/);
  };

  String.prototype.lineCount = function () {
    return this.lines().length;
  };

  $("#bbs-title")[0].onblur = function () {
    $("#bbs-title")[0].value = convert($("#bbs-title")[0].value);
  }; // $("#bbs-content")[0].onkeyup = () => { }


  $("#bbs-content")[0].placeholder = "~\n".repeat(20);

  $("#bbs-post")[0].onclick = function () {
    newPost($("#bbs-title")[0].value, $("#bbs-content")[0].value);
  };

  $("#bbs-cancel")[0].onclick = function () {
    window.location = 'index.html';
  };

  initDexon();
}

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

function startInteractingWithWeb3() {
  setInterval(function () {
    dexonWeb3.eth.getAccounts().then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          account = _ref2[0];

      activeAccount = account;
    });
  }, 1000);
}

function initDexon() {
  if (window.dexon) {
    var dexonProvider = window.dexon;
    dexonProvider.enable();
    dexonWeb3 = new Web3();
    dexonWeb3.setProvider(dexonProvider);
    dexonWeb3.eth.net.getId().then(function (networkID) {
      if (networkID === 237) {
        startInteractingWithWeb3();
        alert('DEXON Wallet connected');
      } else alert('Wrong network');
    });
  } else {
    alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
    window.location = 'index.html';
  }
}

$(main());
},{}]},{},["DCbj"], null)