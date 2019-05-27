'use strict';

var shortArticleHash = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tx) {
    var transaction, hashids, oriId, hex;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return mainnet.eth.getTransaction(tx);

          case 2:
            transaction = _context.sent;

            if (dett.isDettTx(transaction.to)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', null);

          case 5:
            hashids = new _hashids2.default('DEXON_BBS', 6, 'abcdefghijklmnopqrstuvwxyz1234567890');
            oriId = hashids.encode(cacheNet.utils.hexToNumberString(tx));
            hex = cacheNet.utils.padLeft(cacheNet.utils.toHex(oriId), 64);
            // const mapId = cacheNet.utils.hexToUtf8(hex)
            // console.log([transaction.blockNumber, tx, oriId, mapId, hex])

            console.log(tx);
            // console.log(await shortURLandMilestone.methods.link(tx, hex, transaction.blockNumber))
            _context.next = 11;
            return Promise.resolve([shortURLandMilestone.methods.link(tx, hex, transaction.blockNumber).send({
              from: contractOwner,
              gas: 210000
            }).on('confirmation', function (confirmationNumber, receipt) {
              if (confirmationNumber == 1) console.log(receipt);
            }).catch(function (err) {
              console.log(err);
            })]);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function shortArticleHash(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getArticles = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(block) {
    var _this = this;

    var events;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return BBS.getPastEvents('Posted', { fromBlock: block });

          case 2:
            events = _context3.sent;


            events.forEach(function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return shortURLandMilestone.methods.links(event.transactionHash).call();

                      case 2:
                        _context2.t0 = _context2.sent;

                        if (!(_context2.t0 == '0x0000000000000000000000000000000000000000000000000000000000000000')) {
                          _context2.next = 6;
                          break;
                        }

                        _context2.next = 6;
                        return rpcRateLimiter(function () {
                          return shortArticleHash(event.transactionHash);
                        });

                      case 6:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, _this);
              }));

              return function (_x3) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getArticles(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var addMilestone = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(block, time) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Promise.resolve([shortURLandMilestone.methods.addMilestone(block, time).send({
              from: contractOwner,
              gas: 210000
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
    }, _callee4, this);
  }));

  return function addMilestone(_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

var checkMilestones = function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var _this2 = this;

    var time, eventFrom, events, eventBlocks, countPost, pageSize;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return shortURLandMilestone.methods.time().call();

          case 2:
            time = _context6.sent;
            eventFrom = time.toString() ? time.toString() : '0';
            // console.log(eventFrom.toString())

            _context6.next = 6;
            return shortURLandMilestone.getPastEvents('Link', { fromBlock: eventFrom });

          case 6:
            events = _context6.sent;

            // console.log(events)
            eventBlocks = events.map(function (event) {
              return event.returnValues['time'].toString();
            });
            // console.log(eventBlocks)

            countPost = {};

            eventBlocks.forEach(function (x) {
              countPost[x] = (countPost[x] || 0) + 1;
            });
            // console.log(countPost)

            pageSize = 0;

            Object.keys(countPost).forEach(function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(block) {
                var _time;

                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        pageSize += countPost[block];
                        // console.log(pageSize)

                        if (!(pageSize >= dett.perPageLength)) {
                          _context5.next = 6;
                          break;
                        }

                        pageSize = 0;

                        _time = events.map(function (event) {
                          return event.returnValues['time'].toString() == block ? event.blockNumber : null;
                        }).slice().reverse().find(function (element) {
                          return element != null;
                        });
                        // console.log(time)

                        _context5.next = 6;
                        return rpcRateLimiter(function () {
                          return addMilestone(block, _time);
                        });

                      case 6:
                      case 'end':
                        return _context5.stop();
                    }
                  }
                }, _callee5, _this2);
              }));

              return function (_x6) {
                return _ref6.apply(this, arguments);
              };
            }());

            /*
            // way to make 10 posts per page
            const articlesPerPage = 10
            for (let i = 0 ; i < events.length ; i++) {
              if ((i + 1) % articlesPerPage == 0) {
                await shortURLandMilestone.methods.addMilestone(events[i].returnValues['time']).send({
                  from: contractOwner,
                }).catch(err => {
                  console.log(err)
                })
              }
            }
             events.forEach(event => {
              console.log('long: ' + event.returnValues['long'] + ', short: ' + dexonTestnet.utils.hexToUtf8(event.returnValues['short']))
            })
            */

          case 12:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function checkMilestones() {
    return _ref5.apply(this, arguments);
  };
}();

var cache = function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(block) {
    var _this3 = this;

    var events;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return BBS.getPastEvents('Posted', { fromBlock: block });

          case 2:
            events = _context8.sent;

            events.forEach(function () {
              var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
                var shortLinkHex, article, shortLink, title, url, description, cacheMeta, reg, template, cacheFile, fileName;
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        _context7.next = 2;
                        return shortURLandMilestone.methods.links(event.transactionHash).call();

                      case 2:
                        shortLinkHex = _context7.sent;

                        if (!(shortLinkHex != '0x0000000000000000000000000000000000000000000000000000000000000000')) {
                          _context7.next = 17;
                          break;
                        }

                        _context7.next = 6;
                        return dett.getArticle(event.transactionHash, false).catch(console.log);

                      case 6:
                        article = _context7.sent;
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
                        return _context7.stop();
                    }
                  }
                }, _callee7, _this3);
              }));

              return function (_x8) {
                return _ref8.apply(this, arguments);
              };
            }());

          case 4:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, this);
  }));

  return function cache(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _config = require('dotenv/config');

var _config2 = _interopRequireDefault(_config);

var _hashids = require('hashids');

var _hashids2 = _interopRequireDefault(_hashids);

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var keypassword = process.env.KEY_PASSWORD;
var privateKey = _keythereum2.default.recover(keypassword, _keystore2.default);

// cache init
var cacheweb3 = new _web2.default(process.env.RPC_URL);
var account = cacheweb3.eth.accounts.privateKeyToAccount('0x' + privateKey.toString('hex'));
var contractOwner = account.address;
cacheweb3.eth.accounts.wallet.add(account);

// dett init
var web3 = new _web2.default(new _web2.default.providers.WebsocketProvider('wss://mainnet-rpc.dexon.org/ws'));
var dett = new _dett2.default(web3);
dett.init(_web2.default);

var rpcRateLimiter = (0, _pRatelimit.pRateLimit)({
  interval: 2500,
  rate: 1,
  concurrency: 1
});

var main = function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var milestones, fromBlock, events, linkEvents;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return dett.BBSCache.methods.getMilestones().call();

          case 2:
            milestones = _context10.sent;

            // console.log(milestones)

            fromBlock = dett.fromBlock;
            _context10.next = 6;
            return dett.BBS.getPastEvents('Posted', { fromBlock: fromBlock });

          case 6:
            events = _context10.sent;
            _context10.next = 9;
            return dett.BBSCache.getPastEvents('Link', { fromBlock: fromBlock });

          case 9:
            linkEvents = _context10.sent;

            // console.log(linkEvents)

            // first get milestone
            // get last milesotne to latest block events
            // generate new milestone

            events.forEach(function () {
              var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(event, i) {
                var a;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        _context9.next = 2;
                        return shortURLandMilestone.methods.links(event.transactionHash).call();

                      case 2:
                        a = _context9.sent;

                        console.log(a);
                        // if (await shortURLandMilestone.methods.links(event.transactionHash).call() == '0x0000000000000000000000000000000000000000000000000000000000000000') {
                        // await rpcRateLimiter(() => shortArticleHash(event.transactionHash))
                        // }


                      case 4:
                      case 'end':
                        return _context9.stop();
                    }
                  }
                }, _callee9, undefined);
              }));

              return function (_x9, _x10) {
                return _ref10.apply(this, arguments);
              };
            }());

            // generate new short link


            // console.log(events)
            // const postFrom = milestones.length ? milestones[milestones.length-1] * 1 + 1 : '1170000'
            // await getArticles(postFrom)
            // await checkMilestones()
            // await cache(dett.fromBlock)


            /*
            await shortURLandMilestone.methods.clearMilestone().send({
              from: contractOwner,
              gasPrice: 6000000000,
              gas: 120000,
            })
            */
            return _context10.abrupt('return');

          case 12:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function main() {
    return _ref9.apply(this, arguments);
  };
}();

main();