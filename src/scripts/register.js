import Dexon from './dexon.js'
import Dett from './dett.js'

import {parseText, parseUser} from './utils.js'

let dett = null
let account = ''

const render = (_account) => {
  account = _account
  dett.account = account

  if (account){
    dett.getMetaByAddress(account).then(meta => {
      const {name} = meta
      $('#main-content-nickname').text(name.length ? name : '(未註冊)')
    })
  }
  else{
  }

  $('#main-content-address').text(account)
}

const checkRules = val => {
  const ruleCtrls = $('.--rule')
  ruleCtrls.removeClass('f1 f2 hl')

  const isValid = [
    v => v.match(/^[A-Za-z0-9 ]{2,12}$/),
    v => !v.match(/(?:^0[Xx]|^ | $)/),
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
  const _dexon = new Dexon(window.dexon)
  _dexon.on('update',(account) => {
    render(account)
  })

  dett = new Dett(_dexon.dexonWeb3)

  const elNickname = $('#register-nickname')
  elNickname.on('input', evt => checkRules($(evt.currentTarget).val()))
  checkRules(elNickname.val())

  $('#register-submit').click(() => doNewRegister(elNickname.val()))
}

$(main)
