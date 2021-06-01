<template>
  <div class="root">
    <header>
      <myHeader></myHeader>
    </header>
    <div class="main">
      <div class="main-container">
        <div class="left">
          <!--        <el-menu default-active="1" @open="handleOpen" @close="handleClose" text-color="lightpink"
          active-text-color="white"> -->
          <el-menu default-active="1" @select="handleSelect">
            <el-menu-item index="1">
              <i class="el-icon-menu"></i>
              <span slot="title">头像</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-setting"></i>
              <span slot="title">基础信息</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-setting"></i>
              <span slot="title">账号安全</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="right">
          <userPhoto v-if="menuIndex==1"></userPhoto>
          <userBaseInfo v-if="menuIndex==2"></userBaseInfo>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '../../page/Header.vue'
  import myFooter from '../../page/Footer.vue'
  import Network from '../../api/network.js'
  import ImgSearch from './ImgSearch.vue'
  import userPhoto from './UserPhoto.vue'
  import userBaseInfo from './UserBaseInfo.vue'

  export default {
    name: 'userInfoCenter',
    components: {
      myHeader,
      myFooter,
      userPhoto,
      userBaseInfo
    },
    data() {
      return {
        menuIndex: 1,
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        srcList: [
          'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
        ]
      }
    },
    methods: {
      handleSelect(index, path) {
        if (index == 3) {
          this.$router.push({
            path: '/user/security/center'
          })
        } else {
          this.menuIndex = index
        }
      }
    },
    mounted() {

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
    box-shadow: 0px 0px 80px rgba(245, 180, 180, 1.0);
  }

  .left {
    width: 18%;
    float: left;
    display: inline-block;
    height: 100%;
  }

  .right {
    width: calc(82% - 1px);
    height: 1000px;
    display: inline-block;
    border-left: solid lightpink 1px;
  }

  .main-container {
    width: 100%;
    margin: 20px auto;
  }

  .el-menu-item.is-active,
  .el-menu-item:focus,
  .el-menu-item:hover {
    background-color: lightpink;
    color: white;
  }

  /* 左边菜单样式 */
  .el-menu-item {}
</style>
