<template>
  <div class="root">
    <header class="headertop">
      <myHeader></myHeader>
    </header>
    <div class="container">
      <div class="tags-container">
        <div class="search-container">
          <el-autocomplete id="search-input" v-model="state" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
            @select="handleSelect"></el-autocomplete>
        </div>
        <div class="tag-list-container">
          <div class="tag-list">
            <el-table class="tag-list-table" :data="tableData" :default-sort="{prop: 'date', order: 'descending'}"
              stripe>
              <el-table-column type="index">
              </el-table-column>
              <el-table-column prop="date" label="日期" sortable width="180">
              </el-table-column>
              <el-table-column prop="name" label="姓名" sortable width="180">
              </el-table-column>
              <el-table-column prop="address" label="地址" :formatter="formatter">
              </el-table-column>
            </el-table>
          </div>
          <div class="page-plugins">
            <el-pagination background layout="prev, pager, next" :total="1000">
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

  export default {
    name: 'Tags',
    components: {
      myHeader,
      myFooter
    },
    data() {
      return {
        fit: 'scale-down',
        srcList: [
          'static/img/e8ee2dd3-1022-494d-b7e9-1f5669cd183d.jpg',
          'static/img/e8ee2dd3-1022-494d-b7e9-1f5669cd183d.jpg'
        ],
        restaurants: [],
        state: '',
        timeout: null,
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          },
          {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      };
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      loadAll() {
        return [{
            "value": "三全鲜食（北新泾店）",
            "address": "长宁区新渔路144号"
          },
          {
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "address": "上海市长宁区淞虹路661号"
          },
          {
            "value": "新旺角茶餐厅",
            "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"
          },
          {
            "value": "泷千家(天山西路店)",
            "address": "天山西路438号"
          },
        ];
      },
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    mounted() {
      this.restaurants = this.loadAll();
    }
  }
 
</script>
<style>
  .root {
    background: url(../../static/img/kyotoanimation.png);
  }

  .container {
    height: calc(90vh);
    margin-top: 0px;
  }

  .tags-container {
    width: 100%;
    height: 98%;
    top: 0rem;
    position: relative;
    border-top: pink solid 0.225rem;
    border-bottom: pink solid 0.225rem;
    border-radius: 2.5rem;
    background-color: rgba(255, 246, 250, 0.6);
    overflow: scroll;
    overflow-x: hidden;
  }

  .tags-container::-webkit-scrollbar {
    display: none;
  }

  .tags-container::before {
    content: '';
    position: absolute;
    top: 5%;
    width: 100%;
    height: 1em;
    background:
      linear-gradient(135deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%),
      linear-gradient(45deg, transparent, transparent 45%, pink, transparent 55%, transparent 100%);
    background-size: 3em 0.5em;
    background-repeat: repeat-x, repeat-x;
  }

  .search-container {
    width: 100%;
    text-align: center;
    margin-top: 8%;
  }


  #search-input {
    height: calc(4vh);
    width: calc(30vw);
    border-radius: 3.125rem;
    color: pink;
    border-color: hotpink;
  }

  .tag-list-container {
    margin-top: 2%;
    text-align: center;
    width: 100%;
    margin: 2% auto;
  }

  .tag-list {
    width: 100%;
  }

  .tag-list-table {
    width: 70%;
    margin: 2% auto;
    border: pink solid 0.0625rem;
    border-radius: 1.25rem;
  }

  .page-plugins {
    width: 100%;
    text-align: center;
    height: 2rem;
    padding: 0;
    height: 7%;
    background-color: rgba(255, 246, 250, 0.6);
  }

  .el-pagination {
    margin: 0;
  }

  .footerbottom {
    margin-top: 1.25rem;
  }
</style>
