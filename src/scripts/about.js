const keyboardHook = () => {
  const leftCode = 37
  $(document).keyup((e) => {
    if (e.keyCode === leftCode) {
      window.location = '/'
      return
    }
  })
}

const main = () => {
  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()
}

$(main)
