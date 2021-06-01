<template>
  <div class="root">
    <header class="headertop">
      <myHeader></myHeader>
    </header>
    <div class="container">
      <div class="left-container">
        <div class="search-container">
          <form @submit.prevent="search" class="search-form">
            <el-autocomplete id="search-input" v-model="inputTag" :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
          </form>
        </div>
        <div class="ul-container">
          <p class="tags-name">标签</p>
          <ul id="all-tags" class="tags">
            <li v-for="tag in img.tags">
              <router-link :to="'/posts/'+tag.name" class="tag-link" :title="tag.name">
                <el-tag :hit="false" class="left-tag" :type="getHotTagType()">
                  {{tag.name}}
                </el-tag>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="info-container" v-if="state">
          <div class="img-info author" style="height: 150px;">
            <span style="display: inline-block;width: 100px;">
              <router-link :to="img.uploader.id==null?'':'/user/info/index/' + img.uploader.id">
                <el-avatar :size="80" :src="uploaderSrc"></el-avatar>
              </router-link>
            </span>
            <span style="margin-left:0px ;display: inline-block; width: 150px;">
              <div class="uploader-info-container">昵称:{{img.uploader.username}}</div>
              <div class="uploader-info-container">作品:{{img.uploader.worksCount}}</div>
              <div class="uploader-info-container">粉丝:{{img.uploader.followerCount}}</div>
            </span>
          </div>
          <div class="img-info">ID:{{img.id}}</div>
          <div class="img-info">大小:{{img.size}}</div>
          <div class="img-info">分辨率:{{img.x}}*{{img.y}}</div>
          <div class="img-info">浏览:{{img.views}}</div>
          <div class="img-info">收藏:{{img.collection}} </div>
          <div class="img-info">点赞:{{img.approval}} </div>
          <div class="img-info">来源:<a :href="img.src" class="img-info-a" :title="img.src"
              target="_blank">{{img.src}}</a>
          </div>
          <div class="img-info">下载链接:<a :href="img.path" class="img-info-a" :title="img.path"
              target="_blank">{{img.path}}</a>
          </div>
        </div>
      </div>
      <div class="rigth-container">
        <div class="image-parent-container">
          <div class="post-image">
            <el-image class="image" :src="img.smallPath" :preview-src-list="[img.path]" alt="" fit="scale-down"
              v-if="state" />
            <div class="operation-container" v-if="opState">
              <vue-clap-button colorActive="lightpink" bgColor="transparent" class="clap-class" @cancel="unApproval()"
                @clap="approval()" :initClicked="approvalInit" />
              <vue-clap-button icon="star" colorActive="lightpink" bgColor="transparent" class="clap-class"
                @cancel="unCollect()" @clap="collect()" :initClicked="collectInit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import myHeader from '@/page/Header.vue'
  import myFooter from '@/page/Footer.vue'
  import Network from '../api/network.js'

  export default {
    name: 'post',
    components: {
      myHeader,
      myFooter
    },
    data() {
      return {
        uploaderSrc: '',
        opState: false,
        state: false,
        hotTags: [],
        imgTags: [],
        searchTags: [],
        inputTag: '',
        img: {},
        approvalInit: 0,
        collectInit: 0
      }
    },
    methods: {
      //随机获取标签样式
      getHotTagType() {
        let num = Math.floor(Math.random() * 4)
        switch (num) {
          case 0:
            return 'success';
          case 1:
            return 'info';
          case 2:
            return 'warning';
          case 3:
            return 'danger';
        }
      },
      //搜索标签
      loadAll() {
        Network.get('/business/tag/list')
          .then(data => {
            this.hotTags = this.formatHandle(data.data)
          })
      },
      querySearchAsync(queryString, cb) {
        clearTimeout(this.timeout)

        queryString && queryString.replace(/\s/g, '').length != 0 ?
          Network.get('/business/tag/list', {
            name: queryString,
            sort: 1
          })
          .then(data => {
            this.searchTags = this.formatHandle(data.data)
            cb(this.searchTags)
          }) : cb(this.hotTags)
      },
      formatHandle(tags) {
        var list = []
        for (let item of tags) {
          list.push({
            value: item.name
          })
        }
        return list
      },
      handleSelect(item) {
        this.inputTag = item.value
      },
      //通过TAG搜索图片
      search() {
        this.$router.push({
          path: '/posts/' + this.inputTag
        })
      },
      //根据ID搜索图片
      toImgParent() {
        let id = this.$route.params.id
        Network.get('/business/picture/info/' + id).then(data => {
          if (data.uploader != null) {
            if (data.uploader.photo != null) {
              this.uploaderSrc = data.uploader.photo.smallPath
            } else {
              this.uploaderSrc = "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
            }
          } else {
            data.uploader = {
              username: 'Miyabi',
              worksCount: '0',
              followerCount: '0'
            }
            this.uploaderSrc = "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          }
          this.img = data
          this.state = true
        })
      },
      // 点赞
      approval() {
        Network.post('/business/user/picture/approval', {
          pId: this.img.id
        }).then(data => {
          if (data.code != '200') {
            this.$message.warning(data.message)
          } else {
            this.img.approval++;
          }
        })
      },
      unApproval() {
        Network.post('/business/user/picture/approval/remove', {
          pId: this.img.id
        }).then(data => {
          if (data.code != '200') {
            this.$message.warning(data.message)
          } else {
            this.img.approval--;
          }
        })
      },
      // 收藏
      collect() {
        Network.post('/business/user/picture/collect', {
          pId: this.img.id
        }).then(data => {
          if (data.code != '200') {
            this.$message.warning(data.message)
          } else {
            this.img.collection++;
          }
        })
      },
      unCollect() {
        Network.post('/business/user/picture/collect/remove', {
          pId: this.img.id
        }).then(data => {
          if (data.code != '200') {
            this.$message.warning(data.message)
          } else {
            this.img.collection;
          }
        })
      },
      initView() {
        if (localStorage.getItem('token') != null) {
          Network.get('/business/user/picture/user/state', {
            pId: this.$route.params.id
          }).then(data => {
            this.approvalInit = data.approvalState ? 1 : 0
            this.collectInit = data.collectState ? 1 : 0
            this.opState = true
          })
        }
        this.loadAll()
        this.toImgParent()
      }
    },
    mounted() {
      this.initView()
    }
  }
</script>
<style scoped>
  .root {
    background: url(../../static/img/kyotoanimation.png);
    width: 100%;
    height: 100vh;
    min-height: 1080px;
  }

  .search-container {
    height: 4%;
    width: 100%;
    margin-bottom: 7px;
  }

  .el-autocomplete {
    height: 100%;
    width: 100%;
  }

  .el-input {
    height: 100%;
    width: 100%;
  }

  .search-form {
    height: 100%;
    width: 100%;
  }

  #search-input {
    height: 100%;
    width: 100%;
  }

  .container {
    height: calc(100% - 130px - 1rem);
    position: relative;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .left-container {
    background-color: white;
    float: left;
    width: 300px;
    height: 100%;
    display: inline-block;
  }

  .tags-name {
    background-color: rgba(255, 233, 245, 0.5);
    width: 100%;
    height: 1.875rem;
    text-align: center;
    padding-top: 0.5rem;
    margin: 0;
    color: rgba(255, 149, 197, 0.8);
    font-weight: bold;
  }

  .ul-container {
    overflow: scroll;
    overflow-x: hidden;
    height: calc(60% - 100px - 40px);
    width: 100%;
  }

  .ul-container::-webkit-scrollbar {
    width: 18px;
  }

  .ul-container::-webkit-scrollbar-track {

    background-color: rgba(255, 198, 206, 0.7);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  .ul-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 198, 206, 1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  .tags {
    list-style: none;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .tags li {
    width: 100%;
    height: 2.0rem;
    transition: background-color 0.4s;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .left-tag:hover {
    background-color: rgba(255, 192, 201, 0.5);
  }

  .left-tag {
    border: none;
    width: 100%;
  }

  .tag-link {
    text-decoration: none;
    color: rgba(255, 111, 113, 1.0);
  }

  .info-container {
    position: relative;
    top: 5%;
    height: calc(40% - 40px);
    background-color: white;
    position: relative;
    padding-left: 10%;
  }

  .img-info {
    font-size: 14px;
    color: rgba(103, 129, 123, 0.9);
    margin-top: 5%;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .img-info-a {
    color: rgba(255, 111, 113, 1.0);
    text-decoration: none;
  }

  .rigth-container {
    height: 100%;
    width: calc(100% - 300px);
    display: inline-block;
    float: right;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .rigth-container::before {
    content: '';
    position: absolute;
    width: calc(100% - 300px);
    height: 1rem;
    background:
      linear-gradient(135deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%),
      linear-gradient(45deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%);
    background-size: 3em 0.5em;
    background-repeat: repeat-x, repeat-x;
  }

  .image-parent-container {
    width: 100%;
    border-top: pink solid 0.225rem;
    border-bottom: pink solid 0.225rem;
    border-radius: 2.5rem;
    height: calc(100% - 1rem);
    background-color: rgba(255, 246, 250, 0.6);
    margin-top: 1rem;
    text-align: center;
  }

  .post-image {
    height: 80%;
    width: 80%;
    position: relative;
    top: 10%;
    display: inline-block;
  }

  .image {
    width: 100%;
    height: 100%;
  }

  .operation-container {
    margin: 0 auto;
    text-align: center;
    width: 100%;
  }

  .clap-class {
    display: inline-block;
    margin: 0 5px;
  }

  .uploader-info-container {
    margin-top: 10px;
    font-weight: bold;
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
