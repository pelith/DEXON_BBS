import Dett from './dett.js'

import {htmlEntities, parseUser} from './utils.js'

let focusPost

const render = (_account) => {
  _account ? $("#bbs-post").show() : $("#bbs-post").hide()
}

const main = async () => {
  _dexon.on('update',(account) => {
    render(account)
  })

  const dett = new Dett(_dexon.dexonWeb3)

  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()

  const articles = await dett.getArticles()

  articles.reduce( async (n,p) => {
    await n
    directDisplay(...await p)
  }, Promise.resolve())
}

const focusOnPost = (post, scroll) => {
  if (focusPost) {
    $(focusPost).removeClass('focus')
  }
  focusPost = post
  $(focusPost).addClass('focus')
  if (scroll) {
    focusPost.scrollIntoView(false)
  }
  // TODO: write cookie?
}

const keyboardHook = () => {
  const upCode = 38, rightCode = 39, downCode = 40
  $(document).keydown((e) => {
    if (e.keyCode === upCode) {
      let posts = $('.r-list-container > .r-ent')
      if (posts.length === 0) {
        return
      }
      e.preventDefault()
      for (let i = 1; i < posts.length; ++i) {
        if (posts[i] === focusPost) {
          focusOnPost(posts[i - 1], true)
          return
        }
      }
      focusOnPost(posts[posts.length - 1], true)
      return
    }
    if (e.keyCode === downCode) {
      let posts = $('.r-list-container > .r-ent')
      if (posts.length === 0) {
        return
      }
      e.preventDefault()
      for (let i = 0; i < posts.length - 1; ++i) {
        if (posts[i] === focusPost) {
          focusOnPost(posts[i + 1], true)
          return
        }
      }
      focusOnPost(posts[0], true)
      return
    }
    if (e.keyCode == rightCode && focusPost) {
      window.location = $('.title > a', focusPost).attr('href')
    }
  })
}

const directDisplay = (article, votes, banned) => {
  if (banned) return

  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"></div>
    <div class="title">
    <a href="content?tx=${article.transaction.hash}">
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
  let _class
  if (votes > 99)
    _class = 'hl f1'
  else if (votes > 9)
    _class = 'hl f3'
  else if (votes > 0)
    _class = 'hl f2'
  else if (-10 >= votes  && votes >= -99)
    _class = 'hl f5', votes='X'+Math.floor(votes*-1)
  else if (votes<=-100)
    _class = 'hl f5', votes='XX'

  if (_class) {
    $(elem).find('.nrec').html(`<span class="${_class}"> ${votes} </span>`)
  }
}

$(main)
