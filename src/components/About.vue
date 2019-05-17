<template>
    <base-template>
        <template slot="content">
<div id="navigation-container">
      <div id="navigation" class="bbs-content">
        <a class="board" href="/">返回看板</a>
        <div class="bar"></div>
      </div>
    </div>

    <div id="main-container">
      <div id="main-content" class="bbs-screen bbs-content"><div class="article-metaline"><span class="article-meta-tag">作者</span><span class="article-meta-value">Admin<a id="main-content-author" target="_blank" href="#"></a></span></div><div class="article-metaline-right"><span class="article-meta-tag">看板</span><span class="article-meta-value">Gossiping</span></div><div class="article-metaline"><span class="article-meta-tag">標題</span><span class="article-meta-value" id="main-content-title">[公告] 領取免費的 DEXON 代幣 &amp; DEXON BBS 使用教學</span></div><div class="article-metaline"><span class="article-meta-tag">時間</span><span class="article-meta-value" id="main-content-date">Mon May 13 2019 12:34:56
</span></div>
DEXON BBS 是一個基於 DEXON 區塊鏈的去中心化 BBS 論壇
在這裡，所有的發文與回覆都會被永久記錄在區塊鏈上

為了使用 DEXON BBS，需要先安裝 DEXON wallet
並透過官方服務，免費取得區塊鏈貨幣(DXN)支付使用手續費

1.下載錢包: <a target="_blank" href="https://dexon.org/dexon-wallet">https://dexon.org/dexon-wallet</a>
2.領錢錢: <a target="_blank" href="https://dexon.org/mainnet-faucet">https://dexon.org/mainnet-faucet</a>

DEXON BBS 保留並微調了 BBS 使用者常用的回文熱鍵功能
回文:X  推:1  噓:2  →:3  送出: Ctrl + Enter

--
<span class="f2">※ 發信站: DEXON BBS(dett.cc), 來自: Dexon</span><br><span class="f2">※ 文章網址: <router-link id="main-content-href" target="_blank" rel="nofollow" to="/about">https://dett.cc/about</router-link></span></div>
    </div>
        </template>
    </base-template>
</template>
<script>

import BaseTemplate from './BaseTemplate'
import '../scripts/about'

export default {
  name: 'About',
  components: {
    BaseTemplate,
  },
  data () {
    return {

    }
  },
  head: {
    title: {
      inner: '關於 - DEXON BBS'
    },
    meta: [
      { property: 'og:title', content: 'DEXON BBS' },
      { property: 'og:description', content: '領取免費的 DEXON 代幣 & DEXON BBS 使用教學' },
      { property: 'og:ur;', content: 'https://dett.cc/about' },
    ]
  },
}
</script>

<style scoped>
</style>
