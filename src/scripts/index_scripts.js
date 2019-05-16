import Dexon from './dexon.js'
import Dett from './dett.js'

import {htmlEntities, parseUser} from './utils.js'

let account = ''

const render = (_account) => {
  account = _account

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    // $("#bbs-user-menu").show()

    // show post btn
    $("#bbs-post").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    // $("#bbs-user-menu").hide()

    // hide post btn
    $("#bbs-post").hide()
  }

  $("#bbs-user").text(parseUser(account))
}

const main = async () => {
  const _dexon = new Dexon(window.dexon)
  _dexon.on('update',(account) => {
    render(account)
  })

  $('#bbs-login').click(() => { _dexon.login() })

  const dett = new Dett(_dexon.dexonWeb3)

  const articles = await dett.getArticles()

  articles.reduce( async (n,p) => {
    await n
    directDisplay(...await p)
  }, Promise.resolve())
}

const directDisplay = (article, votes, banned) => {
  if (banned) return

  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"></div>
    <div class="title">
    <a href="content.html?tx=${article.transaction.hash}">
      ${htmlEntities(article.title)}
    </a>
    </div>
    <div class="meta">
      <div class="author">
        <a class="--link-to-addr hover" href="https://dexscan.app/address/${article.author}" target="_blank" data-address="${article.author}">
          ${parseUser(article.author)}
        </a>
      </div>
      <div class="article-menu"></div>
      <div class="date">...</div>
    </div>`)

  $('.r-list-container.action-bar-margin.bbs-screen').append(elem)

  const date = new Date(article.timestamp)
  $(elem).find('.date').text((date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0'))
                       .attr('title', date.toLocaleString())

  // render votes num
  if (votes > 0){
    let _class = 'hl f2'
    if (votes > 99) _class = 'hl f1'
    else if (votes > 9) _class = 'hl f3'
    else if (-10 >= votes  && votes >= -99) _class = 'hl f5', votes='X'+Math.floor(votes*-1)
    else if (votes<=-100)  _class = 'hl f5', votes='XX'

    $(elem).find('.nrec').html(`<span class="${_class}"> ${votes} </span>`)
  }
}

$(main)
