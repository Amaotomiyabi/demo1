<template>
  <div class="posts-root">
    <header class="headertop">
      <myHeader></myHeader>
    </header>
    <div class="posts-container">
      <div class="posts-left-container">
        <div class="posts-search-container">
          <form @submit.prevent="search" class="search-form">
            <el-autocomplete id="search-input" v-model="inputTag" :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容" @keyup.enter.native="search" @select="handleSelect">
            </el-autocomplete>
            <div style="margin:10px auto;color: lightpink;font-size:15px;float: right;"><label> 分辨率 ：</label>
              <el-input v-model="x" placeholder="1920" style="width:100px;" @keyup.enter.native="search"></el-input> *
              <el-input v-model="y" placeholder="1080" style="width:100px" @keyup.enter.native="search"></el-input>
            </div>
          </form>
        </div>
        <div class="posts-ul-container">
          <p class="tags-name">标签</p>
          <ul id="all-tags" class="tags">
            <li v-for="item in tags">
              <el-tag :hit="false" class="left-tag" :type="getHotTagType()" @click="searchByTag(item.name)">
                {{item.name}}
              </el-tag>
            </li>
          </ul>
        </div>
      </div>
      <div class="posts-rigth-container">
        <div class="posts-images-container">
          <span class="posts-bg-img" v-for="img in imgList">
            <router-link :to="'/post/'+img.id" class="img-a">
              <div class="img-parent-div"></div>
            </router-link>
            <el-image class="posts-image" :src="img.smallPath" :preview-src-list="[img.smallPath]" fit="scale-down" />
          </span>
          <div class="posts-page-plugins">
            <el-pagination background layout="prev, pager, next" :page-count="count"
              @current-change="handleCurrentChange" :current-page="currentPage">
            </el-pagination>
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
    name: 'posts',
    components: {
      myHeader,
      myFooter
    },
    data() {
      return {
        x: '',
        y: '',
        inputTag: '',
        imgList: [],
        count: 0,
        currentPage: 0,
        searchTags: [],
        hotTags: [],
        tags: []
      };
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
        for (var item of tags) {
          list.push({
            value: item.name
          })
        }
        return list
      },
      handleSelect(item) {
        this.inputTag = item.value
      },
      // 通过TAG搜索图片
      search() {
        this.$router.push({
          path: '/posts/' + this.inputTag,
          query: {
            x: this.x,
            y: this.y
          }
        })
        // this.leftTags()
        // this.handleCurrentChange(1)
        // window.location = '#/posts/' + this.inputTag
      },
      searchByTag(name) {
        this.inputTag = name
        this.search()
      },
      // 分页事件
      handleCurrentChange(val) {
        this.currentPage = val
        Network.get('/business/picture/list', {
          tags: this.inputTag,
          size: 18,
          x: this.x,
          y: this.y,
          page: val
        }).then(data => {
          this.count = parseInt(data.pages)
          this.imgList = data.data
        })
      },
      //展示标签
      leftTags() {
        Network.get('/business/tag/association/list', {
          name: this.inputTag,
          size: 50,
          sort: 1
        }).then(data => {
          this.tags = data.data
        })
      },
      initView() {
        if (this.$route.params.tag) {
          this.inputTag = this.$route.params.tag
        } else {
          this.inputTag = ''
        }
        this.handleCurrentChange(1)
        this.leftTags()
        this.loadAll()
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
  .posts-root {
    width: 100%;
    background: url(../../static/img/kyotoanimation.png);
    position: relative;
    height: 100vh;
    min-height: 1080px;
  }

  .posts-search-container {
    width: 100%;
    height: 100px;
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
    width: 100%;
  }

  #search-input {
    width: 100%;
  }

  .posts-container {
    position: relative;
    height: calc(100% - 130px);
  }

  .posts-left-container {
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

  .posts-ul-container {
    overflow: scroll;
    overflow-x: hidden;
    height: calc(100% - 100px);
    width: 100%;
  }

  .posts-ul-container::-webkit-scrollbar {
    width: 18px;
  }

  .posts-ul-container::-webkit-scrollbar-track {

    background-color: rgba(255, 198, 206, 0.7);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  .posts-ul-container::-webkit-scrollbar-thumb {
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

  /*  .tags li:hover {
    background-color: rgba(255, 192, 201, 0.5);
  } */

  /*  .tags li:hover a {
    color: rgba(255, 112, 181, 1.0);
  } */

  .tag-link {
    text-decoration: none;
    color: rgba(255, 111, 113, 1.0);
  }

  .posts-rigth-container {
    width: calc(100% - 300px);
    height: calc(100% - 1rem);
    display: inline-block;
    border-top: pink solid 0.225rem;
    border-bottom: pink solid 0.225rem;
    border-radius: 2.5rem;
    overflow: scroll;
    overflow-x: hidden;
    background-color: rgba(255, 246, 250, 0.6);
    margin-top: 1rem;
  }

  .posts-rigth-container::-webkit-scrollbar {
    width: 0px;
  }

  .posts-rigth-container::before {
    content: '';
    position: absolute;
    width: calc(100% - 300px);
    top: 0rem;
    height: 1rem;
    background:
      linear-gradient(135deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%),
      linear-gradient(45deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%);
    background-size: 3rem 0.5rem;
    background-repeat: repeat-x, repeat-x;
  }

  .posts-images-container {
    width: 100%;
  }

  .img-a {
    color: pink;
    text-decoration: none;
    font-size: 0.5rem;
  }

  .img-parent-div {
    background-color: pink;
    margin: 0 auto;
    width: 85%;
    opacity: 0.5;
    height: 0.7rem;
    transition: all 0.5s;
  }

  .img-parent-div:hover {
    background-color: hotpink;
  }

  .posts-image {
    border: transparent;
    border-radius: 1.875rem;
    width: 100%;
    height: 100%;
    transition: 0.2s;
    box-shadow: 1px 1px 10px rgba(255, 224, 250, 0.6);
  }

  img:hover {
    transform: scale(1.2);
  }

  .posts-bg-img {
    width: calc(10vw);
    height: calc(10vw);
    text-align: center;
    display: inline-block;
    margin: 1.7rem calc(2vw);
    overflow: hidden;
    margin-top: 1.7rem;
  }

  .posts-page-plugins {
    width: 100%;
    text-align: center;
    padding: 0;
    padding-top: 4.25rem;
    bottom: 0rem;
  }

  .el-pagination {
    margin: 0 auto;
    padding: 0;
    left: 0;
    right: 0;
  }
</style>
