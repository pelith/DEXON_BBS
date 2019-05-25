import dotenv from 'dotenv/config'
import keythereum from 'keythereum'
import Hashids from 'hashids'
import Web3 from 'web3'
import { pRateLimit } from 'p-ratelimit'
import Dett from '../src/scripts/dett.js'
import fs from 'fs'
import { parseText } from '../src/scripts/utils.js'

import keystore from './keystore.json'
const keypassword = process.env.KEY_PASSWORD
const gasMultiply = 1.2
const minPostsPerPage = 10

const ABIBBS = [{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"content","type":"string"}],"name":"Posted","type":"event"}]
const BBSContract = '0x663002C4E41E5d04860a76955A7B9B8234475952'
const ABICache = [{"constant":false,"inputs":[{"name":"long","type":"bytes32"},{"name":"short","type":"bytes32"},{"name":"cur","type":"uint256"}],"name":"link","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"time","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"milestone","type":"uint256"},{"name":"cur","type":"uint256"}],"name":"addMilestone","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMilestones","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"links","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"clearMilestone","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"long","type":"bytes32"},{"indexed":false,"name":"short","type":"bytes32"},{"indexed":false,"name":"time","type":"uint256"}],"name":"Link","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]
const BBSCacheContract = '0x5c10A77454cF98B273F54199DE3454ae2586e7A4'
const mainnet = new Web3('wss://mainnet-rpc.dexon.org/ws')
const BBS = new mainnet.eth.Contract(ABIBBS, BBSContract)
const dett = new Dett(mainnet)

const cacheNet = new Web3(process.env.RPC_URL)
const privateKey = keythereum.recover(keypassword, keystore)
const accountObj = cacheNet.eth.accounts.privateKeyToAccount(`0x${privateKey.toString('hex')}`)
const contractOwner = accountObj.address
cacheNet.eth.accounts.wallet.add(accountObj)
const shortURLandMilestone = new cacheNet.eth.Contract(ABICache, BBSCacheContract)
const rpcRateLimiter = pRateLimit({
  // TODO: configurable limit arguments for different network
  interval: 2500,
  rate: 1,
  concurrency: 1,
})

async function shortArticleHash(tx) {
  const transaction = await mainnet.eth.getTransaction(tx)

  // check transaction to address is bbs contract
  if (!dett.isDettTx(transaction.to)) return null

  const hashids = new Hashids('DEXON_BBS', 6, 'abcdefghijklmnopqrstuvwxyz1234567890')
  const oriId = hashids.encode(cacheNet.utils.hexToNumberString(tx))
  const hex = cacheNet.utils.padLeft(cacheNet.utils.toHex(oriId), 64)
  // const mapId = cacheNet.utils.hexToUtf8(hex)
  // console.log([transaction.blockNumber, tx, oriId, mapId, hex])
  console.log(tx)
  // console.log(await shortURLandMilestone.methods.link(tx, hex, transaction.blockNumber))
  // return
  await Promise.resolve([
    shortURLandMilestone.methods.link(tx, hex, transaction.blockNumber).send({
      from: contractOwner,
      gas: 210000,
    }).on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber == 1)
        console.log(receipt)
    }).catch(err => {
      console.log(err)
    })
  ])
}

async function getArticles(block) {
  const events = await BBS.getPastEvents('Posted', {fromBlock : block})

  events.forEach(async (event) => {
    // console.log(await shortURLandMilestone.methods.links(event.transactionHash).call())
    if (await shortURLandMilestone.methods.links(event.transactionHash).call() == '0x0000000000000000000000000000000000000000000000000000000000000000') {
      await rpcRateLimiter(() => shortArticleHash(event.transactionHash))
    }
  })
}

async function addMilestone(block, time) {
  await Promise.resolve([
    shortURLandMilestone.methods.addMilestone(block, time).send({
      from: contractOwner,
      gas: 210000,
    }).on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber == 1)
        console.log(receipt)
    }).catch(err => {
      console.log(err)
    })
  ])
}

async function checkMilestones() {
  const time = await shortURLandMilestone.methods.time().call()
  const eventFrom = time.toString() ? time.toString() : '0'
  // console.log(eventFrom.toString())
  const events = await shortURLandMilestone.getPastEvents('Link', { fromBlock : eventFrom })
  // console.log(events)
  let eventBlocks = events.map((event) => {
      return event.returnValues['time'].toString()
  })
  // console.log(eventBlocks)

  let countPost = {}
  eventBlocks.forEach((x) => { countPost[x] = (countPost[x] || 0) + 1 })
  // console.log(countPost)

  let pageSize = 0
  Object.keys(countPost).forEach(async (block) => {
    pageSize += countPost[block]
    // console.log(pageSize)
    if (pageSize >= minPostsPerPage) {
      pageSize = 0

      const time = events.map((event) => {
          return event.returnValues['time'].toString() == block ? event.blockNumber : null
      }).slice().reverse().find(function(element) {
        return element != null
      })
      // console.log(time)

      await rpcRateLimiter(() => addMilestone(block, time))
      // console.log(block)
    }
  })

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
}


async function cache(block) {
  const events = await BBS.getPastEvents('Posted', {fromBlock : block})
  events.forEach(async (event) => {
    // console.log(await shortURLandMilestone.methods.links(event.transactionHash).call())
    let shortLinkHex = await shortURLandMilestone.methods.links(event.transactionHash).call()
    // console.log(shortLinkHex)
    if (shortLinkHex != '0x0000000000000000000000000000000000000000000000000000000000000000') {
      let shortLink = cacheNet.utils.hexToUtf8(shortLinkHex)
      let title = parseText(event.returnValues.content, 40).replace(/\n|\r/g, ' ')
      let url = 'https://dett.cc/' + shortLink + '.html'
      let description = parseText(event.returnValues.content, 160).replace(/\n|\r/g, ' ')
      let cacheMeta = { 'Cache - DEXON BBS': title, 'https://dett.cc/cache.html': url, 'Cache Cache Cache Cache Cache': description }
      let reg = new RegExp(Object.keys(cacheMeta).join("|"),"gi")
      let template = fs.readFileSync('build/cache.html', 'utf-8')
      let cacheFile = template.replace(reg, (matched) => {
        return cacheMeta[matched]
      });
      let fileName = 'build/' + shortLink + '.html'

      fs.writeFileSync(fileName, cacheFile, 'utf8')
    }
  })
}


async function main() {
  
  const milestones = await shortURLandMilestone.methods.getMilestones().call()
  // console.log(milestones)
  const postFrom = milestones.length ? milestones[milestones.length-1] * 1 + 1 : '1170000'
  await getArticles(postFrom)
  await checkMilestones()
  await cache('1170000')
  

  /*
  await shortURLandMilestone.methods.clearMilestone().send({
    from: contractOwner,
    gasPrice: 6000000000,
    gas: 120000,
  })
  */
}

main()
