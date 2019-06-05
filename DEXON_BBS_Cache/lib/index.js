"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateCacheAndShortLink = void 0;

var _web = _interopRequireDefault(require("web3"));

var _config = _interopRequireDefault(require("dotenv/config"));

var _simpleGit = _interopRequireDefault(require("simple-git"));

var _promise = _interopRequireDefault(require("simple-git/promise"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _pRatelimit = require("p-ratelimit");

var _dett = _interopRequireDefault(require("./dett.js"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _utils = require("./utils.js");

var _keythereum = _interopRequireDefault(require("keythereum"));

var _keystore = _interopRequireDefault(require("../keystore.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const keypassword = process.env.KEY_PASSWORD;

const privateKey = _keythereum.default.recover(keypassword, _keystore.default);

const web3 = new _web.default(new _web.default.providers.WebsocketProvider('wss://mainnet-rpc.dexon.org/ws'));
let dett = null;
let contractOwner = '';
const rpcRateLimiter = (0, _pRatelimit.pRateLimit)({
  interval: 2500,
  rate: 1,
  concurrency: 1
});
const outputPath = 'dist';

const outputJsonPath = _path.default.join(outputPath, 'output.json');

const cachePath = 'gh-pages/s';
let shortLinks = {};
let milestones = [];
let indexes = [];

const generateShortLinkCachePage = async (tx, shortLink) => {
  const article = await dett.getArticle(tx);
  const title = article.title;
  const url = 'https://dett.cc/' + shortLink + '.html';
  const description = (0, _utils.parseText)(article.content, 160).replace(/\n|\r/g, ' ');
  const cacheMeta = {
    'Cache - DEXON BBS': title,
    'https://dett.cc/cache.html': url,
    'Cache Cache Cache Cache Cache': description
  };
  const reg = new RegExp(Object.keys(cacheMeta).join("|"), "gi");

  const template = _fs.default.readFileSync('gh-pages/cache.html', 'utf-8');

  const cacheFile = template.replace(reg, matched => {
    return cacheMeta[matched];
  });

  const filePath = _path.default.join(cachePath, shortLink + '.html');

  await _fs.default.writeFileSync(filePath, cacheFile, 'utf8');
}; // is hash collison posible(?)


class ShortURL {
  static encode(num) {
    let str = '';

    while (num > 0) {
      str = ShortURL.alphabet.charAt(num % ShortURL.base) + str;
      num = Math.floor(num / ShortURL.base);
    }

    return str;
  }

  static decode(str) {
    let num = 0;

    for (let i = 0; i < str.length; i++) {
      num = num * ShortURL.base + ShortURL.alphabet.indexOf(str.charAt(i));
    }

    return num;
  }

}

ShortURL.alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ';
ShortURL.base = ShortURL.alphabet.length;

const generateShortLink = async tx => {
  const shortLink = ShortURL.encode(dett.cacheweb3.utils.hexToNumber(tx.substr(0, 10))).padStart(6, '0');
  const hexId = dett.cacheweb3.utils.padLeft(dett.cacheweb3.utils.toHex(shortLink), 64);
  await (0, _utils.awaitTx)(dett.BBSCache.methods.link(tx, hexId).send({
    from: contractOwner,
    gas: 240000
  })).then(receipt => {
    console.log('#Add ShortLink : ' + tx + ' ' + shortLink);
    shortLinks[tx] = shortLink;
  });
};

const addMilestone = async (blockNumber, index) => {
  await (0, _utils.awaitTx)(dett.BBSCache.methods.addMilestone(+blockNumber, index).send({
    from: contractOwner,
    gas: 240000
  })).then(receipt => {
    console.log('#Add Milestone : ' + blockNumber + '-' + index);
    milestones.push(+blockNumber);
    indexes.push(index);
  });
};

const clone = async () => {
  //delete gh-pages folder
  if (_fs.default.existsSync('gh-pages') && _fs.default.lstatSync('gh-pages').isDirectory()) await _rimraf.default.sync('gh-pages');
  await (0, _promise.default)().silent(true).clone('https://github.com/pelith/DEXON_BBS', 'gh-pages', ['--single-branch', '--branch', 'gh-pages']).then(() => console.log('#Clone Done.')).catch(err => console.error('failed: ', err));
};

const syncContract = async () => {
  dett = new _dett.default();
  await dett.init(web3, _web.default);
  const events = await dett.BBSCache.getPastEvents('Link', {
    fromBlock: 0
  });

  for (const event of events) {
    const tx = event.returnValues.long;
    const shortLink = event.returnValues.short;
    shortLinks[tx] = web3.utils.hexToUtf8(shortLink);
  }

  milestones = await dett.BBSCache.methods.getMilestones().call();
  indexes = await dett.BBSCache.methods.getIndexes().call();
  saveLocalStorage();
  console.log('#Sync Done');
};

const saveLocalStorage = () => {
  // if exist create output folder
  if (!(_fs.default.existsSync(outputPath) && _fs.default.lstatSync(outputPath).isDirectory())) _fs.default.mkdirSync(outputPath);
  const jsonData = JSON.stringify({
    'shortLinks': shortLinks,
    'milestones': milestones,
    'indexes': indexes
  }, null, 4);

  _fs.default.writeFileSync(outputJsonPath, jsonData, 'utf8');
};

const loadLocalStorage = () => {
  // if exist create output folder
  if (!(_fs.default.existsSync(outputPath) && _fs.default.lstatSync(outputPath).isDirectory())) _fs.default.mkdirSync(outputPath); // check dist/output.json

  if (_fs.default.existsSync(outputJsonPath) && _fs.default.lstatSync(outputJsonPath).isFile()) {
    const rawData = _fs.default.readFileSync(outputJsonPath);

    const jsonData = JSON.parse(rawData);
    if (jsonData.hasOwnProperty('shortLinks')) shortLinks = jsonData.shortLinks;
    if (jsonData.hasOwnProperty('milestones')) milestones = jsonData.milestones;
    if (jsonData.hasOwnProperty('indexes')) indexes = jsonData.indexes;
  }
};

const generateCacheAndShortLink = async () => {
  loadLocalStorage(); // ############################################
  // #### init Dett

  dett = new _dett.default();
  await dett.init(web3, _web.default); // cache init

  const account = dett.cacheweb3.eth.accounts.privateKeyToAccount(`0x${privateKey.toString('hex')}`);
  contractOwner = account.address;
  dett.cacheweb3.eth.accounts.wallet.add(account);
  let fromBlock = dett.fromBlock;
  const hasLocalMilestones = milestones.length && indexes.length;
  if (hasLocalMilestones) fromBlock = +milestones[milestones.length - 1];
  let events = await dett.BBS.getPastEvents('Posted', {
    fromBlock: fromBlock
  }); // delete lastest cache page block's part

  if (hasLocalMilestones) events.splice(0, +indexes[indexes.length - 1] + 1); // ############################################
  // #### Generate Cache && Short link

  let last = 0;
  let index = 0;

  for (const [i, event] of events.entries()) {
    const tx = event.transactionHash;
    const blockNumber = event.blockNumber.toString();
    const link = await dett.BBSCache.methods.links(tx).call(); // generate short links

    if (!+link) await rpcRateLimiter(() => generateShortLink(tx, blockNumber)); // generate milestone block index

    if (last === blockNumber) {
      index += 1;
    } else {
      last = blockNumber;
      index = 0;
    }

    if ((i + 1) % dett.perPageLength === 0) {
      if (!milestones.includes(blockNumber)) {
        if (!(indexes[milestones.indexOf(blockNumber)] === index + '')) await rpcRateLimiter(() => addMilestone(blockNumber, index));
      }
    }
  }

  saveLocalStorage(); // ############################################
  // #### Generate Cache Page to gh-pages folder
  // clone dett gh-page branch

  await clone(); // if exist create cache output folder

  if (!(_fs.default.existsSync(cachePath) && _fs.default.lstatSync(cachePath).isDirectory())) _fs.default.mkdirSync(cachePath);

  for (const tx of Object.keys(shortLinks)) await generateShortLinkCachePage(tx, shortLinks[tx]);

  console.log('#Generate Cache Page Done.'); // ############################################
  // #### Commit & push

  (0, _simpleGit.default)(__dirname + '/../gh-pages/').add('.').commit("Add cache page").push(['-u', 'origin', 'gh-pages'], () => console.log('#Push Done.')); // await dett.BBSCache.methods.clearMilestone().send({
  //   from: contractOwner,
  //   // gasPrice: 6000000000,
  //   gas: 210000,
  // })
};

exports.generateCacheAndShortLink = generateCacheAndShortLink;

const main = async () => {
  // syncContract()
  await generateCacheAndShortLink();
};

main();