import Dexon from './dexon.js'
import {parseUser} from './utils.js'

let account = ''

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

  $("#bbs-user").text(parseUser(account))
}

const main = async () => {
  // init dexon account first
  window._dexon = new Dexon(window.dexon)
  _dexon.on('update',(account) => {
    render(account)
  })

  $('#bbs-login').click(() => { _dexon.login() })

  hotkey()

  attachDropdown()
}

$(main)


