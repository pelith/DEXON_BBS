import {getUser} from './utils.js'
import Dexon from './dexon.js'

let account = ''

const render = (_account) => {
  account = _account

  if (account){
    // show User 
    $("#bbs-login").hide()
    $("#bbs-register").hide()
    $("#bbs-user").show()
  }
  else{
    // show Login/Register
    $("#bbs-login").show()
    $("#bbs-register").show()
    $("#bbs-user").hide()
  }
  
  $("#bbs-user").text(getUser(account))
}

const main = async () => {
  dexon = new Dexon(window.dexon)
  dexon.event.on('update',(account) => {
    render(account)
  })

  $('#bbs-login').click(() => { dexon.login() })
}

$(main)