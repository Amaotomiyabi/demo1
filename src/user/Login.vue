<template>
  <div class="root">
    <header class="index-header-top">
      <myHeader></myHeader>
    </header>
    <div class="login-container">
      <component :is="loginComponent"></component>
      <div class="login-optional">
        <el-link href="/#/register" class="link-style">没有账号？点击注册</el-link>
        <el-link href="/#/register" class="link-style">忘记密码</el-link>
      </div>
      <div class="login-optional">
        <el-button icon="el-icon-s-custom" circle type="text" class="icon-style" @click='accountButton()'
          v-if="currentButton!=1"></el-button>
        <el-button icon="el-icon-message" circle type="text" class="icon-style" @click='emailButton()'
          v-if="currentButton!=2"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../page/Header.vue'
  import myFooter from '../page/Footer.vue'
  import Network from '../api/network.js'
  import accountComponent from './AccountLogin.vue'
  import emailComponent from './EmailLogin.vue'


  export default {
    name: 'login',
    components: {
      myHeader,
      myFooter,
      accountComponent,
      emailComponent
    },
    data() {
      return {
        currentButton: 1,
        loginComponent: 'accountComponent'
      }
    },
    methods: {
      emailButton() {
        this.loginComponent = 'emailComponent'
        this.currentButton = 2
      },
      accountButton() {
        this.loginComponent = 'accountComponent'
        this.currentButton = 1
      }
    }
  }
</script>

<style scoped>
  .root {
    width: 100%;
    background: url(../../static/background/wallhaven-x8e27l.png) no-repeat;
    background-position: center;
    background-size: cover;
    position: absolute;
    height: 100vh;
    min-height: 1080px;
  }

  .login-container {
    background-color: rgba(255, 247, 255, 0.7);
    border-radius: 0.2rem;
    width: 25rem;
    margin: 0 auto;
    margin-top: 150px;
    margin-bottom: 150px;
    padding: 1.25rem 0;
    height: 400px;
  }

  .login-optional {
    text-align: center;
    margin-top: 20px;
  }

  .icon-style {
    background-color: rgba(255, 151, 167, 0.6);
  }

  .link-style {
    margin-left: 20px;
  }
</style>
