const ABIBBS = [{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"content","type":"string"}],"name":"Posted","type":"event"}]
const ABIBBSExt = [{"constant":false,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"origin","type":"bytes32"},{"name":"vote","type":"uint256"},{"name":"content","type":"string"}],"name":"Reply","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"origin","type":"bytes32"},{"indexed":false,"name":"vote","type":"uint256"},{"indexed":false,"name":"content","type":"string"}],"name":"Replied","type":"event"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"downvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"upvotes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"voted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}]
const BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952"
const BBSExtContract = "0xec368ba43010056abb3e5afd01957ea1fdbd3d8f"

const web3js = new Web3('https://mainnet-rpc.dexon.org')

let dexonWeb3 = ''
let activeAccount = ''

const initDexon = async (activeDexonRender) => {
  if (window.dexon) {
    dexonWeb3 = new Web3(window.dexon)
    const accounts = await dexonWeb3.eth.getAccounts()
    if (accounts.length){
      detectDexonNetwrok(activeDexonRender)
    }
  }
}

const loginDexon = (activeDexonRender) => {
  if (window.dexon) {
    window.dexon.enable()
    detectDexonNetwrok(activeDexonRender)
  }
  else 
    return alert('DEXON Wallet not detected. (請安裝 DEXON 瀏覽器擴充套件)')
}

const detectDexonNetwrok = async (activeDexonRender) => {
  const networkID = await dexonWeb3.eth.net.getId()
  if (networkID === 237) {
    startInteractingWithWeb3(activeDexonRender)
    console.log('DEXON Wallet connected')
  }
  else
    return alert('Wrong network')
}

const startInteractingWithWeb3 = (activeDexonRender) => {
  const start = async () => {
    const accounts = await dexonWeb3.eth.getAccounts()
    if (accounts.length){
      activeAccount = accounts[0]
      activeDexonRender(activeAccount)
    }
  }

  start()
  setInterval(start, 1000)
}

const newPost = async (title, content) => {
  if (!dexonWeb3)
    return alert('Please connect to your DEXON Wallet.')

  if (title.length > 40)
    return alert('Title\'s length is over 40 characters.')

  const post = '[' + title + ']' + content
  const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
  const gas = await dexBBSExt.methods.Post(post).estimateGas()
  try {
    const receipt = await dexBBSExt.methods.Post(post).send({ from: activeAccount, gas: gas })
    window.location = 'index.html'
  }
  catch(err){
    alert(err)
  }
}

const newReply = async (tx, replyType, content) => {
  if (!dexonWeb3) 
    return alert('Please connect to your DEXON Wallet first.')
    
  if (![0, 1, 2].includes(+replyType)) 
    return alert('Wrong type of replyType.')
    
  if (!content.length)
    return alert('No content.')

  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    const gas = await  dexBBSExt.methods.Reply(tx, +replyType, content).estimateGas()
    try {
      const receipt = await dexBBSExt.methods.Reply(tx, +replyType, content).send({ from: activeAccount, gas: gas })
      window.location.reload()
    }
    catch(err){
      alert(err)
    }
  }
}

export {ABIBBS, ABIBBSExt, BBSContract, BBSExtContract, web3js, initDexon, loginDexon, newPost, newReply}
