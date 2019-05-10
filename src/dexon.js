const ABIBBS = [{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"content","type":"string"}],"name":"Posted","type":"event"}]
const ABIBBSExt = [{"constant":false,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"origin","type":"bytes32"},{"name":"vote","type":"uint256"},{"name":"content","type":"string"}],"name":"Reply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"origin","type":"bytes32"},{"indexed":false,"name":"vote","type":"uint256"},{"indexed":false,"name":"content","type":"string"}],"name":"Replied","type":"event"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"voted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
const BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952"
const BBSExtContract = "0xec368ba43010056abb3e5afd01957ea1fdbd3d8f"

const web3js = new Web3('https://mainnet-rpc.dexon.org')

let dexonWeb3 = ''
let activeAccount = ''

const initDexon = (activeDexonRender) => {
  if (window.dexon) {
    dexonWeb3 = new Web3(window.dexon)
    dexonWeb3.eth.getAccounts().then((accounts) => {
      if (accounts.length>0){
        detectDexonNetwrok(activeDexonRender)
      }
    })
  }
}

const loginDexon = (activeDexonRender) => {
  if (window.dexon) {
    window.dexon.enable()
    detectDexonNetwrok(activeDexonRender)
  }
  else 
    alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)')
}

const detectDexonNetwrok = (activeDexonRender) => {
  dexonWeb3.eth.net.getId().then(networkID => {
    if (networkID === 237) {
      startInteractingWithWeb3(activeDexonRender)
      console.log('DEXON Wallet connected')
    }
    else
      alert('Wrong network')
  })
}

const startInteractingWithWeb3 = (activeDexonRender) => {
  const start = () => {
    dexonWeb3.eth.getAccounts().then((accounts)=>{
      if (accounts.length>0){
        activeAccount = accounts[0]
        activeDexonRender(activeAccount)  
      }
    })
  }
  start()
  setInterval(start, 1000)
}

function newPost(title, content) {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet.')
    return
  }

  if (title.length > 40) {
    alert('Title\'s length is over 40 characters.')
    return
  }

  const post = '[' + title + ']' + content
  const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
  dexBBSExt.methods.Post(post).estimateGas().then(gas => {
    dexBBSExt.methods.Post(post).send({ from: activeAccount, gas: gas })
    .then(receipt => {
      window.location = 'index.html'
    })
    .catch(err => {
      alert(err)
    })
  })
}

function newReply(tx, replyType, content) {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet first.')
    return
  }

  if (![0, 1, 2].includes(+replyType)){
    alert('Wrong type of replyType.')
    return
  }

  if (content.length === 0){
    alert('No content.')
    return
  }

  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    dexBBSExt.methods.Reply(tx, replyType, content).estimateGas().then(gas => {
      dexBBSExt.methods.Reply(tx, replyType, content).send({ from: activeAccount, gas: gas })
      .then(receipt => {
        window.location.reload()
      })
      .catch(err => {
        alert(err)
      })
    })
  }
}

export {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, loginDexon, newPost, newReply}
