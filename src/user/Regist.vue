<template>
  <div class="root">
    <header class="index-header-top">
      <myHeader></myHeader>
    </header>
    <div class="register-container">
      <component :is="registerComponent"></component>
    </div>
  </div>
</template>

<script>
  import myHeader from '../page/Header.vue'
  import myFooter from '../page/Footer.vue'
  import Network from '../api/network.js'
  import emailRegister from './EmailRegister.vue'


  export default {
    name: 'register',
    components: {
      myHeader,
      myFooter,
      emailRegister
    },
    data() {
      return {
        registerComponent: 'emailRegister'
      }
    },
    methods: {}
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

  .register-container {
    background-color: rgba(255, 247, 255, 0.7);
    border-radius: 0.2rem;
    width: 30rem;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 150px;
    padding: 1.25rem 0;
    height: 700px;
  }
</style>
