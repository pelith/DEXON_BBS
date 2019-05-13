import {getParseText, getUser} from './utils.js'
import {initDexon, newPost} from './dexon.js'

const checkContent = () => { return $("#bbs-content").val().length > 0 }

const checkTitle = () => { return $("#bbs-title").val().length > 0 }

const check = () => { return (checkContent() && checkTitle()) }

const activeDexonRender = (account) => {
  $(".bbs-post")[0].disabled = !check()
  // Handle mobile version
  if ($(".bbs-post")[1] !== undefined)
    $(".bbs-post")[1].disabled = !check()
  $("#bbs-user")[0].innerHTML = getUser(account)
}

const keyboardHook = () => {
  const ctrlKey = 17, QKey = 81, XKey = 88, YKey = 89
  let ctrlDown = false
  let checkSave = false, checkPost = false

  $(document).keydown((e) => { if (e.keyCode == ctrlKey) ctrlDown = true})
             .keyup((e) => {if (e.keyCode == ctrlKey) ctrlDown = false})

  $(document).keydown((e) => {
    if (ctrlDown && e.keyCode == QKey) {
      $("#bbs-footer")[0].style.display = 'none'
      $("#bbs-checksave")[0].style.display = ''
      $("#bbs-title")[0].disabled=true
      $("#bbs-content")[0].disabled=true
      checkSave = true
    }
    else if (ctrlDown && e.keyCode == XKey) {
      if (check()) {
        $("#bbs-footer")[0].style.display = 'none'
        $("#bbs-checkpost")[0].style.display = ''
        $("#bbs-title")[0].disabled=true
        $("#bbs-content")[0].disabled=true
        checkPost = true
      }
    }
    else if (!ctrlDown && (48 <= e.keyCode && e.keyCode <= 222) || e.keyCode==13) {
      if ( checkSave ) {
        $("#bbs-footer")[0].style.display = ''
        $("#bbs-checksave")[0].style.display = 'none'
        $("#bbs-title")[0].disabled=false
        $("#bbs-content")[0].disabled=false
        checkSave = false

        if (e.keyCode == YKey)
          window.location = 'index.html'
      } 
      else if ( checkPost ) {
        $("#bbs-footer")[0].style.display = ''
        $("#bbs-checkpost")[0].style.display = 'none'
        $("#bbs-title")[0].disabled=false
        $("#bbs-content")[0].disabled=false
        checkPost = false

        if (e.keyCode == YKey)
          if (check()) newPost($("#bbs-title")[0].value, $("#bbs-content")[0].value)
      }
    }
  })
}

function main(){
  initDexon(activeDexonRender)

  keyboardHook()

  $("#bbs-title").blur = () => { $("#bbs-title").val(getParseText($("#bbs-title").val(), 40)) }

  if ($(window).width() > 992) {
    $("#bbs-content")[0].placeholder="~\r\n".repeat(20)
  } else {
    // mobile
    $("#bbs-content")[0].placeholder = "請輸入您欲發布的內容";
  }

  const postFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('確定發文?'))
      newPost($("#bbs-title")[0].value, $("#bbs-content")[0].value)
  }
  $(".bbs-post")[0].onclick = postFunc // 電腦版
  $(".bbs-post")[1].onclick = postFunc // 手機版

  const cancelFunc = () => {
    if ((!checkContent() && !checkTitle()) || confirm('結束但不儲存?'))
      window.location = 'index.html'
  }
  $(".bbs-cancel")[0].onclick = cancelFunc // 電腦版
  $(".bbs-cancel")[1].onclick = cancelFunc // 手機版
 
}


$(main())

