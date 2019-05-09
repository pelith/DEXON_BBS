import {getParseText, getUser} from './utils.js'
import {initDexon, newPost} from './dexon.js'

const activeDexonRender = (account) => {
  $("#bbs-post")[0].disabled = ( $("#bbs-content")[0].value.length>0 && $("#bbs-title")[0].value >0 ) ? false : true
  $("#bbs-user")[0].innerHTML = getUser(account)
}

function main(){
  // String.prototype.lines = function() { return this.split(/\r*\n/); }
  // String.prototype.lineCount = function() { return this.lines().length; }

  $("#bbs-title")[0].onblur = () => { $("#bbs-title")[0].value = getParseText($("#bbs-title")[0].value, 40) }
  $("#bbs-content")[0].onkeyup = () => { }
  $("#bbs-content")[0].placeholder="~\n".repeat(20)
  $("#bbs-post")[0].onclick = () => { newPost($("#bbs-title")[0].value, $("#bbs-content")[0].value)}
  $("#bbs-cancel")[0].onclick = () => { window.location = 'index.html'}
  initDexon(activeDexonRender)
}

$(main())

