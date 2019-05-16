import Dexon from './dexon.js'
import Dett from './dett.js'

import {parseText, parseUser} from './utils.js'

let dett = null
let account = ''

const checkContent = () => { return $("#bbs-content").val().length > 0 }

const checkTitle = () => { return $("#bbs-title").val().length > 0 }

const check = () => { return (checkContent() && checkTitle()) }

const render = (_account) => {
  account = _account
  dett.account = account
  $(".bbs-post")[0].disabled = !check()

  // Handle mobile version
  if ($(".bbs-post")[1] !== undefined)
    $(".bbs-post")[1].disabled = !check()
  $("#bbs-user").text(parseUser(account))
}

const keyboardHook = () => {
  const QKey = 81, XKey = 88, YKey = 89

  let checkSave = false, checkPost = false

  $(document).keydown((e) => {
    if (e.ctrlKey && e.keyCode == QKey) {
      $("#bbs-footer").hide()
      $("#bbs-checksave").show()
      $("#bbs-title")[0].disabled = true
      $("#bbs-content")[0].disabled = true
      checkSave = true
    }
    else if (e.ctrlKey && e.keyCode == XKey) {
      if (check()) {
        $("#bbs-footer").hide()
        $("#bbs-checkpost").show()
        $("#bbs-title")[0].disabled=true
        $("#bbs-content")[0].disabled=true
        checkPost = true
      }
    }
    else if (!e.ctrlKey && (48 <= e.keyCode && e.keyCode <= 222) || e.keyCode==13) {
      if ( checkSave ) {
        $("#bbs-footer").show()
        $("#bbs-checksave").hide()
        $("#bbs-title")[0].disabled=false
        $("#bbs-content")[0].disabled=false
        checkSave = false

        if (e.keyCode == YKey)
          window.location = 'index.html'
      }
      else if ( checkPost ) {
        $("#bbs-footer").show()
        $("#bbs-checkpost").hide()
        $("#bbs-title")[0].disabled=false
        $("#bbs-content")[0].disabled=false
        checkPost = false

        if (e.keyCode == YKey)
          if (check()) dett.post($("#bbs-title").val(), $("#bbs-content").val())
      }
    }
  })
}

function main(){
  const _dexon = new Dexon(window.dexon)
  _dexon.on('update',(account) => {
    render(account)
  })

  dett = new Dett(_dexon.dexonWeb3)

  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()

  $("#bbs-title")[0].placeholder = "標題限制40字內"

  $("#bbs-title").blur(() => {
    $("#bbs-title").val(parseText($("#bbs-title").val(), 40))
  })

  if ($(window).width() > 992) {
    $("#bbs-content")[0].placeholder = "標題跟內文都有內容才能發文\r\n"+"~\r\n".repeat(19)
  } else {
    // mobile
    $("#bbs-content")[0].placeholder = "標題跟內文都有內容才能發文\r\n\r\n請輸入您欲發布的內容";
  }

  const postFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('確定發文?'))
      dett.post($("#bbs-title").val(), $("#bbs-content").val())
  }
  $(".bbs-post")[0].onclick = postFunc // 電腦版
  $(".bbs-post")[1].onclick = postFunc // 手機版

  const cancelFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('結束但不儲存?'))
      window.location = '/'
  }
  $(".bbs-cancel")[0].onclick = cancelFunc // 電腦版
  $(".bbs-cancel")[1].onclick = cancelFunc // 手機版

}


$(main())

