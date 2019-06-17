import Dexon from './dexon.js'
import Dett from './dett.js'

import {parseText, parseUser, getUrlParameter} from './utils.js'

let dett = null
let account = ''
let etx = ''
let edit = false

const checkContent = () => { return $("#bbs-content").val().length > 0 }

const checkTitle = () => { return $("#bbs-title").val().length > 0 }

const check = () => { return (checkContent() && checkTitle()) }

const render = (_account) => {
  console.log(_account)
  account = _account
  dett.account = account
  if (_account){
    $("#bbs-user").text(parseUser(account))
  }
  else
    window.location = '/'
}

const keyboardHook = () => {
  const QKey = 81, XKey = 88, YKey = 89

  let checkSave = false, checkPost = false

  $(document).keydown((e) => {
    const focused = document.activeElement instanceof HTMLInputElement ||
                    document.activeElement instanceof HTMLTextAreaElement ?
                    document.activeElement : null
    const hasSelection = focused ? focused.selectionStart != focused.selectionEnd : false

    if (e.ctrlKey && e.keyCode == QKey) {
      e.preventDefault()
      $("#bbs-footer").hide()
      $("#bbs-checksave").show()
      $("#bbs-title")[0].disabled = true
      $("#bbs-content")[0].disabled = true
      checkSave = true
    }
    else if (e.ctrlKey && e.keyCode == XKey) {
      if (check() && !hasSelection) {
        e.preventDefault()
        if (focused) {
          focused.blur()
        }
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
          window.location = '/'
      }
      else if ( checkPost ) {
        $("#bbs-footer").show()
        $("#bbs-checkpost").hide()
        $("#bbs-title")[0].disabled=false
        $("#bbs-content")[0].disabled=false
        checkPost = false

        if (e.keyCode == YKey)
          if (check()) {
            if (edit) {
              dett.edit(etx, $("#bbs-title").val(), $("#bbs-content").val())
            }
            else dett.post($("#bbs-title").val(), $("#bbs-content").val())
          }
      }
    }
  })
}

const main = async ({ _dexon }) => {
  dett = new Dett()
  await dett.init(_dexon.dexonWeb3, Web3)

  _dexon.identityManager.on('login', (account) => {
    render(account)
  })
  _dexon.identityManager.init()

  // get reply tx
  const rtx = getUrlParameter('rtx')
  if (rtx.match(/^0x[a-fA-F0-9]{64}$/g)) {
    const article = await dett.getArticle(rtx, false)
    $("#bbs-title").val(('Re: '+article.title).substr(0, dett.titleLength))
  }

  // get edit tx
  etx = getUrlParameter('etx')
  if (etx.match(/^0x[a-fA-F0-9]{64}$/g)) {
    const article = await dett.getArticle(etx, true)
    $("#bbs-title").val(article.title)
    $("#bbs-content").val(article.content)
    edit = true
  }

  if (+window.localStorage.getItem('hotkey-mode')) keyboardHook()

  $("#bbs-title")[0].placeholder = "標題限制40字內"

  $("#bbs-title").blur(() => {
    $("#bbs-title").val(parseText($("#bbs-title").val(), dett.titleLength))
  })

  if ($(window).width() > 992) {
    $("#bbs-content")[0].placeholder = "標題跟內文都有內容才能發文!\r\n"+"~\r\n".repeat(18)
  } else {
    // mobile
    $("#bbs-content")[0].placeholder = "標題跟內文都有內容才能發文!\r\n\r\n請輸入您欲發布的內容";
  }

  const postFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('確定發文?')) {
      if (edit) {
        dett.edit(etx, $("#bbs-title").val(), $("#bbs-content").val())
      }
      else dett.post($("#bbs-title").val(), $("#bbs-content").val())
    }
  }

  const checkPost = () => {
    $(".bbs-post")[0].disabled = !check()

    // Handle mobile version
    if ($(".bbs-post")[1] !== undefined)
      $(".bbs-post")[1].disabled = !check()
  }

  $("#bbs-content")[0].onblur = checkPost
  $("#bbs-title")[0].onblur = checkPost

  $(".bbs-post")[0].onclick = postFunc // 電腦版
  $(".bbs-post")[1].onclick = postFunc // 手機版

  const cancelFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('結束但不儲存?'))
      window.location = '/'
  }
  $(".bbs-cancel")[0].onclick = cancelFunc // 電腦版
  $(".bbs-cancel")[1].onclick = cancelFunc // 手機版

}

_layoutInit().then(main)
