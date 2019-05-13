import {htmlEntities, getUrlParameter, getTitle, getUser, getParseText} from './utils.js'
import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, loginDexon, newReply} from './dexon.js'

let tx = ''
let account = ''

let isShowReply = false, isShowReplyType = false

const activeDexonRender = (account) => {
  account = getUser(account)

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user").show()

    // only show reply btn at first time
    if (!$("#reply-user").text()) $("#reply-btn").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user").hide()

    // hide reply btn
    $("#reply-btn").hide()
  }

  $("#bbs-user").text(account)
  $("#reply-user").text(account)
}

const showReplyType = () => {
  $('#reply-btn').hide()
  $('#reply-type0').show()
  $('#reply-type1').show()
  $('#reply-type2').show()

  isShowReplyType = true
}

const hideReplyTypeBtn = () => {
  $('#reply-type0').hide()
  $('#reply-type1').hide()
  $('#reply-type2').hide()
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
  isShowReplyType = false
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

const main = async () => {
  tx = getUrlParameter('tx')

  if (!tx) return

  initDexon(activeDexonRender)

  $('#bbs-login').click(() => { loginDexon(activeDexonRender) })

  $('#reply-btn').click(() => { showReplyType() })
  $('#reply-type0').click(() => { showReply(0) })
  $('#reply-type1').click(() => { showReply(1) })
  $('#reply-type2').click(() => { showReply(2) })
  $('#reply-cancel').click(() => { hideReply() })
  $('#reply-send').click(() => { newReply(tx.substr(0,66), $("#reply-type").val(), $("#reply-content").val()) })

  $("#reply-content").blur(() => { $("#reply-content").val(getParseText($("#reply-content").val(), 56)) })

  keyboardHook()

  const transaction = await web3js.eth.getTransaction(tx)

  const content = htmlEntities(web3js.utils.hexToUtf8('0x' + transaction.input.slice(138)))
  const title = getTitle(content.substr(0, 42))
  const contentDisplay = title.match ? content.slice(title.title.length+2) : content
  const contentNormalized = contentDisplay.trim()
    .replace(/\n\s*?\n+/g, '\n\n')

  document.title = title.title + ' - Gossiping - DEXON BBS'
  $('#main-content-author').text(getUser(transaction.from))
  // $('#main-content-author').attr('href', 'https://dexonscan.app/address/'+transaction.from)
  $('#main-content-title').text(title.title)
  $('#main-content-content').text(contentNormalized)
  web3js.eth.getBlock(transaction.blockNumber).then(block => {
    $('#main-content-date').text((''+new Date(block.timestamp)).substr(0,24))
  })
  $('#main-content-href').attr('href', window.location.href)
  $('#main-content-href').text(window.location.href)
  $('#main-content-from').text('@'+transaction.blockNumber)
  $('#main-content-from').attr('href', 'https://dexonscan.app/transaction/'+tx)


  const BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract)
  const originTx = getUrlParameter('tx').substr(0,66)
  const events = await BBSExt.getPastEvents({fromBlock : '990000'})

  events.slice().filter((event) => {return originTx == event.returnValues.origin})
  .map(async (event) => {
    const transaction = await web3js.eth.getTransaction(event.transactionHash)
    const block = await web3js.eth.getBlock(event.blockNumber)
    return [event.returnValues.content, transaction.from, block.timestamp, event.returnValues.vote]
  })
  .reduce( async (n,p) => {
    await n
    displayReply(...await p)
  }, Promise.resolve())
}

const keyboardHook = () => {
  const ctrlKey = 17, returnCode = 13
  let ctrlDown = false

  $(document).keydown((e) => { if (e.keyCode == ctrlKey) ctrlDown = true})
             .keyup((e) => {if (e.keyCode == ctrlKey) ctrlDown = false})

  $(document).keyup((e) => {
    if (!isShowReply && !isShowReplyType && e.keyCode == 'X'.charCodeAt()) {
      showReplyType()
    }
    else if (!isShowReply && isShowReplyType && '1'.charCodeAt() <= e.keyCode && e.keyCode <= '3'.charCodeAt()) {
      if ( e.key == '1' ) showReply(1)
      else if ( e.key == '2' ) showReply(2)
      else if ( e.key == '3' ) showReply(0)
    }
    else if ( isShowReply && !isShowReplyType && ctrlDown && e.keyCode == returnCode) {
      if ($("#reply-content").val().length > 0)
        newReply(tx.substr(0,66), $("#reply-type").val(), $("#reply-content").val())
      else
        hideReply()
    }
  })
}

const displayReply = (content, from, timestamp, vote) => {
  content = htmlEntities(content)
  const voteName = ["→", "推", "噓"]
  const elem = $('<div class="push"></div>')
  const date = new Date(timestamp)
  const formatDate = (date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0')+' '+(''+date.getHours()).padStart(2, '0')+':'+(''+date.getMinutes()).padStart(2, '0')

  elem.html(`<span class="${vote != 1 ? 'f1 ' : ''}hl push-tag">${voteName[vote]} </span><span class="f3 hl push-userid">${getUser(from)}</span><span class="f3 push-content">: ${content}</span><span class="push-ipdatetime">${formatDate}</span>`)
  $('#main-content.bbs-screen.bbs-content').append(elem)
}

$(main)


