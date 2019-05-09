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
})({"mpVp":[function(require,module,exports) {
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
var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
var BBSExtContract = "0xca107a421f3093cbe28a2a7b4fce843931613bcd";
var web3js = new Web3('https://mainnet-rpc.dexon.org');
var dexonWeb3 = '';
var activeAccount = '';
var banList = ["0xdc0db75c79308f396ed6389537d4ddd2a36c920bb2958ed7f70949b1f9d3375d"];

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function startApp() {
  var BBS = new web3js.eth.Contract(ABIBBS, BBSContract);
  var BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract);
  BBS.getPastEvents({
    fromBlock: '990000'
  }).then(function (events) {
    events.slice().reverse().forEach(function (event) {
      if (!banList.includes(event.transactionHash)) directDisplay(getTitle(event.returnValues.content.substr(0, 40)).title, event.transactionHash, event.blockNumber);
    });
  });
}

function getTitle(content) {
  function convert(str) {
    var tmp = '',
        count = 0;

    for (i = 0; i < str.length; i++) {
      if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;

      if (count >= 40) {
        tmp += '…';
        break;
      }
    }

    return tmp;
  }

  content = convert(content);
  match = content.match(/^(\[).*(\])/);
  return {
    match: match,
    title: match ? match[0].substr(1, match[0].length - 2) : content
  };
}

function directDisplay(content, txHash, blockNumber) {
  content = htmlEntities(content);
  var elem = $('<div class="r-ent"></div>');
  elem.html("<div class=\"nrec\"><span class=\"hl f1\"> \u7206 </span></div>\n    <div class=\"title\">\n    <a href=\"content.html?tx=".concat(txHash, "\">\n      ").concat(content, "\n    </a>\n    </div>\n    <div class=\"meta\">\n      <div class=\"author\">\n        <a target=\"_blank\" href=\"https://dexonscan.app/transaction/").concat(txHash, "\">\n           @").concat(blockNumber, "\n        </a>\n      </div>\n      <div class=\"article-menu\"></div>\n      <div class=\"date\">...</div>\n    </div>"));
  $('.r-list-container.action-bar-margin.bbs-screen').append(elem);
  web3js.eth.getBlock(blockNumber).then(function (block) {
    var date = new Date(block.timestamp);
    $(elem).find('.date').text(date.getMonth() + 1 + '/' + ('' + date.getDate()).padStart(2, '0')).attr('title', date.toLocaleString());
  });
}

function startInteractingWithWeb3() {
  setInterval(function () {
    dexonWeb3.eth.getAccounts().then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          account = _ref2[0];

      activeAccount = account;
      $("#bbs-user")[0].innerHTML = activeAccount.replace(/^(0x.{3}).+(.{3})$/, '$1...$2');
    });
  }, 2000);
}

function initDexon() {
  if (window.dexon) {
    var dexonProvider = window.dexon;
    dexonProvider.enable();
    dexonWeb3 = new Web3();
    dexonWeb3.setProvider(dexonProvider);
    dexonWeb3.eth.net.getId().then(function (networkID) {
      if (networkID === 237) {
        $("#bbs-post")[0].style.display = '';
        $("#bbs-login")[0].style.display = 'none';
        $("#bbs-register")[0].style.display = 'none';
        $("#bbs-user")[0].style.display = '';
        startInteractingWithWeb3();
        console.log('DEXON Wallet connected');
      } else alert('Wrong network');
    });
  } else {
    alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)');
  }
}

$('#bbs-login').click(function () {
  initDexon();
});
$(startApp);
},{}]},{},["mpVp"], null)