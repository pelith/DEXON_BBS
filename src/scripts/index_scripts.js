import ShortURL from './shortURL.js'

import {htmlEntities, getUrlParameter, parseUser} from './utils.js'

let dev = false
let dett = null
let focusPost
let currentPage = null

const render = (_account) => {
  if (_account) {
    $("#bbs-post").show()
    $(".article-menu > .trigger").show()
  }
  else {
    $("#bbs-post").hide()
    $(".article-menu > .trigger").hide()
  }
}

const main = async ({ _dett, _dexon }) => {
  // for dev
  if (+window.localStorage.getItem('dev')) dev = true
  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()

  dett = _dett

  let milestones = await dett.BBSCache.methods.getMilestones().call()
  milestones = milestones.map((milestone) => {
    return dett.cacheweb3.utils.hexToUtf8(milestone)
  })

  let articles = []
  let addAnnouncement = false
  const root = dev ? 'index.html' : ''
  $("#oldpage").attr('href', root+'?p=1')

  if (milestones.length > 0){
    // get page number
    const p = getUrlParameter('p')
    if (p && p.match(/[0-9]+/g) && (1 <= +p && +p <= milestones.length)) {
      const _p = +p
      currentPage = _p
      if (_p === 1) { // first page
        $("#prevpage").addClass('disabled')
        $("#nextpage").removeClass('disabled')
        $("#nextpage").attr('href', root+'?p=2')
        articles = await dett.getArticles({toBlock: milestones[0]})
      }
      else if (_p === milestones.length) { // last page
        addAnnouncement = true
        $("#prevpage").attr('href', root+'?p='+(milestones.length-1))
        articles = await dett.getArticles({fromBlock: milestones[milestones.length-1]})
      }
      else {
        $("#prevpage").attr('href', root+'?p='+(_p-1))
        $("#nextpage").removeClass('disabled')
        $("#nextpage").attr('href', root+'?p='+(_p+1))
        articles = await dett.getArticles({fromBlock: milestones[_p-1], toBlock: milestones[_p]})
      }
    }
    else {
      addAnnouncement = true
      window.history.replaceState("", "", "/")
      $("#prevpage").attr('href', root+'?p='+(milestones.length-1))
      articles = await dett.getArticles({fromBlock: milestones[milestones.length-1]})
    }
  }
  else { // if no milestones show all article
    $("#prevpage").addClass('disabled')
    $("#nextpage").addClass('disabled')
    articles = await dett.getArticles()
  }

  await articles.reduce( async (n,p) => {
    await n
    directDisplay(...await p)
  }, Promise.resolve())

  // temporary fix announcement
  if (addAnnouncement){
    $('.r-list-container.action-bar-margin.bbs-screen').append($('<div class="r-list-sep"></div>'))
    displayAnnouncement('[公告] DEXON BBS 搬家預告', 'mayday'+(dev?'.html':''), 'Admin')
    displayAnnouncement('[公告] 領取免費的 DEXON 代幣 &amp; DEXON BBS 使用教學', 'about'+(dev?'.html':''), 'Admin')
  }

  // here the articles are loaded completely; do render here
  _dexon.identityManager.on('login', ({account, wallet}) => {
    render(account)
    dett.setWallet(wallet)
  })
  _dexon.identityManager.init()

  if (+sessionStorage.getItem('focus-state')===2){
    const post =  $('.r-list-container > .r-ent > div > a[href="'+sessionStorage.getItem('focus-href')+'"]')
    focusOnPost(post.parent().parent()[0], true)
    sessionStorage.setItem('focus-href', '')
    sessionStorage.setItem('focus-state', 0)
  }

  // atircles list attach dropdown list
  articleAttachDropdown()
}

const articleAttachDropdown = () => {
  $('.article-menu > .trigger').click((e) => {
    // check show article-edit condition
    const selectedArticleAuthor = $(e.target).parent().parent().children(".author").children().attr("data-address")
    if (selectedArticleAuthor.toLowerCase() === dett.account.toLowerCase()) {
      $(e.target).parent().children(".dropdown").children(".article-edit").show()
    } else {
      $(e.target).parent().children(".dropdown").children(".article-edit").hide()
    }

    var isShown = e.target.parentElement.classList.contains('shown');
    $('.article-menu.shown').toggleClass('shown');
    if (!isShown) {
      e.target.parentElement.classList.toggle('shown');
    }
    e.stopPropagation()
  })

  $(document).click((e) => { $('.article-menu.shown').toggleClass('shown') })
}

const focusOnPost = (post, scroll, up) => {
  if (focusPost) {
    $(focusPost).removeClass('focus')
  }

  focusPost = post
  $(focusPost).addClass('focus')
  if (scroll) {
    const rect = focusPost.getClientRects()[0]
    if ( up ){
      if ( rect.y < rect.height ) {
        const fixTop = parseFloat($(focusPost).css("marginTop")) + rect.height
        window.scrollBy({ top: -fixTop});
      }
      else
        focusPost.scrollIntoView({block: "nearest"})
    }
    else {
      if ( 0 < rect.y && rect.y < window.innerHeight+rect.height ) {
        focusPost.scrollIntoView({block: "nearest"})
      }
      else
        focusPost.scrollIntoView(false)
    }
  }
}

const keyboardHook = () => {
  const upCode = 38, rightCode = 39, downCode = 40
  $(document).keydown((e) => {
    if ($(document.body).hasClass('modal-open')) {
      return
    }

    if (e.keyCode === upCode) {
      let posts = $('.r-list-container > .r-ent')
      if (posts.length === 0) {
        return
      }
      e.preventDefault()
      for (let i = 1; i < posts.length; ++i) {
        if (posts[i] === focusPost) {
          focusOnPost(posts[i - 1], true, true)
          return
        }
      }
      focusOnPost(posts[posts.length - 1], true, true)
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
          focusOnPost(posts[i + 1], true, false)
          return
        }
      }
      focusOnPost(posts[0], true, false)
      return
    }
    if (e.keyCode == rightCode && focusPost) {
      const href = $('.title > a', focusPost).attr('href')
      sessionStorage.setItem('focus-href', href)
      if (currentPage)
        sessionStorage.setItem('focus-page', currentPage)
      sessionStorage.setItem('focus-state', 1)
      window.location = href
    }

    if (e.ctrlKey && e.keyCode === 'P'.charCodeAt()) {
      e.preventDefault()
      window.location = 'post.html'
    }
  })
}

const directDisplay = (article, votes, banned) => {
  if (banned) return

  const shortURL = 's/' + ShortURL.encode(dett.cacheweb3.utils.hexToNumber(article.transaction.hash.substr(0,10))).padStart(6,'0')
  let href = shortURL

  if (dev) href = shortURL+'.html'

  const cacheTime = (Date.now()-article.timestamp)/1000
  if (cacheTime < 30) // 30s
    href = 'content.html?tx=' + article.transaction.hash
  // else if (cacheTime < 30*60) //600-1800s github page cdn time
  //   href = shortURL+'?new' // tricky skill

  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"></div>
    <div class="title">
      <a href="${href}">
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
          <div class="article-reply item"><a href="post.html?rtx=${article.transaction.hash}">回應文章</a></div>
          <div class="article-edit item" style="display: none;"><a href="post.html?etx=${article.transaction.hash}">編輯文章</a></div>
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

const displayAnnouncement = (title, href, author) => {
  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"></div>
    <div class="title">
    <a href="${href}">
      ${title}
    </a>
    </div>
    <div class="meta">
      <div class="author">
        <a>
          ${author}
        </a>
      </div>
    </div>`)

  $('.r-list-container.action-bar-margin.bbs-screen').append(elem)
}


_layoutInit().then(main)
