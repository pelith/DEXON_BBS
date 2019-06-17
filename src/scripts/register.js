import Dexon from './dexon.js'
import Dett from './dett.js'

import {parseText, parseUser} from './utils.js'

let dett = null
let account = ''
let registerFee = '0'

const render = (_account) => {
  account = _account
  dett.account = account

  if (account){
    dett.getMetaByAddress(account).then(meta => {
      const {name} = meta
      $('#main-content-nickname').text(name.length ? name : '(未註冊)')
      $('.member-zone').show()
    })
  } else {
    $('.member-zone').hide()
  }

  $('#main-content-address').text(account)
}

const checkRules = async (val) => {
  const ruleCtrls = $('.--rule')
  ruleCtrls.removeClass('f1 f2 hl')

  const isValid = [
    v => v.match(/^[A-Za-z0-9 ]{3,12}$/),
    v => !v.match(/(?:^0[Xx]|^ | $)/),
    v => !v.match(/^\d+$/),
    v => !v.match(/  +/),
  ].every((test, idx) => {
    if (test(val)) {
      ruleCtrls.eq(idx).addClass('hl f2')
      return true
    }
    ruleCtrls.eq(idx).addClass('hl f1')
    return false
  })

  // TODO: dry run to check if it is used

  if (isValid) {
    // update UI for esti. cost
    // XXX: strange bug. fee returns a bn object instead of a string
    if (await dett.checkIdAvailable(val)){
      $('#register-no').show()
      $('#register-ok').hide()
    }
    else{
      $('#register-fee').text(`${Web3.utils.fromWei(registerFee.toString())} DXN`)
      $('#register-no').hide()
      $('#register-ok').show()
    }
  } else {
    $('#register-ok').hide()
    $('#register-no').show()
  }

  return isValid
}

const doNewRegister = async nick => {
  if (!checkRules(nick)) {
    // failed pre-check
    return
  }
  await dett.registerName(nick, registerFee)
}

const main = async ({ _dexon, _dett }) => {
  // set _dett to global
  dett = _dett

  _dexon.identityManager.on('login', ({account, wallet}) => {
    render(account)
    dett.setWallet(wallet)
  })
  _dexon.identityManager.init()

  const elNickname = $('#register-nickname')
  elNickname.on('input', evt => checkRules($(evt.currentTarget).val()))
  $('#register-submit').click(() => doNewRegister(elNickname.val()))

  registerFee = await dett.getRegisterFee()
  // checkRules(elNickname.val())

  const history = await dett.getRegisterHistory()
  console.log(history)
}

_layoutInit().then(main)