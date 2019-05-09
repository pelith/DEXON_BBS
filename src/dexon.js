const ABIBBS = [{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"content","type":"string"}],"name":"Posted","type":"event"}]
const ABIBBSExt = [{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"upvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"origin","type":"bytes32"},{"name":"content","type":"string"}],"name":"Reply","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"downvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"origin","type":"bytes32"},{"indexed":!1,"name":"content","type":"string"}],"name":"Replied","type":"event"}]

const BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952"
const BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C"

const web3js = new Web3('https://mainnet-rpc.dexon.org')

let dexonWeb3 = ''
let activeAccount = ''

const initDexon = (activeDexonRender) => {
  if (window.dexon) {
    const dexonProvider = window.dexon
    dexonProvider.enable()
    dexonWeb3 = new Web3()
    dexonWeb3.setProvider(dexonProvider)

    dexonWeb3.eth.net.getId().then(networkID => {
      if (networkID === 237) {
        startInteractingWithWeb3(activeDexonRender)
        console.log('DEXON Wallet connected')
      }
      else
        alert('Wrong network')
    })
  }
  else {
    alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)')
  }
}

const startInteractingWithWeb3 = (activeDexonRender) => {
  const start = () => {
    dexonWeb3.eth.getAccounts().then(([account]) => {
      activeAccount = account
      activeDexonRender(activeAccount)
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
  dexBBSExt.methods.Post(post).send({ from: activeAccount })
  .then(receipt => {
    window.location = 'index.html'
  })
  .catch(err => {
    alert(err)
  })
}

export {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, newPost}
