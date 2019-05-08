
const web3js = new Web3('https://mainnet-rpc.dexon.org')

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

      if (count > 40) break
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

      $('#main-content-author')[0].innerHTML = author
      $('#main-content-author')[0].href = 'https://dexonscan.app/transaction/'+tx
      $('#main-content-title')[0].innerHTML = title.title
      $('#main-content-content')[0].innerHTML = title.match ? content.slice(title.title.length+2) : content
      web3js.eth.getBlock(transaction.blockNumber).then(block => {
        $('#main-content-date').text((''+new Date(block.timestamp)).substr(0,24))
      })
      $('#main-content-href')[0].href = window.location.href
      $('#main-content-href')[0].innerHTML = window.location.href
    })
  }
}

$(startApp)
