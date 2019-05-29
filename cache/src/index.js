import Web3 from 'web3'
import dotenv from 'dotenv/config'

import { pRateLimit } from 'p-ratelimit'
import Dett from './dett.js'
import fs from 'fs'
import { parseText } from './utils.js'

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



async function cache(block) {
  const events = await BBS.getPastEvents('Posted', {fromBlock : block})
  events.forEach(async (event) => {
    // console.log(await shortURLandMilestone.methods.links(event.transactionHash).call())
    const shortLinkHex = await shortURLandMilestone.methods.links(event.transactionHash).call()
    // console.log(shortLinkHex)
    if (shortLinkHex != '0x0000000000000000000000000000000000000000000000000000000000000000') {
      const article = await dett.getArticle(event.transactionHash, false).catch(console.log)
      const shortLink = cacheNet.utils.hexToUtf8(shortLinkHex)
      const title = article.title
      const url = 'https://dett.cc/' + shortLink + '.html'
      const description = parseText(article.content, 160).replace(/\n|\r/g, ' ')
      const cacheMeta = { 'Cache - DEXON BBS': title, 'https://dett.cc/cache.html': url, 'Cache Cache Cache Cache Cache': description }
      const reg = new RegExp(Object.keys(cacheMeta).join("|"),"gi")
      const template = fs.readFileSync('build/cache.html', 'utf-8')
      const cacheFile = template.replace(reg, (matched) => {
        return cacheMeta[matched]
      });
      const fileName = 'build/' + shortLink + '.html'

      fs.writeFileSync(fileName, cacheFile, 'utf8')
    }
  })
}


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
  const originalId = ShortURL.encode(dett.cacheweb3.utils.hexToNumber(tx.substr(0,10))).padStart(6,'0')
  const hexId = dett.cacheweb3.utils.padLeft(dett.cacheweb3.utils.toHex(originalId), 64)

  await Promise.resolve([
    await dett.BBSCache.methods.link(tx, hexId).send({
      from: contractOwner,
      gas: 240000,
    }).on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber == 1)
        ;// console.log(receipt)
    }).catch(err => {
      console.log(err)
    })
  ])
}

const addMilestone = async (block, index) => {
  await Promise.resolve([
    dett.BBSCache.methods.addMilestone(block, index).send({
      from: contractOwner,
      gas: 240000,
    }).on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber == 1)
        console.log(receipt)
    }).catch(err => {
      console.log(err)
    })
  ])
}



const main = async () => {
  dett = new Dett(web3)
  await dett.init(Web3)

  // cache init
  const account = dett.cacheweb3.eth.accounts.privateKeyToAccount(`0x${privateKey.toString('hex')}`)
  contractOwner = account.address
  dett.cacheweb3.eth.accounts.wallet.add(account)

  const milestones = await dett.BBSCache.methods.getMilestones().call()
  console.log(milestones)

  const indexes = await dett.BBSCache.methods.getIndexes().call()
  console.log(indexes)

  const fromBlock = milestones.length!==0 ? +milestones[milestones.length-1]: dett.fromBlock

  let events = await dett.BBS.getPastEvents('Posted', {fromBlock : fromBlock})

  console.log(events.length)

  if ((milestones.length !== 0) && (indexes.length !== 0)){
    events.splice(0, (+indexes[indexes.length-1])+1)
    console.log(events.length)
  }


  // generate cache
  let last = 0
  let index = 0
  for (const [i, event] of events.entries()) {

    // generate links
    if (!+(await dett.BBSCache.methods.links(event.transactionHash).call())) {
      await rpcRateLimiter(() => generateShortLink(event.transactionHash))
    }

    // generate milestone block index
    if (last === event.blockNumber) {
      index+=1
    }
    else {
      last = event.blockNumber
      index = 0
    }

    if ((i+1) % dett.perPageLength === 0) {
      console.log(event.blockNumber, index)
      if ( !milestones.includes(event.blockNumber+'')){
        if ( !(indexes[milestones.indexOf(event.blockNumber+'')] === index+''))
          await rpcRateLimiter(() => addMilestone(event.blockNumber, index))
      }
    }
  }

  console.log('######')



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

  return
}

main()
