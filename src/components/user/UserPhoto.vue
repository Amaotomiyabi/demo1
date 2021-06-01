<template>
  <div class="photo-container">
    <div class="photo-div">
      <el-image :src="user.photo.smallPath" :preview-src-list="[user.photo.path]" class="photo-image" fit="cover">
      </el-image>
    </div>
    <div class="photo-modify">
      <el-button type="text" @click="toggleShow" class="btn">更换头像</el-button>
      <div>
        <myUpload field="file" @crop-success="cropSuccess" @crop-upload-success="cropUploadSuccess"
          @crop-upload-fail="cropUploadFail" v-model="show" :width="300" :height="300" :url="url" :headers="header"
          img-format="png" v-if="show"></myUpload>
      </div>
    </div>
  </div>
</template>

<script>
  import Network from '../../api/network.js';
  import myUpload from 'vue-image-crop-upload/upload-2.vue';
  export default {
    name: 'UserPhoto',
    components: {
      myUpload
    },
    data() {
      return {
        header: {},
        user: {},
        show: false,
        url: 'http://localhost:8847/api/user/identity/photo/upload'
      }
    },
    methods: {
      toggleShow() {
        this.show = !this.show;
      },
      /**
       * crop success
       *
       * [param] imgDataUrl
       * [param] field
       */
      cropSuccess(imgDataUrl, field) {},
      /**
       * upload success
       *
       * [param] jsonData  server api return data, already json encode
       * [param] field
       */
      cropUploadSuccess(jsonData, field) {
        this.user.photo = jsonData.data
        this.$addStorageEvent(1, 'user', JSON.stringify(this.user))
      },
      /**
       * upload fail
       *
       * [param] status    server api return error status, like 500
       * [param] field
       */
      cropUploadFail(status, field) {}
    },
    mounted() {
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'))
        this.header = {
          token: localStorage.getItem('token')
        }
      }
    },
    created() {
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user'))
      }
    }
  }
</script>

<style scoped>
  .photo-container {
    width: 100%;
    margin-top: 60px;
  }

  .photo-div {
    margin: 0 auto;
    width: 200px;
    height: 200px;
    display: block;
  }

  .photo-image {
    width: 100%;
    height: 100%;
    border-radius: 100px;
  }

  .photo-modify {
    margin: 30px auto;
    text-align: center;
  }

  .btn {
    color: lightpink;
  }
</style>
