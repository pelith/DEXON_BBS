import Dexon from './dexon.js'
import Dett from './dett.js'

import {htmlEntities, getUrlParameter, parseUser, parseText, parseContent} from './utils.js'

let dett = null
let tx = '', account = ''

let isShowReply = false, isShowReplyType = false

const render = (_account) => {
  account = _account
  dett.account = account

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user-menu").show()
    $('#reward-line').show()

    // only show reply btn at first time
    if (!$("#reply-user").text()) $("#reply-btn").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user-menu").hide()
    $('#reward-line').hide()

    // hide reply btn
    $("#reply-btn").hide()
  }

  $("#bbs-user").text(parseUser(account))
  $("#reply-user").text(parseUser(account))
}

const showReplyType = async () => {
  $('#reply-btn').hide()

  const voted = await dett.getVoted(tx)
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
    .html(parseUser(from)+'<span>('+from+')</span>')
    // .attr('data-address', from)
    .attr('href', 'https://dexscan.app/address/' + from)
}

const error = () => { $('#main-content-content').text('404 - Page not found.') }

const main = async () => {
  // get tx
  tx = getUrlParameter('tx')
  if (!tx) return error()
  if (!tx.match(/^0x[a-fA-F0-9]{64}$/g)) return error()

  const _dexon = new Dexon(window.dexon)
  _dexon.on('update',(account) => {
    render(account)
  })

  $('#bbs-login').click(() => { _dexon.login() })

  dett = new Dett(_dexon.dexonWeb3)

  $('#reply-btn').click(() => { showReplyType() })
  $('#reply-type0').click(() => { showReply(0) })
  $('#reply-type1').click(() => { showReply(1) })
  $('#reply-type2').click(() => { showReply(2) })
  $('#reply-cancel').click(() => { hideReply() })
  $('#reply-send').click(() => { dett.reply(tx, $("#reply-type").val(), $("#reply-content").val()) })

  $("#reply-content").blur(() => { $("#reply-content").val(parseText($("#reply-content").val(), dett.commentLength)) })

  $('#reward-customize').click(() => showHideReward(true))

  keyboardHook()

  const article = await dett.getArticle(tx)

  // check transaction to address is bbs contract
  if (!article) return error()

  const contentNodeList = parseContent(article.content, 'post')

  document.title = article.title + ' - Gossiping - DEXON BBS'

  const authorLink = $('<a class="--link-to-addr hover" target="_blank"></a>')
                    .text(parseUser(article.transaction.from))
                    .attr('data-address', article.transaction.from)
                    .attr('href', 'https://dexscan.app/address/' + article.transaction.from)
  $('#main-content-author').append(authorLink)

  $('#main-content-title').text(article.title)

  $('.--send-reward').click(evt => {
    const _ = $(evt.currentTarget)
    // _.prop('disabled', true)
    return dett.rewardAuthor(article, _.attr('data-value').toString())
    .on('transactionHash', txhash => {
      console.log('tx hash', txhash)
      // _.prop('disabled', false)
    })
  })
  $('#reward-custom-submit').click(evt => {
    const _ = $('#reward-custom-value')
    // _.prop('disabled', true)
    if (!_.val().length) {
      showHideReward(false)
      return Promise.resolve()
    }
    return dett.rewardAuthor(article, _.val())
    .on('transactionHash', txhash => {
      console.log('tx hash', txhash)
      // _.prop('disabled', false)
    })
    .finally(() => showHideReward(false))
  })

  const elContent = $('#main-content-content')
  contentNodeList.forEach(el => elContent.append(el))

  $('#main-content-date').text((''+new Date(article.block.timestamp)).substr(0,24))

  $('#main-content-href').attr('href', window.location.href)
  $('#main-content-href').text(window.location.href)
  $('#main-content-from').text('@'+article.transaction.blockNumber)
  $('#main-content-from').attr('href', 'https://dexonscan.app/transaction/'+tx)

  const comments = await dett.getComments(tx)

  comments.reduce( async (n,p) => {
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
        dett.reply(tx, $("#reply-type").val(), $("#reply-content").val())
      else
        hideReply()
    }
  })
}

const displayReply = (comment) => {
  const contentNodeList = parseContent(comment.content)
  const voteName = ["→", "推", "噓"]
  const elem = $('<div class="push"></div>')
  const date = new Date(comment.timestamp)
  const formatDate = (date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0')+' '+(''+date.getHours()).padStart(2, '0')+':'+(''+date.getMinutes()).padStart(2, '0')

  elem.html(`<span class="${comment.vote != 1 ? 'f1 ' : ''}hl push-tag">${voteName[comment.vote]} </span>`)

  const authorNode = $('<span class="f3 hl push-userid"></span>')
  authorNode.append(getAddressLink(comment.author))
  elem.append(authorNode)

  const contentNode = $('<span class="f3 push-content">: </span>')
  contentNodeList.forEach(el => contentNode.append(el))
  elem.append(contentNode)

  elem.append(`<span class="push-ipdatetime">${formatDate}</span>`)
  $('#main-content.bbs-screen.bbs-content').append(elem)
}

$(main)


