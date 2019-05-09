
const ABIBBS = [{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"content","type":"string"}],"name":"Posted","type":"event"}]
const ABIBBSExt = [{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"upvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"content","type":"string"}],"name":"Post","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"origin","type":"bytes32"},{"name":"content","type":"string"}],"name":"Reply","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"constant":!1,"inputs":[{"name":"post","type":"bytes32"}],"name":"downvote","outputs":[],"payable":!1,"stateMutability":"nonpayable","type":"function"},{"anonymous":!1,"inputs":[{"indexed":!1,"name":"origin","type":"bytes32"},{"indexed":!1,"name":"content","type":"string"}],"name":"Replied","type":"event"}]

const BBSContract = "0x663002C4E41E5d04860a76955A7B9B8234475952"
const BBSExtContract = "0x9b985Ef27464CF25561f0046352E03a09d2C2e0C"

const web3js = new Web3('https://mainnet-rpc.dexon.org')
let dexonWeb3 = ''
let activeAccount = ''

const banList = ["0xdc0db75c79308f396ed6389537d4ddd2a36c920bb2958ed7f70949b1f9d3375d"]

function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function startApp() {
  const BBS = new web3js.eth.Contract(ABIBBS, BBSContract)
  const BBSExt = new web3js.eth.Contract(ABIBBSExt, BBSExtContract)

  BBS.getPastEvents({fromBlock : '990000'})
  .then(events => {
    events.slice().reverse().forEach(event => {
      if ( !banList.includes(event.transactionHash) )
        directDisplay(getTitle(event.returnValues.content.substr(0,40)).title, event.transactionHash, event.blockNumber)
    })
  });
}

function getTitle(content) {
  function convert(str) {
    let tmp='', count = 0;
    for(i=0;i<str.length; i++){
      if (str[i].match(/[\u4e00-\u9fa5]/g)) tmp+=str[i],count+=2
      else if (str[i].match(/[\u0800-\u4e00]/g)) tmp+=str[i],count+=2
      else if (str[i].match(/[\uff00-\uffff]/g)) tmp+=str[i],count+=2
      else tmp+=str[i],count++

      if (count >= 40) {
        tmp += '…'
        break
      }
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

function directDisplay(content, txHash, blockNumber) {
  content = htmlEntities(content)
  const elem = $('<div class="r-ent"></div>')
  elem.html(
    `<div class="nrec"><span class="hl f1"> 爆 </span></div>
    <div class="title">
    <a href="content.html?tx=${txHash}">
      ${content}
    </a>
    </div>
    <div class="meta">
      <div class="author">
        <a target="_blank" href="https://dexonscan.app/transaction/${txHash}">
           @${blockNumber}
        </a>
      </div>
      <div class="article-menu"></div>
      <div class="date">...</div>
    </div>`)

  $('.r-list-container.action-bar-margin.bbs-screen').append(elem)

  web3js.eth.getBlock(blockNumber).then(block => {
    const date = new Date(block.timestamp)
    $(elem).find('.date').text((date.getMonth()+1)+'/'+(''+date.getDate()).padStart(2, '0'))
                         .attr('title', date.toLocaleString())
  })
}

function startInteractingWithWeb3() {
  setInterval(() => {
    dexonWeb3.eth.getAccounts().then(([account]) => {
      activeAccount = account
      $("#bbs-user")[0].innerHTML = activeAccount.replace(/^(0x.{3}).+(.{3})$/, '$1...$2')
    })
  }, 2000)
}

function initDexon() {
  if (window.dexon) {
    const dexonProvider = window.dexon
    dexonProvider.enable()
    dexonWeb3 = new Web3()
    dexonWeb3.setProvider(dexonProvider)

    dexonWeb3.eth.net.getId().then(networkID => {
      if (networkID === 237) {
        $("#bbs-post")[0].style.display=''
        $("#bbs-login")[0].style.display='none'
        $("#bbs-register")[0].style.display='none'
        $("#bbs-user")[0].style.display=''
        startInteractingWithWeb3()
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

$('#bbs-login').click(() => {
  initDexon()
})

$(startApp)
