"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var web3 = null;
var cacheweb3 = null;

var ABIBBS = [{ "constant": !1, "inputs": [{ "name": "content", "type": "string" }], "name": "Post", "outputs": [], "payable": !1, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": !1, "inputs": [{ "indexed": !1, "name": "content", "type": "string" }], "name": "Posted", "type": "event" }];
var ABIBBSExt = [{ "constant": false, "inputs": [{ "name": "content", "type": "string" }], "name": "Post", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "origin", "type": "bytes32" }, { "name": "vote", "type": "uint256" }, { "name": "content", "type": "string" }], "name": "Reply", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "origin", "type": "bytes32" }, { "indexed": false, "name": "vote", "type": "uint256" }, { "indexed": false, "name": "content", "type": "string" }], "name": "Replied", "type": "event" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "downvotes", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "upvotes", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "bytes32" }], "name": "voted", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }];
var ABIBBSAdmin = [{ "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "isAdmin", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "who", "type": "address" }, { "name": "_isAdmin", "type": "bool" }], "name": "setAdmin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "origin", "type": "bytes32" }, { "name": "_banned", "type": "bool" }], "name": "ban", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "banned", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "category", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "name": "_category", "type": "address" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "origin", "type": "bytes32" }, { "indexed": false, "name": "banned", "type": "bool" }, { "indexed": false, "name": "admin", "type": "address" }], "name": "Ban", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }];
var ABIBBSEdit = [{ "constant": false, "inputs": [{ "name": "origin", "type": "bytes32" }, { "name": "content", "type": "string" }], "name": "edit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "origin", "type": "bytes32" }, { "indexed": false, "name": "content", "type": "string" }], "name": "Edited", "type": "event" }];
var ABICache = [{ "constant": false, "inputs": [{ "name": "milestone", "type": "uint256" }, { "name": "index", "type": "uint256" }, { "name": "cur", "type": "uint256" }], "name": "addMilestone", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "clearMilestone", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "long", "type": "bytes32" }, { "name": "short", "type": "bytes32" }, { "name": "cur", "type": "uint256" }], "name": "link", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "long", "type": "bytes32" }, { "indexed": false, "name": "short", "type": "bytes32" }, { "indexed": false, "name": "time", "type": "uint256" }], "name": "Link", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "constant": true, "inputs": [], "name": "getIndexes", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getMilestones", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "links", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "time", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];
var BBSContract = '0x663002C4E41E5d04860a76955A7B9B8234475952';
var BBSExtContract = '0xec368ba43010056abb3e5afd01957ea1fdbd3d8f';
var BBSAdminContract = '0x88eb672e01c1a2a6f398b9d52c7dab5f87ca8c2c';
var BBSEditContract = '0x826cb3e5aa484869d9511aad3ead74d382608147';
var BBSCacheContract = '0x8a1d66fff122534d43e7b40d6d3543e4e6789d43';

var titleLength = 40;
var commentLength = 56;
var perPageLength = 10;

var parseText = function parseText(str, len) {
  var tmp = '',
      count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\u0800-\u4e00]/g)) tmp += str[i], count += 2;else if (str[i].match(/[\uff00-\uffff]/g)) tmp += str[i], count += 2;else tmp += str[i], count++;

    if (count === len) break;else if (count > len) tmp = tmp.substr(0, tmp.length - 1);
  }
  return tmp;
};

var Article = function () {
  function Article(_transaction) {
    _classCallCheck(this, Article);

    // constant
    this.titleLength = titleLength;

    this.transaction = _transaction;
    this.rawContent = web3.utils.hexToUtf8('0x' + this.transaction.input.slice(138));
    this.titleMatch = false;
    this.title = this.getTitle();
    this.content = this.getContent();
    this.author = this.transaction.from;
    this.editTimestamps = [];
  }

  _createClass(Article, [{
    key: "init",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return web3.eth.getBlock(this.transaction.blockNumber);

              case 2:
                this.block = _context.sent;

                this.timestamp = this.block.timestamp;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "initEdits",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(edits) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, edit, _transaction, block;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 3;
                _iterator = edits[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 21;
                  break;
                }

                edit = _step.value;
                _context2.next = 9;
                return web3.eth.getTransaction(edit.transactionHash);

              case 9:
                _transaction = _context2.sent;

                if (!(_transaction.from === this.author)) {
                  _context2.next = 18;
                  break;
                }

                this.rawContent = edit.returnValues.content;
                this.title = this.getTitle();
                this.content = this.getContent();
                _context2.next = 16;
                return web3.eth.getBlock(edit.blockNumber);

              case 16:
                block = _context2.sent;

                this.editTimestamps.push(block.timestamp);

              case 18:
                _iteratorNormalCompletion = true;
                _context2.next = 5;
                break;

              case 21:
                _context2.next = 27;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 27:
                _context2.prev = 27;
                _context2.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 30:
                _context2.prev = 30;

                if (!_didIteratorError) {
                  _context2.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context2.finish(30);

              case 34:
                return _context2.finish(27);

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 23, 27, 35], [28,, 30, 34]]);
      }));

      function initEdits(_x) {
        return _ref2.apply(this, arguments);
      }

      return initEdits;
    }()
  }, {
    key: "getTitle",
    value: function getTitle() {
      // title format : [$title]
      var content = this.rawContent;
      content = parseText(content, this.titleLength + '[]'.length);
      var match = content.match(/^\[(.*)\]/);
      this.titleMatch = !!match;
      return match ? match[1] : content;
    }
  }, {
    key: "getContent",
    value: function getContent() {
      return this.titleMatch ? this.rawContent.slice(this.title.length + '[]'.length) : this.rawContent;
    }
  }]);

  return Article;
}();

var Comment = function () {
  function Comment(event) {
    _classCallCheck(this, Comment);

    // constant
    this.commentLength = commentLength;

    this.tx = event.transactionHash;
    this.rawContent = event.returnValues.content;
    this.content = this.getContent();
    this.vote = +event.returnValues.vote;
  }

  _createClass(Comment, [{
    key: "init",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return web3.eth.getTransaction(this.tx);

              case 2:
                this.transaction = _context3.sent;

                this.author = this.transaction.from;
                _context3.next = 6;
                return web3.eth.getBlock(this.transaction.blockNumber);

              case 6:
                this.block = _context3.sent;

                this.timestamp = this.block.timestamp;

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function init() {
        return _ref3.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "getContent",
    value: function getContent() {
      return parseText(this.rawContent, this.commentLength);
    }
  }]);

  return Comment;
}();

var Dett = function () {
  function Dett(_dettweb3) {
    _classCallCheck(this, Dett);

    this.dettweb3 = _dettweb3;
    this.account = '';

    // constant
    this.fromBlock = '1170000';
    this.commentLength = commentLength;
    this.titleLength = titleLength;
    this.perPageLength = perPageLength;
  }

  _createClass(Dett, [{
    key: "init",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_Web3) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (_Web3) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", console.error('Can\'t not find Web3'));

              case 2:

                web3 = new _Web3(new _Web3.providers.WebsocketProvider('wss://mainnet-rpc.dexon.org/ws'));
                cacheweb3 = new _Web3('https://testnet-rpc.dexon.org');

                this.dettBBSExt = this.dettweb3 ? new this.dettweb3.eth.Contract(ABIBBSExt, BBSExtContract) : null;
                this.dettBBSEdit = this.dettweb3 ? new this.dettweb3.eth.Contract(ABIBBSEdit, BBSEditContract) : null;

                this.BBS = new web3.eth.Contract(ABIBBS, BBSContract);
                this.BBSExt = new web3.eth.Contract(ABIBBSExt, BBSExtContract);
                this.BBSAdmin = new web3.eth.Contract(ABIBBSAdmin, BBSAdminContract);
                this.BBSEdit = new web3.eth.Contract(ABIBBSEdit, BBSEditContract);
                this.BBSCache = new cacheweb3.eth.Contract(ABICache, BBSCacheContract);

                _context4.next = 13;
                return this.BBS.getPastEvents('Posted', { fromBlock: this.fromBlock });

              case 13:
                this.BBSEvents = _context4.sent;
                _context4.next = 16;
                return this.BBSEdit.getPastEvents('Edited', { fromBlock: this.fromBlock });

              case 16:
                this.BBSEditEvents = _context4.sent;

              case 17:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function init(_x2) {
        return _ref4.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "getArticles",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.BBSEvents.reverse().map(function () {
                  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(event) {
                    var _ref7, _ref8, article, votes, banned;

                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return Promise.all([_this.getArticle(event.transactionHash, false), _this.getVotes(event.transactionHash), _this.getBanned(event.transactionHash)]);

                          case 2:
                            _ref7 = _context5.sent;
                            _ref8 = _slicedToArray(_ref7, 3);
                            article = _ref8[0];
                            votes = _ref8[1];
                            banned = _ref8[2];
                            return _context5.abrupt("return", [article, votes, banned]);

                          case 8:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, _this);
                  }));

                  return function (_x3) {
                    return _ref6.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getArticles() {
        return _ref5.apply(this, arguments);
      }

      return getArticles;
    }()
  }, {
    key: "getArticle",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(tx, checkEdited) {
        var transaction, article, edits;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return web3.eth.getTransaction(tx);

              case 2:
                transaction = _context7.sent;

                if (this.isDettTx(transaction.to)) {
                  _context7.next = 5;
                  break;
                }

                return _context7.abrupt("return", null);

              case 5:
                article = new Article(transaction);
                _context7.next = 8;
                return article.init();

              case 8:
                if (!checkEdited) {
                  _context7.next = 13;
                  break;
                }

                edits = this.BBSEditEvents.filter(function (event) {
                  return event.returnValues.origin === tx;
                });

                if (!(edits.length > 0)) {
                  _context7.next = 13;
                  break;
                }

                _context7.next = 13;
                return article.initEdits(edits);

              case 13:
                return _context7.abrupt("return", article);

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getArticle(_x4, _x5) {
        return _ref9.apply(this, arguments);
      }

      return getArticle;
    }()
  }, {
    key: "getVotes",
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(tx) {
        var _ref11, _ref12, upvotes, downvotes;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return Promise.all([this.BBSExt.methods.upvotes(tx).call(), this.BBSExt.methods.downvotes(tx).call()]);

              case 2:
                _ref11 = _context8.sent;
                _ref12 = _slicedToArray(_ref11, 2);
                upvotes = _ref12[0];
                downvotes = _ref12[1];
                return _context8.abrupt("return", upvotes - downvotes);

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getVotes(_x6) {
        return _ref10.apply(this, arguments);
      }

      return getVotes;
    }()
  }, {
    key: "getVoted",
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(tx) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.BBSExt.methods.voted(this.account, tx).call();

              case 2:
                return _context9.abrupt("return", _context9.sent);

              case 3:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getVoted(_x7) {
        return _ref13.apply(this, arguments);
      }

      return getVoted;
    }()
  }, {
    key: "getBanned",
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(tx) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.BBSAdmin.methods.banned(tx).call();

              case 2:
                return _context10.abrupt("return", _context10.sent);

              case 3:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getBanned(_x8) {
        return _ref14.apply(this, arguments);
      }

      return getBanned;
    }()
  }, {
    key: "getComments",
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(tx) {
        var _this2 = this;

        var events;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.BBSExt.getPastEvents('Replied', { fromBlock: this.fromBlock });

              case 2:
                events = _context12.sent;
                return _context12.abrupt("return", events.filter(function (event) {
                  return tx == event.returnValues.origin;
                }).map(function () {
                  var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(event) {
                    var _ref17, _ref18, comment;

                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            _context11.next = 2;
                            return Promise.all([_this2.getComment(event)]);

                          case 2:
                            _ref17 = _context11.sent;
                            _ref18 = _slicedToArray(_ref17, 1);
                            comment = _ref18[0];
                            return _context11.abrupt("return", [comment]);

                          case 6:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11, _this2);
                  }));

                  return function (_x10) {
                    return _ref16.apply(this, arguments);
                  };
                }()));

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getComments(_x9) {
        return _ref15.apply(this, arguments);
      }

      return getComments;
    }()
  }, {
    key: "getComment",
    value: function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(event) {
        var comment;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                comment = new Comment(event);
                _context13.next = 3;
                return comment.init();

              case 3:
                return _context13.abrupt("return", comment);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function getComment(_x11) {
        return _ref19.apply(this, arguments);
      }

      return getComment;
    }()
  }, {
    key: "reply",
    value: function () {
      var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(tx, replyType, content) {
        var gas;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (this.dexonWeb3) {
                  _context14.next = 2;
                  break;
                }

                return _context14.abrupt("return", alert('Please connect to your DEXON Wallet first.'));

              case 2:
                if ([0, 1, 2].includes(+replyType)) {
                  _context14.next = 4;
                  break;
                }

                return _context14.abrupt("return", alert('Wrong type of replyType.'));

              case 4:
                if (content.length) {
                  _context14.next = 6;
                  break;
                }

                return _context14.abrupt("return", alert('No content.'));

              case 6:
                if (!tx) {
                  _context14.next = 18;
                  break;
                }

                _context14.next = 9;
                return this.dettBBSExt.methods.Reply(tx, +replyType, content).estimateGas();

              case 9:
                gas = _context14.sent;
                _context14.prev = 10;
                _context14.next = 13;
                return this.dettBBSExt.methods.Reply(tx, +replyType, content).send({ from: this.account, gas: gas }).on('confirmation', function (confirmationNumber, receipt) {
                  window.location.reload();
                });

              case 13:
                _context14.next = 18;
                break;

              case 15:
                _context14.prev = 15;
                _context14.t0 = _context14["catch"](10);

                alert(_context14.t0);

              case 18:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[10, 15]]);
      }));

      function reply(_x12, _x13, _x14) {
        return _ref20.apply(this, arguments);
      }

      return reply;
    }()
  }, {
    key: "post",
    value: function () {
      var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(title, content) {
        var post, gas;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!(title.length > this.titleLength)) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt("return", alert('Title\'s length is over 40 characters.'));

              case 2:
                post = '[' + title + ']' + content;
                _context15.next = 5;
                return this.dettBBSExt.methods.Post(post).estimateGas();

              case 5:
                gas = _context15.sent;
                _context15.prev = 6;
                _context15.next = 9;
                return this.dettBBSExt.methods.Post(post).send({ from: this.account, gas: gas }).on('confirmation', function (confirmationNumber, receipt) {
                  window.location = '/';
                });

              case 9:
                _context15.next = 14;
                break;

              case 11:
                _context15.prev = 11;
                _context15.t0 = _context15["catch"](6);

                alert(_context15.t0);

              case 14:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[6, 11]]);
      }));

      function post(_x15, _x16) {
        return _ref21.apply(this, arguments);
      }

      return post;
    }()
  }, {
    key: "edit",
    value: function () {
      var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(tx, title, content) {
        var transaction, post, gas;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!(title.length > this.titleLength)) {
                  _context16.next = 2;
                  break;
                }

                return _context16.abrupt("return", alert('Title\'s length is over 40 characters.'));

              case 2:
                _context16.next = 4;
                return web3.eth.getTransaction(tx);

              case 4:
                transaction = _context16.sent;

                if (!(this.account.toLowerCase() !== transaction.from.toLowerCase())) {
                  _context16.next = 7;
                  break;
                }

                return _context16.abrupt("return", alert('You can not edit this article.'));

              case 7:
                post = '[' + title + ']' + content;
                _context16.next = 10;
                return this.dexonBBSEdit.methods.edit(tx, post).estimateGas();

              case 10:
                gas = _context16.sent;
                _context16.prev = 11;
                _context16.next = 14;
                return this.dettBBSEdit.methods.edit(tx, post).send({ from: this.account, gas: gas }).on('confirmation', function (confirmationNumber, receipt) {
                  window.location = '/';
                });

              case 14:
                _context16.next = 19;
                break;

              case 16:
                _context16.prev = 16;
                _context16.t0 = _context16["catch"](11);

                alert(_context16.t0);

              case 19:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[11, 16]]);
      }));

      function edit(_x17, _x18, _x19) {
        return _ref22.apply(this, arguments);
      }

      return edit;
    }()
  }, {
    key: "getOriTx",
    value: function () {
      var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(shortLink) {
        var hex, tx;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                hex = cacheNet.utils.padLeft(cacheNet.utils.toHex(shortLink), 64);
                _context17.next = 3;
                return shortURLandMilestone.methods.links(hex).call();

              case 3:
                tx = _context17.sent;
                return _context17.abrupt("return", tx);

              case 5:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function getOriTx(_x20) {
        return _ref23.apply(this, arguments);
      }

      return getOriTx;
    }()
  }, {
    key: "rewardAuthor",
    value: function rewardAuthor(article, value) {
      if (!this.dexonWeb3) {
        alert('Please connect to your DEXON Wallet first.');
        return Promise.reject();
      }

      return this.dexonWeb3.eth.sendTransaction({
        from: this.account,
        to: article.author,
        value: Web3.utils.toWei(value)
      });
    }
  }, {
    key: "isDettTx",
    value: function isDettTx(tx) {
      return [BBSExtContract, BBSContract, '0x9b985Ef27464CF25561f0046352E03a09d2C2e0C'].map(function (x) {
        return x.toLowerCase();
      }).includes(tx.toLowerCase());
    }
  }]);

  return Dett;
}();

exports.default = Dett;