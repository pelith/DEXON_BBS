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

const checkRules = val => {
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

  if (isValid) {
    $('#register-ok').show()
    $('#register-no').hide()
    // update UI for esti. cost
    // XXX: strange bug. fee returns a bn object instead of a string
    $('#register-fee').text(`${Web3.utils.fromWei(registerFee.toString())} DXN`)
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
  // TODO: dry run to check if it is used
  if (!await dett.checkIdAvailable(nick)) {
    alert('抱歉，此暱稱可能已被使用！')
    return
  }
  await dett.registerName(nick, registerFee)
}

const main = async ({ _dexon }) => {
  dett = new Dett()
  await dett.init(_dexon.dexonWeb3, Web3)

  _dexon.identityManager.on('login', (account) => {
    console.log(account)
    render(account)
  })
  _dexon.identityManager.init()

  const elNickname = $('#register-nickname')
  elNickname.on('input', evt => checkRules($(evt.currentTarget).val()))
  $('#register-submit').click(() => doNewRegister(elNickname.val()))


  registerFee = await dett.getRegisterFee()
  checkRules(elNickname.val())

  const history = await dett.getRegisterHistory()
  console.log(history)
}

_layoutInit().then(main)
