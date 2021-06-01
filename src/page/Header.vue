<template>
  <div class="myheader">
    <h1 class="headerleft">
      <a href="/" class="logo">
        <span>T<i class="el-icon-star-on"></i>T</span>
      </a>
    </h1>
    <div class="headerright">
      <ul class="headermenu">
        <li class="li-after"><a href="/#/posts" class="menu-a">
            <span>
              <p class="menu-font">收集<i class="el-icon-film"></i></p>
            </span>
          </a>
        </li>
        <!-- <li class="li-after"><a class="menu-a" @click="drawer=true"> -->
        <li class="li-after" v-if="isLogin"><a class="menu-a" @click="centerDialogVisible = true">
            <span>
              <p class="menu-font">上传<i class="el-icon-upload2"></i></p>
            </span>
          </a>
          <el-dialog title="上传" :visible.sync="centerDialogVisible" width="800px">
            <uploadImg class="upload_interface"></uploadImg>
          </el-dialog>
        </li>
        <li class="li-after" style="margin-right: 20px;" v-if="!isLogin">
          <span class="el-dropdown-link">
            <p class="menu-font">
              <router-link :to="'/login'" class="tag-link">
                Sign In
              </router-link>
            </p>
          </span>
        </li>
        <li class="li-after" v-if="isLogin" style="margin-right: 20px;">
          <el-dropdown class="menu-dropdown" @command="handleCommand" :show-timeout="100">
            <span class="el-dropdown-link">
              <p class="menu-font">
                <router-link :to="'/user/info/index/'+user.id" class="tag-link">
                  <el-avatar size="medium" :src="user.photo.path"></el-avatar>
                </router-link>
              </p>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-house" command="3">个人首页</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-grid" command="4">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-office-building" command='2'>安全中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-right" command="1">Sign Out</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import uploadImg from '@/components/UploadImg.vue'
  import Network from '../api/network.js'

  export default {
    name: 'myHeader',
    components: {
      uploadImg
    },
    data() {
      return {
        centerDialogVisible: false,
        drawer: false,
        direction: 'ltr',
        withHeader: false,
        activeIndex: '1',
        activeIndex2: '1',
        user: {},
        isLogin: false
      };
    },
    methods: {
      // 用户下拉菜单
      handleCommand(type) {
        switch (type) {
          case '1':
            this.signOut();
            break;
          case '2': {
            this.$router.push({
              path: '/user/security/center'
            });
          };
          break;
        case '3': {
          this.$router.push({
            path: '/user/info/index/' + this.user.id
          });
        };
        break;
        case '4': {
          this.$router.push({
            path: '/user/info/center/'
          });
        };
        break;
        default:
          console.log('error');
        }
      },
      signOut() {
        Network.post('/user/identity/logout').then(data => {
          console.log(data)
        })
        this.isLogin = false
        localStorage.clear()
        this.$router.push({
          path: '/'
        })
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    },
    mounted() {
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.isLogin = true
      }
      window.addEventListener('setItem', (e) => {
        this.user = JSON.parse(e.newValue)
      });
    }
  }
</script>

<style scoped>
  .el-drawer__body {
    overflow: auto;
  }

  .el-drawer {
    width: 23rem !important;
  }

  .el-drawer__container ::-webkit-scrollbar {
    display: none;
  }

  body::-webkit-scrollbar {
    display: none;
  }

  .my-dropdown-menu a {
    text-decoration: none;
    color: rgba(15, 1, 50, 0.8);
  }

  .user-icon {
    position: absolute;
    top: -18px;
    width: 4rem;
    height: 4rem;
  }

  .menu-a {
    text-decoration: none;
  }

  .li-after::after {
    content: "";
    background-color: pink;
    width: 0rem;
    height: 0.5rem;
    display: block;
    position: relative;
    top: -1rem;
    transition: width 1s;
  }

  .li-after:hover::after {
    width: 100px;
  }

  .headermenu {
    list-style: none;
    margin-top: 0;
  }

  .headermenu li {
    display: inline-block;
    width: 100px;
    height: 3.3rem;
  }

  .li-after {
    text-align: center;
  }

  .menu-font {
    font-size: 1.5rem;
    font-weight: bold;
    color: lightpink;
    transition: opacity 0.5s;
  }

  .menu-font:hover {
    opacity: 0.7;
  }

  .headerleft {
    margin-left: 2%;
    margin-top: 0.625rem;
    display: inline-block;
  }

  .headerright {
    display: inline-block;
    float: right;
  }

  .myheader {
    background-color: transparent;
    height: 130px;
    width: 100%;
    transition: background-color 0.4s;
  }

  .myheader:hover {
    background-color: rgba(255, 247, 255, 0.8);
  }

  .logo {
    text-decoration: none;
    color: pink;
    font-size: 3rem;
  }

  .logo:hover i {
    animation-name: logo-rate;
    animation-iteration-count: infinite;
    animation-duration: 6s;
    animation-direction: normal;
    animation-timing-function: linear;
  }

  @keyframes logo-rate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .tag-link {
    text-decoration: none;
    color: lightpink;
  }
</style>
