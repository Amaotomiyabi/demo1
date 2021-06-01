<template>
  <div class="root">
    <header>
      <myHeader></myHeader>
    </header>
    <div class="main">
      <div class="main-container">
        <component :is="currentComponent" v-if="show"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../page/Header.vue'
  import myFooter from '../../page/Footer.vue'
  import Network from '../../api/network.js'
  import modifyPassword from './ModifyPassword.vue'
  import modifyEmail from './ModifyEmail.vue'
  import unBindEmail from './UnbindEmail.vue'
  import bindEmail from './BindEmail.vue'

  export default {
    name: 'userSecurityModifyPage',

    components: {
      myHeader,
      myFooter,
      modifyPassword,
      modifyEmail,
      unBindEmail,
      bindEmail
    },
    data() {
      return {
        show: false,
        currentComponent: ''
      }
    },
    methods: {
      initView() {
        switch (this.$route.params.type) {
          case 'password':
            this.currentComponent = 'modifyPassword';
            break;
          case 'bindemail':
            this.currentComponent = 'bindEmail';
            break;
          case 'changeemail':
            this.currentComponent = 'modifyEmail';
            break;
          case 'unbindemail':
            this.currentComponent = 'unBindEmail';
            break;
          default:
            console.log('error')
        }
        this.show = true
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
</style>
