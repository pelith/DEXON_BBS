import {htmlEntities, getUrlParameter, getTitle, getUser} from './utils.js'
import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon} from './dexon.js'

function main() {
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
}

function newReply(vote, content) {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet first.')
    return
  }

  if (![0, 1, 2].includes(vote)){
    alert('Wrong type of vote.')
    return
  }

  if (content.length === 0){
    alert('No content.')
    return
  }

  const tx = getUrlParameter('tx').substr(0,66)
  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    dexBBSExt.methods.Reply(tx, vote, content).send({ from: activeAccount })
    .then(receipt => {
      window.location.reload()
    })
    .catch(err => {
      alert(err)
    })
  }
}

const activeDexonRender = (account) => {
  $("#bbs-login")[0].style.display='none'
  $("#bbs-register")[0].style.display='none'
  $("#bbs-user")[0].style.display=''
  $("#bbs-user")[0].innerHTML = getUser(account)
}

$('#bbs-login').click(() => {
  initDexon(activeDexonRender)
})

$(main)


$("#reply-area").attr('rel', 'gallery').fancybox()

$('#submit-reply').click(() => {
  const vote = $("input[name='vote']:checked").val() * 1
  const content = $("#reply-content").val()
  newReply(vote, content)
})

