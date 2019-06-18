import { generateMnemonic } from 'bip39'
import patchWeb3 from './patch-web3.js'

patchWeb3()

import Dexon from './dexon.js'
import Dett from './dett.js'
import {parseUser} from './utils.js'

const $loginForm = $('#loginForm')
const optInjected = $loginForm.find('[name="accountSource"][value="injected"]')
const optSeed = $loginForm.find('[name="accountSource"][value="seed"]')

let dett = null
let account = ''
let lastError
let metaCache

const $topBar = $('#topbar')
const $bbsUser = $topBar.find('#bbs-user')

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

const toggleDescStatus = ($el, ok) => {
  const $elOk = $el.find('.desc-ok')
  const $elErr = $el.find('.desc-err')
  $elOk[ok ? 'show' : 'hide']()
  $elErr[ok ? 'hide' : 'show']()
  return [$elOk, $elErr]
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

const renderTopbar = async (_account) => {
  account = _account ? _account : ''

  if (account){
    const addrDisp = parseUser(account)
    const nickname = await dett.getMetaByAddress(account)
    if (nickname.name) {
      $('#bbs-user').text(`${nickname.name} (${addrDisp})`)
    } else {
      $('#bbs-user').text(addrDisp)
    }

    // show User
    $("#bbs-login").hide()
    $("#bbs-more").hide()
    $("#bbs-user-menu").show()
  } else {
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-more").show()
    $("#bbs-user-menu").hide()
  }
}

const getLoginFormType = () => {
  return $loginForm[0].accountSource.value || ''
}

const initLoginForm = async ($elem, _dexon) => {
  const manager = _dexon.identityManager

  // TODO: handle the case where no provider is available
  $elem.find('.--injectedProviderName').text(_dexon.providerName)

  const generateSeed = () => {
    // generate then commit
    const seedphrase = generateMnemonic()
    $elem.find('[name="seed"]').val(seedphrase)
    return seedphrase
  }

  const updateViewForSeed = async (seedphrase) => {
    const $el = $elem.find('.wrapper--seed')
    const [$elOk, $elErr] = toggleDescStatus($el, false)
    $elErr.text('助記詞產生中...')
    await manager.setHdWallet(seedphrase)
    const { seedAddress, walllet } = manager
    toggleDescStatus($el, true)
    $elem.find('.--seedAccountAddress').text(seedAddress)
  }

  optInjected.click(() => {
    // no error but no address => we need the user to login manually
    if (!lastError && !_dexon.selectedAddress) {
      _dexon.login()
      // still disable the login button
      $('#bbs-modal-login').prop('disabled', true)
    } else {
      $('#bbs-modal-login').prop('disabled', false)
    }
    $('#seedConfigArea').hide()
  })

  optSeed.click(async () => {
    if (manager.seed == null) {
      const seedphrase = generateSeed()
      manager.seed = seedphrase
      await updateViewForSeed(seedphrase)
    }
    $('#bbs-modal-login').prop('disabled', false)
    $('#seedConfigArea').show()
  })

  $('#commitSeedPhrase').click(async () => {
    const newPhrase = $elem.find('[name="seed"]').val()
    if (!newPhrase) {
      alert('請輸入助記詞')
      return
    }
    manager.seed = newPhrase
    await updateViewForSeed(newPhrase)
  })
  $('#generateSeedPhrase').click(generateSeed)
  $('#deleteSeedPhrase').click(() => {
    const ok = confirm('確定刪除助記詞？此動作無法恢復！')
    if (ok) {
      manager.seed = null
      location.reload()
    }
  })

  // initial state
  $('#seedConfigArea').hide()
  if (manager.seed != null) {
    $elem.find('[name="seed"]').val(manager.seed)
    await updateViewForSeed(manager.seed)
  }

  // wallet change <-> login form display
  _dexon.on('update', account => {
    lastError = null
    optInjected.prop('disabled', false)

    if (account) {
      toggleDescStatus($elem.find('.wrapper--injected'), true)
      $elem.find('.wrapper--injected .desc-err').hide()
      $elem.find('.--injectedProviderStatus').text('正常')
      $elem.find('.--injectedAccountAddress').text(account)

    } else {
      if (getLoginFormType() == 'injected') {
        optInjected.prop('checked', false)
      }
      toggleDescStatus($elem.find('.wrapper--injected'), false)
      $elem.find('.--injectedProviderStatus').text('需要登入')
      $elem.find('.wrapper--injected .desc-err').text('按這裡登入錢包')
    }
  })

  _dexon.on('error', (err) => {
    lastError = err
  })

  _dexon.on('updateNetwork', ({id, isValid}) => {
    if (isValid) {
      optInjected.prop('disabled', false)
      // login info is updated in separate event
    } else {
      if (getLoginFormType() == 'injected') {
      // the wrong network makes this option no longer valid
        optInjected.prop('checked', false)
      }
      $elem.find('.--injectedProviderStatus').text('⚠ 無法使用')
      optInjected.prop('disabled', true)
      toggleDescStatus($elem.find('.wrapper--injected'), false)
      $elem.find('.wrapper--injected .desc-err').text('在錯誤的網路上。\n請打開錢包，並將網路切到 "DEXON Mainnet"。')
    }
  })
}

window._layoutInit = async () => {
  // init dexon account first
  const _dexon = new Dexon(window.dexon)
  // populate login form event / initial state
  if ($topBar[0]) {
    await initLoginForm($loginForm, _dexon)
  }

  _dexon.on('update', (account) => {
    if (account) {
      const manager = _dexon.identityManager
      manager.injectedAddress = account
      if (manager.loginType == 'injected') {
        manager.commitLoginType('injected')
      }
    }
  })

  const _dett = new Dett()
  await _dett.init(_dexon.dexonWeb3, Web3)

  dett = _dett

  if ($topBar[0]) {
    _dexon.identityManager.on('login', ({account}) => {
      renderTopbar(account, _dexon)
    })
  }

  $('#bbs-modal-login').click(() => {
    const loginType = getLoginFormType()
    window.localStorage.setItem('dett-login-type', loginType)
    _dexon.identityManager.commitLoginType(loginType)
    $('#loginModal').modal('hide')
  })

  hotkey()

  attachDropdown()

  // for parcel debug use
  if (+window.localStorage.getItem('dev'))
    window.dev = true

  return { _dexon, _dett }
}
