<template>
  <div class="root">
    <header>
      <myHeader></myHeader>
    </header>
    <div class="main">
      <div class="main-container">
        <el-row class="security-container">
          <el-col :span="8">
            <div class="left-font-class"><i class="el-icon-success custom-icon-class custom-icon-class-success"></i>密码
            </div>
          </el-col>
          <el-col :span="10">
            <div class="font-center-class">正常</div>
          </el-col>
          <el-col :span="6" class="right-col">
            <div class="">
              <router-link to="/user/security/edit/password" class="router-link-class">
                <el-link class="a-link font-class">修改密码</el-link>
              </router-link>
            </div>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row class="security-container">
          <el-col :span="8">
            <div class="left-font-class"><i v-if="user.email!=null"
                class="el-icon-success custom-icon-class custom-icon-class-success"></i><i v-if="user.email==null"
                class="el-icon-warning custom-icon-class custom-icon-class-warning"></i>邮箱</div>
          </el-col>
          <el-col :span="10">
            <div class="font-center-class" v-if="user.email!=null">正常</div>
            <div class="font-center-class" v-if="user.email==null">未绑定邮箱</div>
          </el-col>
          <el-col :span="6" class="right-col">
            <div>
              <router-link to="/user/security/edit/bindemail" class="router-link-class" v-if="user.email==null">
                <el-link class="a-link font-class">绑定邮箱</el-link>
              </router-link>
              <router-link to="/user/security/edit/changeemail" class="router-link-class" v-if="user.email!=null">
                <el-link class="a-link font-class">更换邮箱</el-link>
              </router-link>
              <router-link to="/user/security/edit/unbindemail" class="router-link-class" v-if="user.email!=null">
                <el-link class="a-link font-class">解绑邮箱</el-link>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../page/Header.vue'
  import myFooter from '../../page/Footer.vue'
  import Network from '../../api/network.js'

  export default {
    name: 'userSecurityCenter',
    components: {
      myHeader,
      myFooter
    },
    data() {
      return {
        user: {}
      }
    },
    methods: {},
    mounted() {

    },
    created() {
      Network.get('/user/identity/details').then(data => {
        this.user = data
      })
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
    border-color: lightpink;
    border-width: 1px;
    border-style: solid;
    /* box-shadow: 0px 0px 80px rgba(245, 212, 217, 1); */
  }

  .font-class {
    font-size: 14px;
  }

  .left-font-class {
    font-size: 16px;
  }

  .font-center-class {
    font-size: 13px;
    color: #909399;
  }


  .main-container {
    width: 100%;
    margin: 200px auto;
  }

  .security-container {
    margin-top: 50px auto;
    padding-left: 100px;
  }

  .custom-icon-class {
    font-size: 20px;
    margin-right: 10px;
  }

  .custom-icon-class-warning {
    color: orange;
  }

  .custom-icon-class-success {
    color: limegreen;
  }

  .router-link-class {
    text-decoration: none;
    color: transparent;
  }

  .a-link {
    color: #409EFF;
  }

  .a-link:hover {
    color: lightpink;
    text-decoration-color: lightpink;
  }

  .right-col {
    text-align: center;
  }
</style>
