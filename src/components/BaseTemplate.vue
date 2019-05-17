<template>
  <div>
    <slot name="style"></slot>
    <div id="topbar-container" v-show='this.$route.path !== "/post"'>
      <div id="topbar" class="bbs-content">

        <a id="logo" href="/"><logo></logo> BBS</a>
        <span>›</span>
        <a class="board" href="/"><span class="board-label">看板 </span>Gossiping</a>
        <div id="bbs-user-menu" class="user-menu right" href="#" style="display: none;">
            <div id="bbs-user" class="trigger right small">User</div>
            <div class="dropdown" style="width: 100%">
                <div class="item small"><router-link to="/about">幫助</router-link></div>
                <div class="hotkey-mode-btn item small"><a href="#">熱鍵模式<span class="hotkey-mode"></span></a></div>
                <div class="item small"><a href="#">註冊暱稱</a></div>
            </div>
        </div>
        <a id="bbs-login" class="right small" href="#">登入</a>
        <div id="bbs-more" class="user-menu right" href="#">
            <div class="trigger right small">...</div>
            <div class="dropdown" >
                <div class="item small"><router-link to="/about">幫助</router-link></div>
                <div class="hotkey-mode-btn item small"><a href="#">熱鍵模式<span class="hotkey-mode"></span></a></div>
            </div>
        </div>
      </div>
    </div>
    <slot name="content"></slot>
    <slot name="script"></slot>
  </div>
</template>

<script>
import Logo from './Logo'
import Dexon from '../scripts/dexon.js'

export default {
  name: 'BaseTemplate',
  components: {
    Logo,
  },
  data () {
    return {
      without_web3: false,
    }
  },
  mounted () {
    window.onpopstate = (event) => {
      if (!event.state && location.href.indexOf("#") == -1)
        window.location.reload()
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
