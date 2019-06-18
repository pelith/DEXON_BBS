const keyboardHook = () => {
  const leftCode = 37
  $(document).keyup((e) => {
    if (e.keyCode === leftCode) {
      window.location = '/'
      return
    }
  })
}

const main = ({ _dett, _dexon }) => {
  // here the articles are loaded completely; do render here
  _dexon.identityManager.on('login', ({account, wallet}) => {
    // render(account)
    // dett.setWallet(wallet)
  })
  _dexon.identityManager.init()

  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()
}

_layoutInit().then(main)
