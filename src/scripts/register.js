import {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, BBS, BBSExt, initDexon, loginDexon, newRegister} from './dexon.js'
import {getUser} from './utils.js'

let account = ''

const activeDexonRender = (_account) => {
  account = _account

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

  $('#main-content-address').text(account)
}

const checkRules = val => {
  const ruleCtrls = $('.--rule')
  ruleCtrls.removeClass('f1 f2 hl')

  const isValid = [
    v => v.match(/^[a-z0-9 ]{2,12}$/),
    v => !v.match(/(?:^0x|^ | $)/),
    v => !v.match(/^\d+$/),
    v => !v.match(/ {2,}/),
  ].every((test, idx) => {
    if (test(val)) {
      ruleCtrls.eq(idx).addClass('hl f2')
      return true
    }
    ruleCtrls.eq(idx).addClass('hl f1')
    return false
  })

  if (isValid) {
    // update UI for esti. cost
  }

  return isValid
}

const doNewRegister = nick => {
  if (!checkRules(nick)) {
    // failed pre-check
    return
  }
  // TODO: dry run to check if it is used

  newRegister()
}

const main = async () => {
  initDexon(activeDexonRender)

  $('#bbs-login').click(() => { loginDexon(activeDexonRender) })

  const elNickname = $('#register-nickname')
  elNickname.on('input', evt => checkRules($(evt.currentTarget).val()))
  checkRules(elNickname.val())

  $('#register-submit').click(() => doNewRegister(elNickname.val()))
}

$(main)
