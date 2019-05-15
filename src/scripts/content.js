import {htmlEntities, getUrlParameter, getTitle, getUser, getParseText, parseContent} from './utils.js'
import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, BBS, BBSExt, initDexon, loginDexon, newReply, newRewardTransaction} from './dexon.js'

let tx = ''
let account = ''

let isShowReply = false, isShowReplyType = false

const activeDexonRender = (_account) => {
  account = _account

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user").show()
    $('#reward-line').show()

    // only show reply btn at first time
    if (!$("#reply-user").text()) $("#reply-btn").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user").hide()
    $('#reward-line').hide()

    // hide reply btn
    $("#reply-btn").hide()
  }

  $("#bbs-user").text(getUser(account))
  $("#reply-user").text(getUser(account))
}

const showReplyType = async () => {
  $('#reply-btn').hide()

  const voted = await BBSExt.methods.voted(account, tx).call()
  if (voted) return showReply(0)

  $('#reply-type0').show()
  $('#reply-type1').show()
  $('#reply-type2').show()

  isShowReplyType = true
}

const hideReplyTypeBtn = () => {
  $('#reply-type0').hide()
  $('#reply-type1').hide()
  $('#reply-type2').hide()

  isShowReplyType = false
}

const showReply = (type) => {
  hideReplyTypeBtn()

  $('#reply').show()
  $('#reply-send').show()
  $('#reply-cancel').show()

  const typeColor = {
    0: '#fff',
    1: '#ff6',
    2: '#f66',
  }
  $("#reply-type").css('color',typeColor[type])
  $("#reply-type").val(type)

  $("html").stop().animate({scrollTop:$('#reply').position().top}, 500, 'swing')
  $("#reply-content").focus()

  isShowReply = true

}

const hideReply = () => {
  hideReplyTypeBtn()

  $("#reply").hide()
  $('#reply-send').hide()
  $('#reply-cancel').hide()
  $('#reply-btn').show()
  $("#reply-content").val('')

  isShowReply = false
}

const showHideReward = y => {
  // y == null is initial state
  $('#reward-toggle-region-1')[y ? 'hide' : 'show']()
  $('#reward-toggle-region-2')[y ? 'show' : 'hide']()
}

const getAddressLink = (from, __namePool) => {
  // TODO: bind the event to get / substitute name
  return $('<a class="--link-to-addr tooltip" target="_blank"></a>')
    .html(getUser(from)+'<span>('+from+')</span>')
    // .attr('data-address', from)
    .attr('href', 'https://dexscan.app/address/' + from)
}

const main = async () => {
  tx = getUrlParameter('tx')

  if (!tx) return

  if (!tx.match(/^0x[a-fA-F0-9]{64}$/g)) return

  initDexon(activeDexonRender)

  $('#bbs-login').click(() => { loginDexon(activeDexonRender) })

  $('#reply-btn').click(() => { showReplyType() })
  $('#reply-type0').click(() => { showReply(0) })
  $('#reply-type1').click(() => { showReply(1) })
  $('#reply-type2').click(() => { showReply(2) })
  $('#reply-cancel').click(() => { hideReply() })
  $('#reply-send').click(() => { newReply(tx.substr(0,66), $("#reply-type").val(), $("#reply-content").val()) })

  $("#reply-content").blur(() => { $("#reply-content").val(getParseText($("#reply-content").val(), 56)) })

  $('#reward-customize').click(() => showHideReward(true))

  keyboardHook()

  const transaction = await web3js.eth.getTransaction(tx)

  // check transaction to address is bbs contract
  if ([BBSExtContract.toLowerCase(),
       BBSContract.toLowerCase(),
       '0x9b985Ef27464CF25561f0046352E03a09d2C2e0C']
       .map(x => x.toLowerCase())
       .indexOf(transaction.to.toLowerCase()) < 0) {
    $('#main-content-content').text('404 - Page not found.')
    return
  }

  const content = web3js.utils.hexToUtf8('0x' + transaction.input.slice(138))
  const title = getTitle(content.substr(0, 42))
  const contentDisplay = title.match ? content.slice(title.title.length+2) : content

  const contentNodeList = parseContent(contentDisplay.trim(), 'post')

  document.title = title.title + ' - Gossiping - DEXON BBS'

  const authorLink = $('<a class="--link-to-addr hover" target="_blank"></a>')
                    .text(getUser(transaction.from))
                    .attr('data-address', transaction.from)
                    .attr('href', 'https://dexscan.app/address/' + transaction.from)
  $('#main-content-author').append(authorLink)

  // $('#main-content-author').attr('href', 'https://dexonscan.app/address/'+transaction.from)
  $('#main-content-title').text(title.title)

  $('.--send-reward').click(evt => {
    const _ = $(evt.currentTarget)
    // _.prop('disabled', true)
    return newRewardTransaction(transaction.from, _.attr('data-value').toString())
    .on('transactionHash', txhash => {
      console.log('tx hash', txhash)
      // _.prop('disabled', false)
    })
  })
  $('#reward-custom-submit').click(evt => {
    const _ = $('#reward-custom-value')
    // _.prop('disabled', true)
    return newRewardTransaction(transaction.from, _.val())
    .on('transactionHash', txhash => {
      console.log('tx hash', txhash)
      // _.prop('disabled', false)
    })
    .finally(() => showHideReward(false))
  })

  const elContent = $('#main-content-content')
  contentNodeList.forEach(el => elContent.append(el))

  web3js.eth.getBlock(transaction.blockNumber).then(block => {
    $('#main-content-date').text((''+new Date(block.timestamp)).substr(0,24))
  })
  $('#main-content-href').attr('href', window.location.href)
  $('#main-content-href').text(window.location.href)
  $('#main-content-from').text('@'+transaction.blockNumber)
  $('#main-content-from').attr('href', 'https://dexonscan.app/transaction/'+tx)

  const events = await BBSExt.getPastEvents({fromBlock : '990000'})

  events.slice().filter((event) => {return tx == event.returnValues.origin})
  .map(async (event) => {
    const [transaction, block] = await Promise.all([
      web3js.eth.getTransaction(event.transactionHash),
      web3js.eth.getBlock(event.blockNumber),
    ])
    return [event.returnValues.content, transaction.from, block.timestamp, event.returnValues.vote]
  })
  .reduce( async (n,p) => {
    await n
    displayReply(...await p)
  }, Promise.resolve())
}

const keyboardHook = () => {
  const returnCode = 13

  $(document).keyup((e) => {
    if (!isShowReply && !isShowReplyType && e.keyCode == 'X'.charCodeAt()) {
      showReplyType()
    }
    else if (!isShowReply && isShowReplyType) {
      switch (e.key) {
        case '1': return showReply(1)
        case '2': return showReply(2)
        case '3': return showReply(0)
      }
    }
    else if ( isShowReply && !isShowReplyType && e.ctrlKey && e.keyCode == returnCode) {
      if ($("#reply-content").val().length > 0)
        newReply(tx, $("#reply-type").val(), $("#reply-content").val())
      else
        hideReply()
    }
  })
}

const displayReply = (content, from, timestamp, vote) => {
  const contentNodeList = parseContent(content)
  const voteName = ["→", "推", "噓"]
  const elem = $('<div class="push"></div>')
  const date = new Date(timestamp)
  const formatDate = (date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0')+' '+(''+date.getHours()).padStart(2, '0')+':'+(''+date.getMinutes()).padStart(2, '0')

  elem.html(`<span class="${vote != 1 ? 'f1 ' : ''}hl push-tag">${voteName[vote]} </span>`)

  const authorNode = $('<span class="f3 hl push-userid"></span>')
  authorNode.append(getAddressLink(from))
  elem.append(authorNode)

  const contentNode = $('<span class="f3 push-content">: </span>')
  contentNodeList.forEach(el => contentNode.append(el))
  elem.append(contentNode)

  elem.append(`<span class="push-ipdatetime">${formatDate}</span>`)
  $('#main-content.bbs-screen.bbs-content').append(elem)
}

$(main)


