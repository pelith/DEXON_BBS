
const ABIBBSExt = [{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"upvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"origin","type":"bytes32"},{"name":"content","type":"string"}],"name":"Reply","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"downvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"origin","type":"bytes32"},{"indexed":!1,"name":"content","type":"string"}],"name":"Replied","type":"event"}]
const BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C"

const web3js = new Web3('https://mainnet-rpc.dexon.org')
let dexonWeb3 = ''
let activeAccount = ''

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function getUrlParameter(sParam) {
  let sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&'), sParameterName;
  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
  }
}

function getTitle(content) {
  function convert(str) {
    let tmp='', count = 0;
    for(i=0;i<str.length; i++){
      if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp+=str[i],count+=2
      else if (str[i].match(/[\uff00-\uffff]/g)) tmp+=str[i],count+=2
      else tmp+=str[i],count++

      if (count >= 40) break
    }
    return tmp
  }

  content = convert(content)
  match = content.match(/^(\[).*(\])/)
  return {
    match: match,
    title: match ? match[0].substr(1,match[0].length-2) : content
  }
}

function startApp() {
  const tx = getUrlParameter('tx')
  if (tx){
    web3js.eth.getTransaction(tx).then(transaction => {
      const content = htmlEntities(web3js.utils.hexToUtf8('0x'+transaction.input.slice(138)))
      const author = '@'+transaction.blockNumber
      const title = getTitle(content.substr(0, 40))

      document.title = title.title + ' - Gossiping - DEXON BBS'
      $('#main-content-author')[0].innerHTML = author
      $('#main-content-author')[0].href = 'https://dexonscan.app/transaction/'+tx
      $('#main-content-title')[0].innerHTML = title.title
      $('#main-content-content')[0].innerHTML = title.match ? content.slice(title.title.length+2) : content
      web3js.eth.getBlock(transaction.blockNumber).then(block => {
        $('#main-content-date').text((''+new Date(block.timestamp)).substr(0,24))
      })
      $('#main-content-href')[0].href = window.location.href
      $('#main-content-href')[0].innerHTML = window.location.href
      $('#main-content-from').text(transaction.from.replace(/^(0x.{4}).+(.{4})$/, '$1...$2'))
    })
  }
}

function startInteractingWithWeb3() {
  setInterval(() => {
    dexonWeb3.eth.getAccounts().then(([account]) => {
      activeAccount = account
    })
  }, 1000)
}

function initDexon() {
  if (window.dexon) {
    const dexonProvider = window.dexon
    dexonProvider.enable()
    dexonWeb3 = new Web3()
    dexonWeb3.setProvider(dexonProvider)

    dexonWeb3.eth.net.getId().then(networkID => {
      if (networkID === 237) {
        startInteractingWithWeb3()
        alert('DEXON Wallet connected')
      }
      else
        alert('Wrong network')
    })
  }
  else {
    alert('DEXON Wallet not detected')
  }
}

function upvote() {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet first.')
    return
  }

  const tx = getUrlParameter('tx').substr(0,66)
  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    dexBBSExt.methods.upvote(tx).send({ from: activeAccount })
    .then(receipt => {
      window.location.reload()
    })
    .catch(err => {
      alert(err)
    })
  }
}

function downvote() {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet first.')
    return
  }

  const tx = getUrlParameter('tx').substr(0,66)
  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    dexBBSExt.methods.downvote(tx).send({ from: activeAccount })
    .then(receipt => {
      window.location.reload()
    })
    .catch(err => {
      alert(err)
    })
  }
}

function newReply(content) {
  if (dexonWeb3 === ''){
    alert('Please connect to your DEXON Wallet first.')
    return
  }

  const tx = getUrlParameter('tx').substr(0,66)
  if (tx) {
    const dexBBSExt = new dexonWeb3.eth.Contract(ABIBBSExt, BBSExtContract)
    dexBBSExt.methods.Reply(tx, content).send({ from: activeAccount })
    .then(receipt => {
      window.location.reload()
    })
    .catch(err => {
      alert(err)
    })
  }
}

$('#dexon-wallet').click(() => {
  initDexon()
})

$(startApp)
