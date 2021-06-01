<template>
  <div class="root">
    <div class="img-container">
      <transition-group name="list" v-if="list1">
        <span class="img-span" v-for="img in imgs" :key="img.id">
          <router-link :to="'/post/'+img.id" class="img-a">
            <el-image class="images" :src="img.smallPath" fit="scale-down" />
          </router-link>
          <div style="float: right;color: #A6A6A6;margin-top: 0px;" v-if="deleteShowState">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteImg(img)"></el-button>
          </div>
        </span>
        <div class="page">
          <div class="posts-page-plugins">
            <el-pagination background layout="prev, pager, next" :page-count="pages"
              @current-change="handleCurrentChange" :current-page="currentPage">
            </el-pagination>
          </div>
        </div>
      </transition-group>
      <transition-group name="list" v-if="!list1">
        <span class="img-span" v-for="iU in imgs" :key="iU.id">
          <router-link v-if="iU.picture==null" to="" class="img-a">
            <el-image class="images">
            </el-image>
          </router-link>
          <router-link v-if="iU.picture!=null" :to="'/post/'+iU.picture.id" class="img-a">
            <el-image class="images" :src="iU.picture.smallPath" fit="scale-down" />
          </router-link>
          <div style="float: right;font-size:10px;color: #A6A6A6;margin-top: 0px;" v-if="deleteShowState">
            {{iU.browseTime}}{{iU.createTime}}
            <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteImg(iU)"></el-button>
          </div>
        </span>
      </transition-group>
      <div class="page" v-if="pagesButton">
        <div class="posts-page-plugins">
          <el-pagination background layout="prev, pager, next" :page-count="pages" @current-change="handleCurrentChange"
            :current-page="currentPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Network from '../../api/network.js'

  export default {
    name: 'ImgSearch',
    data() {
      return {
        list1: true,
        imgs: [],
        currentPage: 1,
        pages: 1,
        pagesButton: false
      }
    },
    props: {
      requestUrl: '',
      params: {},
      deleteShowState: false,
      deleteUrl: ''
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val
        let params = this.params
        params.page = this.currentPage
        Network.get(this.requestUrl, params).then(data => {
          this.pages = parseInt(data.pages)
          this.imgs = data.data
          this.pagesButton = true
        })
      },
      deleteImg(img) {
        Network.post(this.deleteUrl, {
          id: img.id
        }).then(data => {
          if (data.code == '200') {
            this.imgs.splice(this.imgs.indexOf(img), 1)
          } else {
            this.$message.error('删除失败 : ' + data.message)
          }
        })
      }
    },
    mounted() {
      if (this.requestUrl == '/business/user/picture/list/works') {
        this.list1 = true
      } else {
        this.list1 = false
      }
      this.handleCurrentChange(1)
    }
  }
</script>
<style scoped>
  .root {
    width: 100%;
  }

  .img-container {
    width: 100%;
    min-height: 500px;
  }

  .img-span {
    width: 222px;
    height: 222px;
    display: inline-block;
    margin: 30px 14px;
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s;
  }

  .list-leave-active {
    position: absolute;
  }

  .list-enter,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .list-move {
    transition: transform 0.5s;
  }


  .images {
    border: transparent;
    width: 100%;
    height: 100%;
    transition: 0.2s;
    box-shadow: 1px 1px 10px rgba(255, 224, 250, 0.6);
    transition: all 0.8s;
  }

  .images:hover {
    transform: scale(1.2);
  }

  .page {
    margin: 0 auto;
    text-align: center;
    margin-top: 15px;
  }
</style>
