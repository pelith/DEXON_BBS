let once = false

function patchWeb3() {
  if (once) return
  once = true
  if (!window.Web3)
    return console.warn('Cannot find web3 when attempting to patch it.')

  const web3Temp = new Web3()
  Web3.utils = web3Temp.utils
}

export default patchWeb3
