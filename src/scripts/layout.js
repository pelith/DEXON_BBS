import patchWeb3 from './patch-web3.js'

patchWeb3()

import Dexon from './dexon.js'
import {parseUser} from './utils.js'

let account = ''
let lastError
let metaCache

const attachDropdown = () => {
  $('.user-menu > .trigger').click((e) => {
      var isShown = e.target.parentElement.classList.contains('shown');
      $('.user-menu.shown').toggleClass('shown');
      if (!isShown) {
          e.target.parentElement.classList.toggle('shown');
      }
      e.stopPropagation();
  })

  $(document).click((e) => { $('.user-menu.shown').toggleClass('shown') })
}

const hotkey = () => {
  if(!window.localStorage.getItem('hotkey-mode')) window.localStorage.setItem('hotkey-mode', 1)
  $('.hotkey-mode').text( +window.localStorage.getItem('hotkey-mode') ? "關閉" : "打開")

  $('.hotkey-mode-btn').click(() => {
    const hotkeyMode = +window.localStorage.getItem('hotkey-mode')
    window.localStorage.setItem('hotkey-mode', +!hotkeyMode)
    $('.hotkey-mode').text( +window.localStorage.getItem('hotkey-mode') ? "關閉" : "打開")
    window.location.reload()
  })
}

const render = (_account) => {
  account = _account ? _account : ''

  if (account){
    // show User
    $("#bbs-login").hide()
    $("#bbs-more").hide()
    $("#bbs-user-menu").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-more").show()
    $("#bbs-user-menu").hide()
  }

  const addrDisp = parseUser(account)
  const nickname = metaCache ? metaCache.name : null
  if (nickname) {
    $('#bbs-user').text(`${nickname} (${addrDisp})`)
  } else {
    $('#bbs-user').text(addrDisp)
  }
}

window._layoutInit = async () => {
  // init dexon account first
  const _dexon = new Dexon(window.dexon)

  _dexon.on('update',(account) => {
    lastError = null
    render(account)
  })

  _dexon.on('error', (err) => {
    $('#bbs-login').text('登入 ⚠')
    lastError = err
  })

  _dexon.on('_setMeta', meta => {
    metaCache = meta
    render(account)
  })

  $('#bbs-login').click(() => {
    if (lastError) {
      // account
      alert('在錯誤的網路上。\n請打開錢包並將網路切到 "DEXON Mainnet"。')
    } else {
      _dexon.login()
    }
  })

  hotkey()

  attachDropdown()

  return { _dexon }
}
