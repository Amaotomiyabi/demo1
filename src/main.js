// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from '../element-ui'
import '../element-ui/theme/index.css'
import qs from 'qs'
import vueClapButton from 'vue-clap-button'


var axios = require('../axios')
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vueClapButton)
/* eslint-disable no-new */
/**
 * @description
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 2019-05-29
 * @param { number } type 1 localStorage 2 sessionStorage
 * @param { string } key 键
 * @param { string } data 要存储的数据
 * @returns
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (localStorage.getItem('token') != null) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})
Vue.prototype.$addStorageEvent = function(type, key, data) {
  if (type === 1) {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function(k, val) {
        localStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  } else {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function(k, val) {
        sessionStorage.setItem(k, val);
        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);
        // 派发对象
        window.dispatchEvent(newStorageEvent);
      }
    }
    return storage.setItem(key, data);
  }
}
Vue.prototype.formatUserPhoto = function(user) {
  if (user.photo == null) {
    let photo = {};
    photo.path = '../static/photo/1.jpg'
    photo.smallPath = '../static/photo/1.jpg'
    user.photo = photo
  } else if (user.photo.path == undefined || user.photo.path == null) {
    user.photo.path = '../static/photo/1.jpg'
    user.photo.smallPath = '../static/photo/1.jpg'
  }
}


Vue.prototype.resetSetItem = function(key, newVal) {
  if (key === 'watchStorage') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function(k, val) {
        localStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
