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
})({"pILq":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C";
var web3js = new Web3('https://mainnet-rpc.dexon.org');
var dexonWeb3 = '';
var activeAccount = '';

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
  }
}

function getTitle(content) {
  function convert(str) {
    var tmp = '',
        count = 0;

    for (i = 0; i < str.length; i++) {
      if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;
      if (count >= 40) break;
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

function startApp() {
  var tx = getUrlParameter('tx');

  if (tx) {
    web3js.eth.getTransaction(tx).then(function (transaction) {
      var content = htmlEntities(web3js.utils.hexToUtf8('0x' + transaction.input.slice(138)));
      var author = '@' + transaction.blockNumber;
      var title = getTitle(content.substr(0, 40));
      document.title = title.title + ' - Gossiping - DEXON BBS';
      $('#main-content-author')[0].innerHTML = author;
      $('#main-content-author')[0].href = 'https://dexonscan.app/transaction/' + tx;
      $('#main-content-title')[0].innerHTML = title.title;
      $('#main-content-content')[0].innerHTML = title.match ? content.slice(title.title.length + 2) : content;
      web3js.eth.getBlock(transaction.blockNumber).then(function (block) {
        $('#main-content-date').text(('' + new Date(block.timestamp)).substr(0, 24));
      });
      $('#main-content-href')[0].href = window.location.href;
      $('#main-content-href')[0].innerHTML = window.location.href;
      $('#main-content-from').text(transaction.from.replace(/^(0x.{4}).+(.{4})$/, '$1...$2'));
    });
  }
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
    alert('DEXON Wallet not detected');
  }
}

function upvote() {
  if (dexonWeb3 === '') {
    alert('Please connect to your DEXON Wallet first.');
    return;
  }

  var tx = getUrlParameter('tx').substr(0, 66);

  if (tx) {
    var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
    dexBBSExt.methods.upvote(tx).send({
      from: activeAccount
    }).then(function (receipt) {
      window.location.reload();
    }).catch(function (err) {
      alert(err);
    });
  }
}

function downvote() {
  if (dexonWeb3 === '') {
    alert('Please connect to your DEXON Wallet first.');
    return;
  }

  var tx = getUrlParameter('tx').substr(0, 66);

  if (tx) {
    var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
    dexBBSExt.methods.downvote(tx).send({
      from: activeAccount
    }).then(function (receipt) {
      window.location.reload();
    }).catch(function (err) {
      alert(err);
    });
  }
}

function newReply(content) {
  if (dexonWeb3 === '') {
    alert('Please connect to your DEXON Wallet first.');
    return;
  }

  var tx = getUrlParameter('tx').substr(0, 66);

  if (tx) {
    var dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract);
    dexBBSExt.methods.Reply(tx, content).send({
      from: activeAccount
    }).then(function (receipt) {
      window.location.reload();
    }).catch(function (err) {
      alert(err);
    });
  }
}

$('#dexon-wallet').click(function () {
  initDexon();
});
$(startApp);
},{}]},{},["pILq"], null)