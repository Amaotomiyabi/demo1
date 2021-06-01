<template>
  <div class="root">
    <header>
      <myHeader></myHeader>
    </header>
    <div class="main">
      <div class="top">
        <div class="header">
        </div>
        <div class="photo">
          <el-image :src="user.photo.smallPath" :preview-src-list="[user.photo.path]" class="photo-image">
          </el-image>
        </div>
        <div class="top-info">
          <div class="top-left-menu">
            <span class="top-left-menu-span-1">
              <router-link to="" class="router-link top-left-menu-1">关注 {{user.subscribeCount}}
              </router-link>
            </span>
            <span class="top-left-menu-span-2">
              <router-link to="" class="router-link top-left-menu-2">粉丝 {{user.followerCount}}
              </router-link>
            </span>
            <!--            <span class="top-left-menu-span-3">
              <router-link to="/user/info/center" class="router-link top-left-menu-3">最后一次登录 {{user.lastLoginTime}}
              </router-link>
            </span> -->
          </div>
          <div class="top-right-menu" v-if="editState">
            <router-link to="/user/info/center" class="router-link">编辑个人资料</router-link>
          </div>
          <div>
            <el-button type="primary" round class="top-right-menu" v-if="operationState" @click="subscribe()">
              {{subscribeText}}
            </el-button>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="top-menu-div">
          <el-menu default-active="1" class="top-menu" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" class="top-menu-item">作品</el-menu-item>
            <el-menu-item index="2" class="top-menu-item">收藏</el-menu-item>
            <el-menu-item index="3" class="top-menu-item" v-if="editState">历史浏览</el-menu-item>
          </el-menu>
        </div>
        <div class="bottom-main">
          <ImgSearch :requestUrl="requestUrl" :params="params" :key='menuIndex' v-if="imgSearchShow"
            :deleteShowState="editState" :deleteUrl="deleteUrl">
          </ImgSearch>
        </div>
      </div>
      <div class="float-right">
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../page/Header.vue'
  import myFooter from '../../page/Footer.vue'
  import Network from '../../api/network.js'
  import ImgSearch from './ImgSearch.vue'

  export default {
    name: 'userInfoIndex',
    components: {
      myHeader,
      myFooter,
      ImgSearch
    },
    data() {
      return {
        deleteUrl: '',
        subscribeText: '',
        editState: false,
        operationState: false,
        imgSearchShow: false,
        requestUrl: '',
        params: {},
        menuIndex: 1,
        user: {
          photo: {
            smallPath: '',
            path: ''
          }
        }
      }
    },
    methods: {
      handleSelect(index, path) {
        let num = parseInt(index)
        switch (num) {
          case 1:
            this.requestUrl = '/business/user/picture/list/works';
            this.deleteUrl = '/business/picture/remove';
            this.params = {
              size: 36,
              id: this.user.id
            };
            break;
          case 2:
            this.requestUrl = '/business/user/picture/list/collect';
            this.deleteUrl = '/business/user/picture/collect/delete';
            this.params = {
              size: 36,
              id: this.user.id
            };
            break;
          case 3:
            this.requestUrl = '/business/user/picture/list/history';
            this.deleteUrl = '/business/user/picture/history/delete';
            this.params = {
              size: 36
            };
            break;
          default:
            this.$message.error('错误')
        }
        this.menuIndex = index
      },
      getUserInfo() {
        Network.get('/user/identity/info', {
          id: this.$route.params.id
        }).then(data => {
          this.formatUserPhoto(data)
          this.user = data
          this.handleSelect(1)
          this.imgSearchShow = true
        })
      },
      initView() {
        this.getUserInfo()
        let user = localStorage.getItem('user');
        if (user != null) {
          user = JSON.parse(user)
          if (user.id == this.$route.params.id) {
            this.editState = true;
          } else {
            Network.get('/business/user/subscribe/state', {
              id: this.$route.params.id
            }).then(data => {
              if (data == true) {
                this.subscribeText = '已关注'
                this.operationState = true
              } else {
                this.subscribeText = '关注'
                this.operationState = true
              }
            })
          }
        } else {
          this.operationState = '关注'
          this.operationState = true;
        }
      },
      subscribe() {
        if (this.subscribeText == '关注') {
          Network.post('/business/user/subscribe', {
            id: this.user.id
          }).then(data => {
            if (data.code == '200') {
              this.subscribeText = '已关注'
              this.user.followerCount++
            }
          })
        } else {
          Network.post('/business/user/unSubscribe', {
            id: this.user.id
          }).then(data => {
            if (data.code == '200') {
              this.subscribeText = '关注'
              this.user.followerCount--
            }
          })
        }
      }
    },
    mounted() {
      this.initView()
    },
    watch: {
      $route(to, from) {
        this.initView()
      }
    }
  }
</script>

<style scoped>
  .root {
    width: 100%;
    /* background-image: url(../../../static/img/kyotoanimation.png); */
  }

  .main {
    width: 1000px;
    margin: 0 auto;
    border-radius: 20px;
    border-color: transparent;
    border-width: 1px;
    border-style: solid;
    box-shadow: 0px 0px 80px rgba(245, 212, 217, 1);
  }

  .top {
    height: 350px;
    width: 100%;
    margin: 0 auto;
  }

  .header {
    background-image: url(../../../static/background/6792181756339556352.png);
    border-radius: 10px;
    width: 100%;
    height: 280px;
  }

  .photo {
    width: 200px;
    height: 200px;
    margin-left: 50px;
    margin-top: -170px;
  }

  .photo-image {
    box-shadow: 0px 0px 80px rgba(245, 212, 217, 0.3);
    border-radius: 100px;
    border: white;
    border-width: 2px;
    border-style: solid;
    width: 100%;
    height: 100%;
  }

  .top-left-menu {
    float: left;
    margin-left: 250px;
    margin-top: -20px;
  }

  .top-left-menu-1 {}

  .top-left-menu-2 {
    margin-left: 0px;
  }

  .top-left-menu-3 {}

  .top-left-menu-span-1 {
    float: left;
    display: inline-block;
    width: 120px;
  }

  .top-left-menu-span-2 {
    float: left;
    display: inline-block;
    width: 120px;
  }

  .top-left-menu-span-3 {
    float: left;
    margin-left: -440px;
    display: inline-block;
    margin-top: 38px;
  }


  .top-right-menu {
    float: right;
    margin-right: 50px;
    border: lightpink solid 2px;
    border-radius: 30px;
    width: 200px;
    margin-top: -5px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .router-link {
    text-decoration: none;
    font-size: 1.1rem;
    font-weight: bold;
    color: #909399;
    transition: 0.5s;
  }

  .router-link:hover {
    color: lightpink;
    text-decoration: underline;
    text-decoration-color: mediumvioletred;
  }


  .top-menu {
    border: none;
  }

  .top-menu-item {
    font-size: 1.3rem;
    font-weight: bold;
    color: #909399;
  }

  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal>.el-menu-item.is-active,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover .el-menu-item.is-active {
    color: lightpink;
  }

  .bottom {
    margin-top: 10px;
    width: 100%;
  }

  .bottom-main {
    width: 100%;
  }
</style>
