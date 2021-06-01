import Vue from 'vue'
import Router from 'vue-router'
import myIndex from '@/page/Index'
import posts from '@/components/Posts'
import post from '@/components/Post'
import tags from '@/components/Tags'
import register from '@/user/Regist'
import login from '@/user/Login'
import userInfoIndex from '@/components/user/InfoIndex.vue'
import userInfoCenter from '@/components/user/InfoCenter.vue'
import userSecurityCenter from '@/components/user/UserSecurityCenter.vue'
import securityModifyPage from '@/components/user/SecurityModifyPage.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [{
      path: '/',
      name: 'index',
      component: myIndex
    },
    {
      path: '/posts/:tag',
      name: 'posts',
      component: posts
    },
    {
      path: '/posts',
      name: 'posts',
      component: posts
    },
    {
      path: '/post/:id',
      name: 'post',
      component: post
    },
    {
      path: '/tags',
      name: 'tags',
      component: tags
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/user/info/index/:id',
      name: 'userInfoIndex',
      component: userInfoIndex
    },
    {
      path: '/user/info/center',
      name: 'userInfoCenter',
      component: userInfoCenter,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/user/security/center',
      name: 'userSecurityCenter',
      component: userSecurityCenter,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/user/security/edit/:type',
      name: 'securityModifyPage',
      component: securityModifyPage,
      meta: {
        requireAuth: true
      }
    }
  ]
})
