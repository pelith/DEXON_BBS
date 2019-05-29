'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var cache = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(block) {
    var _this = this;

    var events;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return BBS.getPastEvents('Posted', { fromBlock: block });

          case 2:
            events = _context2.sent;

            events.forEach(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
                var shortLinkHex, article, shortLink, title, url, description, cacheMeta, reg, template, cacheFile, fileName;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return shortURLandMilestone.methods.links(event.transactionHash).call();

                      case 2:
                        shortLinkHex = _context.sent;

                        if (!(shortLinkHex != '0x0000000000000000000000000000000000000000000000000000000000000000')) {
                          _context.next = 17;
                          break;
                        }

                        _context.next = 6;
                        return dett.getArticle(event.transactionHash, false).catch(console.log);

                      case 6:
                        article = _context.sent;
                        shortLink = cacheNet.utils.hexToUtf8(shortLinkHex);
                        title = article.title;
                        url = 'https://dett.cc/' + shortLink + '.html';
                        description = (0, _utils.parseText)(article.content, 160).replace(/\n|\r/g, ' ');
                        cacheMeta = { 'Cache - DEXON BBS': title, 'https://dett.cc/cache.html': url, 'Cache Cache Cache Cache Cache': description };
                        reg = new RegExp(Object.keys(cacheMeta).join("|"), "gi");
                        template = _fs2.default.readFileSync('build/cache.html', 'utf-8');
                        cacheFile = template.replace(reg, function (matched) {
                          return cacheMeta[matched];
                        });
                        fileName = 'build/' + shortLink + '.html';


                        _fs2.default.writeFileSync(fileName, cacheFile, 'utf8');

                      case 17:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, _this);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function cache(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _config = require('dotenv/config');

var _config2 = _interopRequireDefault(_config);

var _pRatelimit = require('p-ratelimit');

var _dett = require('./dett.js');

var _dett2 = _interopRequireDefault(_dett);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils.js');

var _keythereum = require('keythereum');

var _keythereum2 = _interopRequireDefault(_keythereum);

var _keystore = require('../keystore.json');

var _keystore2 = _interopRequireDefault(_keystore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var keypassword = process.env.KEY_PASSWORD;
var privateKey = _keythereum2.default.recover(keypassword, _keystore2.default);

var web3 = new _web2.default(new _web2.default.providers.WebsocketProvider('wss://mainnet-rpc.dexon.org/ws'));
var dett = null;
var contractOwner = '';

var rpcRateLimiter = (0, _pRatelimit.pRateLimit)({
  interval: 2500,
  rate: 1,
  concurrency: 1
});

var ShortURL = function () {
  function ShortURL() {
    _classCallCheck(this, ShortURL);
  }

  _createClass(ShortURL, null, [{
    key: 'encode',
    value: function encode(num) {
      var str = '';
      while (num > 0) {
        str = ShortURL.alphabet.charAt(num % ShortURL.base) + str;
        num = Math.floor(num / ShortURL.base);
      }
      return str;
    }
  }, {
    key: 'decode',
    value: function decode(str) {
      var num = 0;
      for (var i = 0; i < str.length; i++) {
        num = num * ShortURL.base + ShortURL.alphabet.indexOf(str.charAt(i));
      }
      return num;
    }
  }]);

  return ShortURL;
}();

ShortURL.alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
ShortURL.base = ShortURL.alphabet.length;

var generateShortLink = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tx) {
    var originalId, hexId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            originalId = ShortURL.encode(dett.cacheweb3.utils.hexToNumber(tx.substr(0, 10))).padStart(6, '0');
            hexId = dett.cacheweb3.utils.padLeft(dett.cacheweb3.utils.toHex(originalId), 64);
            _context3.t0 = Promise;
            _context3.next = 5;
            return dett.BBSCache.methods.link(tx, hexId).send({
              from: contractOwner,
              gas: 240000
            }).on('confirmation', function (confirmationNumber, receipt) {
              if (confirmationNumber == 1) ; // console.log(receipt)
            }).catch(function (err) {
              console.log(err);
            });

          case 5:
            _context3.t1 = _context3.sent;
            _context3.t2 = [_context3.t1];
            _context3.next = 9;
            return _context3.t0.resolve.call(_context3.t0, _context3.t2);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function generateShortLink(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

var addMilestone = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(block, index) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Promise.resolve([dett.BBSCache.methods.addMilestone(block, index).send({
              from: contractOwner,
              gas: 240000
            }).on('confirmation', function (confirmationNumber, receipt) {
              if (confirmationNumber == 1) console.log(receipt);
            }).catch(function (err) {
              console.log(err);
            })]);

          case 2:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function addMilestone(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var main = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var account, milestones, indexes, fromBlock, events, last, index, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

    return regeneratorRuntime.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            dett = new _dett2.default(web3);
            _context6.next = 3;
            return dett.init(_web2.default);

          case 3:

            // cache init
            account = dett.cacheweb3.eth.accounts.privateKeyToAccount('0x' + privateKey.toString('hex'));

            contractOwner = account.address;
            dett.cacheweb3.eth.accounts.wallet.add(account);

            _context6.next = 8;
            return dett.BBSCache.methods.getMilestones().call();

          case 8:
            milestones = _context6.sent;

            console.log(milestones);

            _context6.next = 12;
            return dett.BBSCache.methods.getIndexes().call();

          case 12:
            indexes = _context6.sent;

            console.log(indexes);

            fromBlock = milestones.length !== 0 ? +milestones[milestones.length - 1] : dett.fromBlock;
            _context6.next = 17;
            return dett.BBS.getPastEvents('Posted', { fromBlock: fromBlock });

          case 17:
            events = _context6.sent;


            console.log(events.length);

            if (milestones.length !== 0 && indexes.length !== 0) {
              events.splice(0, +indexes[indexes.length - 1] + 1);
              console.log(events.length);
            }

            // generate cache
            last = 0;
            index = 0;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context6.prev = 25;
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
              var _step$value, i, event;

              return regeneratorRuntime.wrap(function _loop$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _step$value = _slicedToArray(_step.value, 2), i = _step$value[0], event = _step$value[1];
                      _context5.next = 3;
                      return dett.BBSCache.methods.links(event.transactionHash).call();

                    case 3:
                      if (+_context5.sent) {
                        _context5.next = 6;
                        break;
                      }

                      _context5.next = 6;
                      return rpcRateLimiter(function () {
                        return generateShortLink(event.transactionHash);
                      });

                    case 6:

                      // generate milestone block index
                      if (last === event.blockNumber) {
                        index += 1;
                      } else {
                        last = event.blockNumber;
                        index = 0;
                      }

                      if (!((i + 1) % dett.perPageLength === 0)) {
                        _context5.next = 13;
                        break;
                      }

                      console.log(event.blockNumber, index);

                      if (milestones.includes(event.blockNumber + '')) {
                        _context5.next = 13;
                        break;
                      }

                      if (indexes[milestones.indexOf(event.blockNumber + '')] === index + '') {
                        _context5.next = 13;
                        break;
                      }

                      _context5.next = 13;
                      return rpcRateLimiter(function () {
                        return addMilestone(event.blockNumber, index);
                      });

                    case 13:
                    case 'end':
                      return _context5.stop();
                  }
                }
              }, _loop, undefined);
            });
            _iterator = events.entries()[Symbol.iterator]();

          case 28:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context6.next = 33;
              break;
            }

            return _context6.delegateYield(_loop(), 't0', 30);

          case 30:
            _iteratorNormalCompletion = true;
            _context6.next = 28;
            break;

          case 33:
            _context6.next = 39;
            break;

          case 35:
            _context6.prev = 35;
            _context6.t1 = _context6['catch'](25);
            _didIteratorError = true;
            _iteratorError = _context6.t1;

          case 39:
            _context6.prev = 39;
            _context6.prev = 40;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 42:
            _context6.prev = 42;

            if (!_didIteratorError) {
              _context6.next = 45;
              break;
            }

            throw _iteratorError;

          case 45:
            return _context6.finish(42);

          case 46:
            return _context6.finish(39);

          case 47:

            console.log('######');

            // generate new short link


            // console.log(events)
            // const postFrom = milestones.length ? milestones[milestones.length-1] * 1 + 1 : '1170000'
            // await getArticles(postFrom)
            // await checkMilestones()
            // await cache(dett.fromBlock)


            // await dett.BBSCache.methods.clearMilestone().send({
            //   from: contractOwner,
            //   // gasPrice: 6000000000,
            //   gas: 210000,
            // })

            return _context6.abrupt('return');

          case 49:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee5, undefined, [[25, 35, 39, 47], [40,, 42, 46]]);
  }));

  return function main() {
    return _ref5.apply(this, arguments);
  };
}();

main();