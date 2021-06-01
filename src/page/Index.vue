<template>
  <div class="index-root">
    <div class="index-container">
      <div class="index-top-container" style="background-image: url(../../static/background/wallhaven-pkoggj.jpg);">
        <header class="index-header-top">
          <myHeader></myHeader>
        </header>
        <div class="search">
          <form @submit.prevent="search">
            <el-autocomplete v-model="inputTag" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
              @select="handleSelect" :trigger-on-focus="true" id="searchinput" class="inline-input"
              ref="tagSearchInput">
              <i slot="prefix" class="el-input__icon el-icon-search" id="searchicon"></i>
            </el-autocomplete>
          </form>
        </div>
        <div id="banner_wave_1"></div>
        <div id="banner_wave_2"></div>
      </div>
      <!-- 下部 -->
      <div class="recommend-container">
        <el-button type="text" icon="el-icon-arrow-up" circle class="recommend-button recommend-button-top"
          @click="preImg()"></el-button>
        <div style="height: 100%;">
          <transition-group name="list" mode="out-in">
            <router-link :to="'/post/'+img.id" class="tag-link" v-for="img in currentRecommendImgs" :key="img.id">
              <span class="recommend-img-container" :style="{backgroundImage:'url('+img.smallPath+')'}">
              </span>
            </router-link>
          </transition-group>
        </div>
        <el-button type="text" icon="el-icon-arrow-down" circle class="recommend-button recommend-button-bottom"
          @click="nextImg()">
        </el-button>
      </div>
      <div class="index-bottom-container" id="particles-js">
        <div class="index-bottom-top">
          <i class="el-icon-s-promotion myicon"></i>
          <span class="s-tag left">Hot Images</span>
          <span class="s-tag right">HI
          </span>
          <hr class="indexhr bottom-top-hr" />
        </div>
        <div class="index-bottom1">
          <div class="bottom-carousel">
            <el-carousel :interval="4000" type="card">
              <el-carousel-item v-for="img in carouselImg" :key="img.id" class="hot-carousel">
                <router-link :to="'/post/'+img.id" class="tag-link">
                  <el-image :src="img.smallPath" fit="contain" class="hot-carousel-img" />
                </router-link>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="index-bottom-top">
          <i class="el-icon-reading myicon"></i>
          <span class="s-tag left">Hot tags</span>
          <span class="s-tag right">HT
          </span>
          <hr class="indexhr bottom-top-hr" />
        </div>
        <div class="index-bottom2">
          <div class="index-chap-left">
            <router-link :to="'/posts/'+tag.name" class="tag-link" v-for="tag in hotTags" :key="tag.id">
              <el-tag :type="getHotTagType()" style="width: 25%;overflow: hidden;text-overflow: ellipsis;">{{tag.name}}
              </el-tag>
            </router-link>
          </div>
          <div class="index-chap-right">
            <el-image src="/static/background/wallhaven-pkoggj.jpg" fit="cover" class="hot-carousel-img" />
          </div>
        </div>
        <div class="index-bottom-top">
          <i class="el-icon-star-off myicon"></i>
          <span class="s-tag left">New Images</span>
          <span class="s-tag right">NI
          </span>
          <hr class="indexhr bottom-top-hr" />
        </div>
        <ul class="list hot-url" v-infinite-scroll="load" infinite-scroll-disabled="disabled"
          infinite-scroll-distance="10" infinite-scroll-delay="400" infinite-scroll-immediate="true">
          <li class="index-list-item">
            <div class="index-new-imgs">
              <span class="index-bg-img" v-for="img in newImgs">
                <router-link :to="'/post/'+img.id" class="tag-link">
                  <el-image class="index-new-img" :src="img.smallPath" fit="scale-down" />
                </router-link>
              </span>
            </div>
          </li>
        </ul>
        <div class="index-bottom-alert">
          <p v-if="loading" class="imgalert">
            <i class="el-icon-loading"></i>
            加载中......
          </p>
          <p v-if="noMore" class="imgalert">哎呀，没有更多了(#^.^#)</p>
        </div>
        <div class="index-footer">
          <hr class="indexhr bottom-bottom-hr" />
          <myFooter></myFooter>
        </div>
      </div>
    </div>
    <el-backtop target=".index-container" :visibility-height="700" :right="40">
      <i class="el-icon-caret-top"></i>
    </el-backtop>
  </div>
</template>

<script>
  import myHeader from '@/page/Header.vue'
  import myFooter from '@/page/Footer.vue'
  import Network from '../api/network.js'

  export default {
    name: 'myIndex',
    components: {
      myHeader,
      myFooter
    },
    data() {
      return {
        currentRecommendPage: 1,
        currentRecommendImgs: [],
        allRecommendImgs: [],
        lastIndex: 0,
        firstIndex: 0,
        hotTags: [],
        searchHotTags: [],
        searchTags: [],
        inputTag: '',
        topBgUrl: '',
        carouselImg: [],
        currentPage: 1,
        newImgs: [],
        disabled: false,
        noMore: false,
        loading: false,
      };
    },
    methods: {
      // 推荐
      preImg() {
        if (this.firstIndex == 0) {
          if (this.currentRecommendPage != 1) {
            this.currentRecommendPage--
            getRecommendImg(25, 30)
            this.lastIndex == this.allRecommendImgs.length - 1
          }
        } else {
          this.currentRecommendImgs.pop()
          this.currentRecommendImgs.unshift(this.allRecommendImgs[--this.firstIndex])
          this.lastIndex--
        }
      },
      nextImg() {
        if (this.lastIndex == this.allRecommendImgs.length) {
          this.currentRecommendPage++
          getRecommendImg(null, null)
          this.firstIndex = 0
        } else {
          this.currentRecommendImgs.shift()
          this.currentRecommendImgs.push(this.allRecommendImgs[++this.lastIndex])
          this.firstIndex++
        }
      },
      getRecommendImg(s, e) {
        if (s == null || e == null) {
          s = 0
          e = 6
        }
        Network.get('/business/user/picture/list/recommend', {
          page: this.currentRecommendPage,
          size: 30
        }).then(data => {
          this.allRecommendImgs = data.data
          this.currentRecommendImgs = data.data.slice(s, e)
          if (this.currentRecommendImgs.length < 6) {
            this.lastIndex = this.currentRecommendImgs.length
          } else {
            this.lastIndex = 6
          }
        })
      },
      //无限滚动加载
      load() {
        this.loading = true
        this.disabled = true
        setTimeout(() => {
          Network.get('/business/picture/list', {
              page: this.currentPage,
              size: 20,
              isSexy: '0'
            })
            .then(data => {
              if (this.currentPage > parseInt(data.pages)) {
                this.noMore = true
                this.disabled = true
              } else {
                this.newImgs.push.apply(this.newImgs, data.data)
                this.noMore = false
                this.disabled = false
                this.currentPage += 1
              }
            })
          this.loading = false
        }, 500)
      },
      //搜索框事件
      querySearchAsync(queryString, cb) {
        this.inputTag && this.inputTag.replace(/\s/g, '').length != 0 ?
          Network.get('/business/tag/list', {
            name: this.inputTag,
            sort: 1
          })
          .then(data => {
            this.searchTags = this.formatHandle(data.data)
            cb(this.searchTags)
          }) : cb(this.searchHotTags)
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
        this.$refs['tagSearchInput'].focus()
      },
      //跳转至相关tag页面
      search() {
        this.$router.push({
          path: '/posts/' + this.inputTag
        })
      },
      // 获取热门图片
      getCarouselImgs() {
        Network.get('/business/picture/index/hot').then(data => {
          this.carouselImg = data.data
        })
      },
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
      initView() {
        if (localStorage.getItem('user') != null) {
          this.getRecommendImg(null, null)
        }
        this.getCarouselImgs()
        this.load()
        Network.get('/business/tag/list')
          .then(data => {
            this.searchHotTags = this.formatHandle(data.data)
          })
        Network.get('/business/tag/index/hot').then(data => {
          this.hotTags = data.data
        })
      }
    },
    mounted() {
      this.initView()
      window.addEventListener('setItem', (e) => {
        this.initView()
      });
    }
  }
</script>
<style>
  #searchinput {
    width: 45rem;
    height: 3.5625rem;
    border-color: pink;
    border-width: 0rem;
    border-radius: 2rem;
    background-color: rgba(245, 212, 217, 0.3);
    color: black;
    font-size: 1.25rem;
    transition: all 1s;
    text-align: center;
  }

  #searchinput:focus {
    text-align: left;
    background-color: white;
    padding-left: 3.3rem;
  }

  #searchicon {
    font-size: 2.5rem;
    margin-top: 0.6rem;
    margin-left: 18rem;
    color: pink;
    display: none;
    transition: all 0.8s;
  }

  #searchinput:focus+.el-input__prefix i {
    display: block;
    margin-left: 0.4rem;
  }
</style>
<style scoped>
  /* 文章部分 */
  .index-bottom2 {
    box-shadow: 0px 0px 80px rgba(245, 212, 217, 0.3);
    border-radius: 0.5rem;
    background-color: white;
    margin-bottom: 2rem;
    width: 100%;
    height: 18rem;
    /* position: relative; */
  }

  .index-chap-left {
    display: inline-block;
    width: 40%;
    float: left;
    color: mediumvioletred;
  }

  .chap-c1 {
    margin-left: 15%;
  }

  .chap-c2 {
    margin-left: 23%;
    font-size: 0.725rem;
  }

  .chap-c3 {
    /* position: absolute; */
    bottom: 2.25rem;
    margin-left: 6%;
  }

  .chap-c4 {
    /* position: absolute; */
    bottom: 0rem;
    margin-left: 10%;
  }

  .chap-c4-a {
    text-decoration: none;
    color: hotpink;
  }

  .index-chap-right {
    float: right;
    display: inline-block;
    width: 60%;
    height: 100%;
  }

  .index-container {
    top: 0px;
    position: relative;
    overflow-x: hidden;
    background-color: white;
  }

  .index-header-top {
    width: 100%;
  }

  .index-top-container {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    height: calc(100vh);
    /* position: relative; */
    margin: 0;
    padding: 0;
    top: 0;
  }

  .search {
    margin-top: 10%;
    text-align: center;
    width: 100%;
  }

  /*  波浪动画  */
  #banner_wave_1 {
    width: auto;
    height: 65px;
    background: url(https://cdn.jsdelivr.net/gh/Ukenn2112/UkennWeb@5.3/wave/wave1.png) repeat-x;
    _filter: alpha(opacity=80);
    position: absolute;
    bottom: 0;
    width: 400%;
    left: -236px;
    z-index: 1;
    opacity: 1;
    transiton-property: opacity, bottom;
    transition-duration: .4s, .4s;
    animation-name: move2;
    animation-duration: 240s;
    animation-fill-mode: backwards;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  #banner_wave_2 {
    width: auto;
    height: 80px;
    background: url(https://cdn.jsdelivr.net/gh/Ukenn2112/UkennWeb@5.3/wave/wave2.png) repeat-x;
    _filter: alpha(opacity=80);
    position: absolute;
    bottom: 0;
    width: 400%;
    left: 0;
    z-index: 0;
    opacity: 1;
    transiton-property: opacity, bottom;
    transition-duration: .4s, .4s;
    animation-name: move2;
    animation-duration: 160s;
    animation-fill-mode: backwards;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes move1 {
    100% {
      background-position: 100% 0;
    }
  }

  @keyframes move2 {
    100% {
      background-position: -100% 0;
    }
  }

  /*  波浪动画 END  */
  /* 下部布局 */
  .index-bottom-container {
    padding-top: 2rem;
    background-color: transparent;
    margin: 0 auto;
    left: 0;
    right: 0;
    /* width: 48.75rem; */
    width: 1000px;
    margin-bottom: 7rem;
    position: absolute;
  }

  .index-bottom-top {
    margin: 0 auto;
    width: 100%;
    margin-bottom: 1.7rem;
  }

  .index-bottom1 {
    box-shadow: 0px 0px 80px rgba(245, 212, 217, 0.3);
    border-radius: 0.5rem;
    background-color: white;
    margin-bottom: 2rem;
    padding-top: 0.625rem;
  }

  /* hr */
  .indexhr {
    /* 渐变 */
    /* background-image: linear-gradient(to right,rgba(0,0,0,0),pink,rgba(0,0,0,0)); */
    border: none;
    border-top: 8px dotted;
    color: pink;
    height: 6px;
    opacity: 0.3;
  }

  .bottom-top-hr {
    width: 100%;
  }

  .bottom-bottom-hr {
    width: 100%;
    margin-top: calc(4vh);
  }

  .myicon {
    font-size: 2rem;
    color: pink;
  }

  .right {
    margin-top: 0.925rem;
    float: right;
    color: black;
    opacity: 0.5;
  }

  .left {
    color: rgba(255, 166, 178, 1.0);
    font-size: 1.5rem;
    font-weight: bold;
  }

  /* 走马灯 */
  .bottom-carousel {
    margin: calc(1vh) 1.25rem;
  }

  .hot-carousel {
    width: 50%;
    height: 100%;
  }

  .hot-carousel-img {
    height: 100%;
    width: 100%;
  }

  .el-carousel__item h3 {
    color: #475669;
    opacity: 1;
    line-height: 100%;
    margin: 0;
  }

  .hot-url {
    box-shadow: 0px 0px 80px rgba(245, 212, 217, 0.4);
    border-radius: 0.5rem;
    background-color: rgba(255, 248, 255, 0.2);
    list-style: none;
    text-align: center;
    margin: 0;
    padding: 0;
  }

  .index-list-item {}

  .index-new-imgs {
    margin-bottom: calc(5vh);
    margin-top: 1rem;
  }


  .index-container::-webkit-scrollbar {
    width: 0.425rem;
  }

  .index-container::-webkit-scrollbar-track {
    background-color: rgba(255, 187, 197, 1.0);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  .index-container::-webkit-scrollbar-thumb {
    background-color: hotpink;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }


  /* 分栏间隔布局css */
  .index-bg-img {
    width: 160px;
    height: 160px;
    text-align: center;
    display: inline-block;
    margin: 2rem 15px;
    overflow: hidden;
  }

  .index-new-img {
    border: transparent;
    border-radius: 1.875rem;
    width: 100%;
    height: 100%;
    box-shadow: 1px 1px 10px rgba(255, 224, 250, 0.6);
    transition: all 0.8s;
  }

  .index-new-img:hover {
    transform: scale(1.2);
  }

  .index-bottom-alert {
    text-align: center;
    margin-bottom: calc(3vh);
  }

  .imgalert {
    color: pink;
    font-size: 1.5rem;
    opacity: 0.7;
  }

  /* 底部 */
  .index-footer {
    width: 100%;
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

  .recommend-container {
    padding-top: 20px;
    padding-bottom: 10px;
    height: 886px;
    width: 166px;
    background-color: transparent;
    top: 100vh;
    z-index: 10;
    border-radius: 30px;
    left: calc(calc(100vw - 1000px)/2 + 1080px);
    position: absolute;
    width: 166px;
  }

  .recommend-button {
    position: absolute;
    left: calc(50% - 20px);
    width: 40px;
    text-align: center;
    height: 40px;
    background-color: rgba(255, 219, 226, 0.4);
    border-radius: 20px;
  }

  .recommend-button-top {
    top: 2px;
  }

  .recommend-button-bottom {
    bottom: 10px;
  }

  .recommend-img-container {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;
    display: inline-block;
    width: 136px;
    height: 136px;
    margin: 2.5px 15px;
    border-radius: 4px;
  }
</style>
