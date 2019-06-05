import Web3 from 'web3'
import dotenv from 'dotenv/config'

import git from 'simple-git'
import gitP from 'simple-git/promise'
import rimraf from 'rimraf'

import { pRateLimit } from 'p-ratelimit'
import Dett from './dett.js'
import fs from 'fs'
import path from 'path'
import { parseText, awaitTx } from './utils.js'

import keythereum from 'keythereum'
import keystore from '../keystore.json'
const keypassword = process.env.KEY_PASSWORD
const privateKey = keythereum.recover(keypassword, keystore)

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet-rpc.dexon.org/ws'))
let dett = null
let contractOwner = ''

const rpcRateLimiter = pRateLimit({
  interval: 2500,
  rate: 1,
  concurrency: 1,
})

const outputPath = 'dist'
const outputJsonPath = path.join(outputPath, 'output.json')
const cachePath = 'gh-pages/s'

let shortLinks = {}
let milestones = []
let indexes = []

const generateShortLinkCachePage = async (tx, shortLink) => {
  const article = await dett.getArticle(tx)
  const title = article.title
  const url = 'https://dett.cc/' + shortLink + '.html'
  const description = parseText(article.content, 160).replace(/\n|\r/g, ' ')
  const cacheMeta = { 'Cache - DEXON BBS': title,
                      'https://dett.cc/cache.html': url,
                      'Cache Cache Cache Cache Cache': description }
  const reg = new RegExp(Object.keys(cacheMeta).join("|"),"gi")
  const template = fs.readFileSync('gh-pages/cache.html', 'utf-8')

  const cacheFile = template.replace(reg, (matched) => {
    return cacheMeta[matched]
  });

  const filePath = path.join(cachePath, shortLink + '.html')
  await fs.writeFileSync(filePath, cacheFile, 'utf8')
}

// is hash collison posible(?)
class ShortURL {
  static encode(num) {
    let str = ''
    while (num > 0) {
      str = ShortURL.alphabet.charAt(num % ShortURL.base) + str
      num = Math.floor(num / ShortURL.base)
    }
    return str
  }

  static decode(str) {
    let num = 0
    for (let i = 0; i < str.length; i++) {
      num = num * ShortURL.base + ShortURL.alphabet.indexOf(str.charAt(i))
    }
    return num
  }
}
ShortURL.alphabet = '23456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
ShortURL.base = ShortURL.alphabet.length;

const generateShortLink = async (tx) => {
  const shortLink = ShortURL.encode(dett.cacheweb3.utils.hexToNumber(tx.substr(0,10))).padStart(6,'0')
  const hexId = dett.cacheweb3.utils.padLeft(dett.cacheweb3.utils.toHex(shortLink), 64)

  await awaitTx(
    dett.BBSCache.methods.link(tx, hexId).send({
      from: contractOwner,
      gas: 240000,
    })
  ).then((receipt) => {
    console.log('#Add ShortLink : '+tx+' '+shortLink)
    shortLinks[tx] = shortLink
  })
}

const addMilestone = async (blockNumber, index) => {
  await awaitTx(
    dett.BBSCache.methods.addMilestone(+blockNumber, index).send({
      from: contractOwner,
      gas: 240000,
    })
  ).then((receipt) => {
    console.log('#Add Milestone : '+blockNumber+'-'+index)
    milestones.push(+blockNumber)
    indexes.push(index)
  })
}

const clone = async () => {
  //delete gh-pages folder
  if (fs.existsSync('gh-pages') && fs.lstatSync('gh-pages').isDirectory())
    await rimraf.sync('gh-pages')

  await gitP().silent(true)
  .clone('https://github.com/pelith/DEXON_BBS', 'gh-pages', ['--single-branch','--branch','gh-pages'])
  .then(() => console.log('#Clone Done.'))
  .catch((err) => console.error('failed: ', err))
}

const syncContract = async () => {
  dett = new Dett()
  await dett.init(web3, Web3)
  const events = await dett.BBSCache.getPastEvents('Link', {fromBlock : 0})

  for (const event of events) {
    const tx = event.returnValues.long
    const shortLink = event.returnValues.short
    shortLinks[tx] = web3.utils.hexToUtf8(shortLink)
  }

  milestones = await dett.BBSCache.methods.getMilestones().call()
  indexes = await dett.BBSCache.methods.getIndexes().call()
  saveLocalStorage()
  console.log('#Sync Done')
}

const saveLocalStorage = () => {
  // if exist create output folder
  if (!(fs.existsSync(outputPath) && fs.lstatSync(outputPath).isDirectory()))
    fs.mkdirSync(outputPath)

  const jsonData = JSON.stringify({'shortLinks':shortLinks,'milestones':milestones,'indexes':indexes}, null, 4)
  fs.writeFileSync(outputJsonPath, jsonData, 'utf8');
}

const loadLocalStorage = () => {
  // if exist create output folder
  if (!(fs.existsSync(outputPath) && fs.lstatSync(outputPath).isDirectory()))
    fs.mkdirSync(outputPath)

  // check dist/output.json
  if (fs.existsSync(outputJsonPath) && fs.lstatSync(outputJsonPath).isFile()) {
    const rawData = fs.readFileSync(outputJsonPath)
    const jsonData = JSON.parse(rawData)

    if (jsonData.hasOwnProperty('shortLinks'))
      shortLinks = jsonData.shortLinks

    if (jsonData.hasOwnProperty('milestones'))
      milestones = jsonData.milestones

    if (jsonData.hasOwnProperty('indexes'))
      indexes = jsonData.indexes
  }
}

export const generateCacheAndShortLink = async () => {

  loadLocalStorage()

  // ############################################
  // #### init Dett

  dett = new Dett()
  await dett.init(web3, Web3)

  // cache init
  const account = dett.cacheweb3.eth.accounts.privateKeyToAccount(`0x${privateKey.toString('hex')}`)
  contractOwner = account.address
  dett.cacheweb3.eth.accounts.wallet.add(account)

  let fromBlock = dett.fromBlock

  const hasLocalMilestones = milestones.length && indexes.length

  if (hasLocalMilestones)
    fromBlock = +milestones[milestones.length-1]

  let events = await dett.BBS.getPastEvents('Posted', {fromBlock : fromBlock})

  // delete lastest cache page block's part
  if (hasLocalMilestones)
    events.splice(0, (+indexes[indexes.length-1]) + 1)

  // ############################################
  // #### Generate Cache && Short link

  let last = 0
  let index = 0
  for (const [i, event] of events.entries()) {
    const tx = event.transactionHash
    const blockNumber = event.blockNumber.toString()
    const link = await dett.BBSCache.methods.links(tx).call()

    // generate short links
    if (!+(link))
      await rpcRateLimiter(() => generateShortLink(tx, blockNumber))

    // generate milestone block index
    if (last === blockNumber) {
      index += 1
    }
    else {
      last = blockNumber
      index = 0
    }

    if ((i+1) % dett.perPageLength === 0) {
      if (!milestones.includes(blockNumber)){
        if (!(indexes[milestones.indexOf(blockNumber)] === index+''))
          await rpcRateLimiter(() => addMilestone(blockNumber, index))
      }
    }
  }

  saveLocalStorage()

  // ############################################
  // #### Generate Cache Page to gh-pages folder

  // clone dett gh-page branch
  await clone()

  // if exist create cache output folder
  if (!(fs.existsSync(cachePath) && fs.lstatSync(cachePath).isDirectory()))
    fs.mkdirSync(cachePath)

  for (const tx of Object.keys(shortLinks))
    await generateShortLinkCachePage(tx, shortLinks[tx])
  console.log('#Generate Cache Page Done.')


  // ############################################
  // #### Commit & push

  git(__dirname + '/../gh-pages/')
  .add('.')
  .commit("Add cache page")
  .push(['-u', 'origin', 'gh-pages'], () => console.log('#Push Done.'));


  // await dett.BBSCache.methods.clearMilestone().send({
  //   from: contractOwner,
  //   // gasPrice: 6000000000,
  //   gas: 210000,
  // })
}

const main = async () => {
  // syncContract()
  await generateCacheAndShortLink()
}

main()
