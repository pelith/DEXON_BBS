import {getUser} from './utils.js'
import {initDexon, loginDexon} from './dexon.js'

const activeDexonRender = (account) => {
  account = getUser(account)

  if (account){
    // show User 
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user").show()

    // only show reply btn at first time 
    if (!$("#reply-user").text()) $("#reply-btn").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user").hide()

    // hide reply btn
    $("#reply-btn").hide()
  }
  
  $("#bbs-user").text(account)
  $("#reply-user").text(account)
}


const main = async () => {
  initDexon(activeDexonRender)

  $('#bbs-login').click(() => { loginDexon(activeDexonRender) })

  $("#bbs-login").hide()
  $("#bbs-register").hide()
  $("#bbs-user").show()
}

$(main)