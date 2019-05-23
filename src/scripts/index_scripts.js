import Dett from './dett.js'

import {htmlEntities, parseUser} from './utils.js'

let dett = null
let focusPost

const render = (_account) => {
  dett.account = _account
  if (_account) {
    $("#bbs-post").show()
    $(".article-menu > .trigger").show()
  }
  else {
    $("#bbs-post").hide()
    $(".article-menu > .trigger").hide()
  }
}

const main = async ({ _dexon }) => {
  _dexon.on('update',(account) => {
    render(account)
  })

  dett = new Dett(_dexon.dexonWeb3)
  await dett.init()

  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()

  const articles = await dett.getArticles()

  await articles.reduce( async (n,p) => {
    await n
    directDisplay(...await p)
  }, Promise.resolve())

  if (+window.localStorage.getItem('focus-state')===2){
    const post =  $('.r-list-container > .r-ent > div > a[href="'+window.localStorage.getItem('focus-href')+'"]')
    focusOnPost(post.parent().parent()[0], true)
    window.localStorage.setItem('focus-href', '')
    window.localStorage.setItem('focus-state', 0)
  }

  if (dett.account) {
    const meta = await dett.getMetaByAddress(dett.account)
    _dexon.emit('_setMeta', meta)
  }

  attachDropdown()
}

const attachDropdown = () => {
  $('.article-menu > .trigger').click((e) => {
      var isShown = e.target.parentElement.classList.contains('shown');
      $('.article-menu.shown').toggleClass('shown');
      if (!isShown) {
          e.target.parentElement.classList.toggle('shown');
      }
      e.stopPropagation();
  })

  $(document).click((e) => { $('.article-menu.shown').toggleClass('shown') })
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
      const href = $('.title > a', focusPost).attr('href')
      window.localStorage.setItem('focus-href', href)
      window.localStorage.setItem('focus-state', 1)
      window.location = href
    }
  })
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
          ${parseUser(article.author, article.authorMeta)}
        </a>
      </div>
      <div class="article-menu">
        <div class="trigger" style="display: none;">⋯</div>
        <div class="dropdown">
          ${article.author.toLowerCase() === dett.account.toLowerCase() ?
            `<div class="article-edit item"><a href="post.html?etx=${article.transaction.hash}">編緝文章</a></div>` : ''}
          <div id="article-reply" class="item"><a href="post.html?rtx=${article.transaction.hash}">回應文章</a></div>
        </div>
      </div>
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

_layoutInit().then(main)
