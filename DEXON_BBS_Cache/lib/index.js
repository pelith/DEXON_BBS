"use strict";

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

const generateShortLinkCachePage = async (tx, shortLink) => {
  // TODO update edit
  const fileName = folderPath + shortLink + '.html'; // if (!fs.existsSync(fileName)) {

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
  await _fs.default.writeFileSync(fileName, cacheFile, 'utf8'); // }
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
  const originalId = ShortURL.encode(dett.cacheweb3.utils.hexToNumber(tx.substr(0, 10))).padStart(6, '0');
  const hexId = dett.cacheweb3.utils.padLeft(dett.cacheweb3.utils.toHex(originalId), 64);
  await Promise.resolve([await dett.BBSCache.methods.link(tx, hexId).send({
    from: contractOwner,
    gas: 240000
  }).on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber == 1) ; // console.log(receipt)
  }).catch(err => {
    console.log(err);
  })]);
};

const addMilestone = async (block, index) => {
  await Promise.resolve([dett.BBSCache.methods.addMilestone(block, index).send({
    from: contractOwner,
    gas: 240000
  }).on('confirmation', (confirmationNumber, receipt) => {
    if (confirmationNumber == 1) console.log(receipt);
  }).catch(err => {
    console.log(err);
  })]);
};

const clone = async () => {
  //dett gh-pages repo clone
  await _rimraf.default.sync('gh-pages');
  await (0, _promise.default)().silent(true).clone('https://github.com/pelith/DEXON_BBS', 'gh-pages', ['--single-branch', '--branch', 'gh-pages']).then(() => console.log('finished')).catch(err => console.error('failed: ', err));
};

const main = async () => {
  let shortLinks = {};
  let milestones = {};
  let indexes = {}; // ############################################
  // #### Read last output folder, and restore.
  // if exist create output folder

  if (!(_fs.default.existsSync(outputPath) && _fs.default.lstatSync(outputPath).isDirectory())) _fs.default.mkdirSync(outputPath); // check dist/output.json

  const outputjsonPath = _path.default.join(outputPath, 'output.json');

  if (_fs.default.existsSync(outputjsonPath) && _fs.default.lstatSync(outputjsonPath).isFile()) {
    const rawData = _fs.default.readFileSync(outputjsonPath);

    const jsonData = JSON.parse(rawData);
    if (jsonData.hasOwnProperty('shortLinks')) shortLinks = jsonData.shortLinks;
    if (jsonData.hasOwnProperty('milestones')) milestones = jsonData.milestones;
    if (jsonData.hasOwnProperty('indexes')) indexes = jsonData.indexes;
  }

  dett = new _dett.default();
  await dett.init(web3, _web.default); // cache init

  const account = dett.cacheweb3.eth.accounts.privateKeyToAccount(`0x${privateKey.toString('hex')}`);
  contractOwner = account.address;
  dett.cacheweb3.eth.accounts.wallet.add(account); // check gh-pages folder
  // if (fs.existsSync('gh-pages') && fs.lstatSync('gh-pages').isDirectory()){
  //   try {
  //     await gitP(__dirname + '/../gh-pages').status()
  //     gitP
  //   } catch (err) {
  //     // .git not init or it's an empty dir
  //     await clone()
  //     console.error('failed: ', err)
  //   }
  // }
  // else await clone()
  // await clone()
  // // ##############
  // const milestones = await dett.BBSCache.methods.getMilestones().call()
  // console.log(milestones)
  // const indexes = await dett.BBSCache.methods.getIndexes().call()
  // console.log(indexes)
  // // const fromBlock = milestones.length!==0 ? +milestones[milestones.length-1]: dett.fromBlock
  // const fromBlock = dett.fromBlock
  // let events = await dett.BBS.getPastEvents('Posted', {fromBlock : fromBlock})
  // delete lastest cache page block's part
  // if ((milestones.length !== 0) && (indexes.length !== 0)){
  //   events.splice(0, (+indexes[indexes.length-1])+1)
  // }
  // generate cache
  // let last = 0
  // let index = 0
  // for (const [i, event] of events.entries()) {
  //   const tx = event.transactionHash
  //   const link = await dett.BBSCache.methods.links(tx).call()
  //   // generate short links
  //   if (!+(link)) {
  //     await rpcRateLimiter(() => generateShortLink(tx))
  //   } else {
  //     // generate short links cache page
  //     const shortLink = web3.utils.hexToUtf8(link)
  //     generateShortLinkCachePage(tx, shortLink)
  //   }
  //   // generate milestone block index
  //   if (last === event.blockNumber) {
  //     index+=1
  //   }
  //   else {
  //     last = event.blockNumber
  //     index = 0
  //   }
  //   if ((i+1) % dett.perPageLength === 0) {
  //     console.log(event.blockNumber, index)
  //     if ( !milestones.includes(event.blockNumber+'')){
  //       if ( !(indexes[milestones.indexOf(event.blockNumber+'')] === index+''))
  //         await rpcRateLimiter(() => addMilestone(event.blockNumber, index))
  //     }
  //   }
  // }
  // console.log('######')
  // ###### ln -s gh-pages to gh-pages folder
  // const files = await fs.readdirSync(folderPath)
  // for (const file of files) {
  //   const output = path.join('gh-pages/', file)
  //   await fs.copyFileSync(path.join(folderPath, file), output)
  // }
  // push gh-pages
  // git(__dirname + '/../gh-pages')
  // .add('./*')
  // .commit("Add cache page")
  // .push(['-u', 'origin', 'gh-pages'], () => console.log('Push done'));
  // await dett.BBSCache.methods.clearMilestone().send({
  //   from: contractOwner,
  //   // gasPrice: 6000000000,
  //   gas: 210000,
  // })

  return;
};

main();