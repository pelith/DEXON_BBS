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
var web3js = new Web3('https://mainnet-rpc.dexon.org');
var banList = ["0xdc0db75c79308f396ed6389537d4ddd2a36c920bb2958ed7f70949b1f9d3375d"];

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function startApp() {
  var BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952";
  var BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C";
  var BBS = new web3js.eth.Contract(ABIBBS, BBSContract);
  var BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract);
  BBS.getPastEvents({
    fromBlock: '990000'
  }).then(function (events) {
    events.slice().reverse().forEach(function (event) {
      if (!banList.includes(event.transactionHash)) directDisplay(event.returnValues.content.substr(0, 40), event.transactionHash, event.blockNumber);
    });
  });
}

function directDisplay(content, txHash, blockNumber) {
  content = htmlEntities(content);
  var elem = $('<div class="r-ent"></div>');
  elem.html('<div class="nrec"><span class="hl f1"> 爆 </span></div>' + '<div class="title">' + '<a href="content.html?tx=' + txHash + '">' + content + '</a>' + '</div>' + '<div class="meta">' + '<div class="author">' + '<a target="_blank" href="https://dexonscan.app/transaction/' + txHash + '">' + '@' + blockNumber + '</a>' + '</div>' + '<div class="date">...</div>' + '</div>');
  $('.r-list-container.action-bar-margin.bbs-screen').append(elem);
  web3js.eth.getBlock(blockNumber).then(function (block) {
    $(elem).find('.date').text(('' + new Date(block.timestamp)).substr(0, 24));
  });
}

$(startApp);
},{}]},{},["mpVp"], null)