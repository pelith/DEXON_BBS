import Vue from 'vue'
import VueHead from 'vue-head'
import Router from 'vue-router'

import Index from '../components/Index'
import About from '../components/About'
import Content from '../components/Content'
import Post from '../components/Post'

Vue.use(VueHead)
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/content',
      name: 'Content',
      component: Content
    },
    {
      path: '/post',
      name: 'Post',
      component: Post
    }
  ]
})