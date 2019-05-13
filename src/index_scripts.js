import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, BBS, BBSExt initDexon, loginDexon} from './dexon.js'
import {htmlEntities, getTitle, getUser} from './utils.js'

let account = ''

const main = async () => {
  initDexon(activeDexonRender)

  $('#bbs-login').click(() => { loginDexon(activeDexonRender) })

  const events = await BBS.getPastEvents({fromBlock : '1170000'})

  events.slice().reverse().map(async (event) => {
    const txHash = event.transactionHash
    const transaction = await web3js.eth.getTransaction(txHash)
    const block = await web3js.eth.getBlock(event.blockNumber)
    const votes = await countVotes(event.transactionHash)

    return  [event.returnValues.content, txHash, transaction.from, block.timestamp, votes]
  })
  .reduce( async (n,p) => {
    await n
    directDisplay(...await p)
  }, Promise.resolve())
}

const countVotes = async (txHash) => {
  const tx = txHash.substr(0, 66)
  const upvotes = await BBSExt.methods.upvotes(tx).call()
  const downvotes = await BBSExt.methods.downvotes(tx).call()

  return upvotes - downvotes
}

const directDisplay = (content, txHash, from, timestamp, votes) => {
  content = htmlEntities(getTitle(content.substr(0, 42)).title)
  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"></div>
    <div class="title">
    <a href="content.html?tx=${txHash}">
      ${content}
    </a>
    </div>
    <div class="meta">
      <div class="author">
        <a>
          ${getUser(from)}
        </a>
      </div>
      <div class="article-menu"></div>
      <div class="date">...</div>
    </div>`)

  $('.r-list-container.action-bar-margin.bbs-screen').append(elem)

  const date = new Date(timestamp)
  $(elem).find('.date').text((date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0'))
                       .attr('title', date.toLocaleString())

  if (votes > 0){
    let _class = 'hl f2'
    if (votes > 99) _class = 'hl f1'
    else if (votes > 9) _class = 'hl f3'
    $(elem).find('.nrec').html(`<span class="${_class}"> ${votes} </span>`)
  }
}

const activeDexonRender = (account) => {
  account = getUser(account)

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user").show()

    // show post btn
    $("#bbs-post").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user").hide()

    // hide post btn
    $("#bbs-post").show()
  }

  $("#bbs-user").text(account)
}

$(main)
