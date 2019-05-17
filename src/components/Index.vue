<template>
    <base-template>
        <template slot="content">
            <div id="main-container">
              <div id="action-bar-container">
                <div class="action-bar">
                  <div class="btn-group btn-group-dir" style="text-align: left; padding: 1px">
                    <a class="btn selected" href="/">看板</a>
                    <router-link to="/about">幫助</router-link>
                    <router-link id="bbs-post" class="btn" to="/post" style="display: none;">發文</router-link>
                  </div>
                  <div class="btn-group btn-group-paging" style="text-align: right; padding: 1px">
                    <a class="btn wide" href="#">Top</a>
                  </div>
                </div>
              </div>
              <div class="r-list-container action-bar-margin bbs-screen">
                <div class="r-ent">
                  <div class="nrec"></div>
                  <div class="title">
                    <router-link to="/about">[公告] 領取免費的 DEXON 代幣 &amp; DEXON BBS 使用教學</router-link>
                  </div>
                  <div class="meta">
                    <div class="author">
                      <a>
                        Admin
                      </a>
                    </div>
                    <div class="article-menu"></div>
                    <div class="date"></div>
                  </div>
                </div>
                <div class="r-list-sep"></div>
              </div>
            </div>
        </template>
    </base-template>
</template>
<script>

import BaseTemplate from './BaseTemplate'
import '../scripts/index_scripts'

export default {
  name: 'Index',
  components: {
    BaseTemplate,
  },
  data () {
    return {

    }
  },
  mounted () {
    window.onpopstate = (event) => {
      if (!event.state)
        window.location.reload()
    }
  },
  head: {
    title: {
      inner: 'DEXON BBS'
    },
    meta: [
      { property: 'og:title', content: 'DEXON BBS' },
      { property: 'og:description', content: '基於 DEXON 智慧合約的 BBS 系統' },
      { property: 'og:ur;', content: 'https://dett.cc' },
    ]
  },
}
</script>

<style scoped>
</style>
