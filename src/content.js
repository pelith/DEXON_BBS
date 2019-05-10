import {htmlEntities, getUrlParameter, getTitle, getUser} from './utils.js'
import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, loginDexon, newReply} from './dexon.js'

function main() {
  initDexon(activeDexonRender)

  $('#bbs-reply-btn').click(() => {
    $("#bbs-reply")[0].style.display=''
    $("#bbs-reply-content")[0].focus()
  })

  const tx = getUrlParameter('tx')
  if (tx){
    web3js.eth.getTransaction(tx).then(transaction => {
      const content = htmlEntities(web3js.utils.hexToUtf8('0x'+transaction.input.slice(138)))
      const author = '@'+transaction.blockNumber
      const title = getTitle(content.substr(0, 40))

      document.title = title.title + ' - Gossiping - DEXON BBS'
      $('#main-content-author')[0].innerHTML = author
      $('#main-content-author')[0].href = 'https://dexonscan.app/transaction/'+tx
      $('#main-content-title')[0].innerHTML = title.title
      $('#main-content-content')[0].innerHTML = title.match ? content.slice(title.title.length+2) : content
      web3js.eth.getBlock(transaction.blockNumber).then(block => {
        $('#main-content-date').text((''+new Date(block.timestamp)).substr(0,24))
      })
      $('#main-content-href')[0].href = window.location.href
      $('#main-content-href')[0].innerHTML = window.location.href
      $('#main-content-from').text(getUser(transaction.from))
    })
  }


  const BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract)
  const originTx = getUrlParameter('tx').substr(0,66)
  BBSExt.getPastEvents({fromBlock : '990000'})
  .then(events => {
    events.slice().forEach(event => {
      if (originTx == event.returnValues.origin)
        displayReply(event.returnValues.vote, event.returnValues.content, event.transactionHash, event.blockNumber)
    })
  });
}

function displayReply(vote, content, txHash, blockNumber) {
  content = htmlEntities(content)
  const voteName = ["→", "推", "噓"]
  const voteTag = ["→", "推", "噓"]
  const elem = $('<div class="push"></div>')

  web3js.eth.getTransaction(txHash).then(transaction => {
    $(elem).find('.push-userid').text(getUser(transaction.from))
  })

  elem.html(`<span class="${vote != 1 ? 'f1 ' : ''}hl push-tag">${voteName[vote]} </span><span class="f3 hl push-userid"></span><span class="f3 push-content">: ${content}</span><span class="push-ipdatetime"></span>`)
  $('#main-content.bbs-screen.bbs-content').append(elem)

  web3js.eth.getBlock(blockNumber).then(block => {
    const date = new Date(block.timestamp)
    $(elem).find('.push-ipdatetime').text((date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0')+' '+(''+date.getHours()).padStart(2, '0')+':'+(''+date.getMinutes()).padStart(2, '0'))
  })
}

const activeDexonRender = (account) => {
  $("#bbs-login")[0].style.display='none'
  $("#bbs-register")[0].style.display='none'
  $("#bbs-user")[0].style.display=''
  $("#bbs-user")[0].innerHTML = getUser(account)
  $("#bbs-reply-user")[0].innerHTML=getUser(account)
  $("#bbs-reply-btn")[0].style.display=''
  
}

$('#bbs-login').click(() => {
  loginDexon(activeDexonRender)
})

$(main)

$('#bbs-newReply').click(() => {
  const replyType = $("#bbs-reply-type")[0].value
  const content = $("#bbs-reply-content")[0].value
  newReply(getUrlParameter('tx').substr(0,66), replyType, content)
})

