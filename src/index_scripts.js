// import 'babel-polyfill'

import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, loginDexon} from './dexon.js'
import {htmlEntities, getTitle} from './utils.js'

const banList = ["0xdc0db75c79308f396ed6389537d4ddd2a36c920bb2958ed7f70949b1f9d3375d"]

function main() {
  initDexon(activeDexonRender)

  const BBS = new web3js.eth.Contract(ABIBBS, BBSContract)
  const BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract)

  BBS.getPastEvents({fromBlock : '990000'})
  .then(events => {
    events.slice().reverse().forEach(event => {
      if ( !banList.includes(event.transactionHash) )
        directDisplay(getTitle(event.returnValues.content.substr(0,40)).title, event.transactionHash, event.blockNumber)
    })
  });
}

function countVotes(txHash) {
  const BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract)
  return BBSExt.methods.upvotes(txHash.substr(0,66)).call().then(upvotes => {
    return BBSExt.methods.downvotes(txHash.substr(0,66)).call().then(downvotes => {
      return upvotes - downvotes
    })
  })
}

function directDisplay(content, txHash, blockNumber) {
  content = htmlEntities(content)
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
        <a target="_blank" href="https://dexonscan.app/transaction/${txHash}">
           @${blockNumber}
        </a>
      </div>
      <div class="article-menu"></div>
      <div class="date">...</div>
    </div>`)

  $('.r-list-container.action-bar-margin.bbs-screen').append(elem)

  web3js.eth.getBlock(blockNumber).then(block => {
    const date = new Date(block.timestamp)
    $(elem).find('.date').text((date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0'))
                         .attr('title', date.toLocaleString())
  })

  countVotes(txHash).then(votes => {
    if (votes > 99)
      $(elem).find('.nrec').html(`<span class="hl f1"> ${votes} </span>`)
    else if (votes > 9)
      $(elem).find('.nrec').html(`<span class="hl f3"> ${votes} </span>`)
    else if (votes > 0)
      $(elem).find('.nrec').html(`<span class="hl f2"> ${votes} </span>`)
  })
}

const activeDexonRender = (account) => {
  $("#bbs-login")[0].style.display='none'
  $("#bbs-register")[0].style.display='none'
  $("#bbs-user")[0].style.display=''
  $("#bbs-post")[0].style.display=''
  $("#bbs-user")[0].innerHTML = account.replace(/^(0x.{4}).+(.{4})$/, '$1…$2')
}

$('#bbs-login').click(() => {
  loginDexon(activeDexonRender)
})

$(main)
