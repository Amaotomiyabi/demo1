<template>
  <div class="upload-img-form">
    <el-form ref="form" :model="form" label-width="150px" label-position="right">
      <el-form-item label="图片来源">
        <el-input v-model="form.source" placeholder="请选择图片的来源如:http://www.pixiv.com/123"
          class="input_ordinary float_left">
        </el-input>
      </el-form-item>
      <el-form-item label="图片标签">
        <el-tag :key="tag" v-for="tag in form.tags" closable :disable-transitions="false" @close="handleClose(tag)"
          effect="plain" class="float_left">
          {{tag}}
        </el-tag>
        <!--        <el-input class="input-new-tag float_left" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
          size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
        </el-input> -->
        <el-autocomplete v-if="inputVisible" class="input-new-tag float_left" v-model="inputValue" ref="saveTagInput"
          size="small" @keyup.enter.native="handleInputConfirm" :fetch-suggestions="querySearch"
          :trigger-on-focus="false" @select="handleSelect">
        </el-autocomplete>
        <el-button v-else class="button-new-tag float_left" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label="图片" prop="fileList">
        <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList"
          :on-change="imgOnChange" class="img_upload float_left">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <div>
        <el-button type="primary" @click="submitForm('form')">立即上传</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Network from '../api/network.js'

  export default {
    name: 'uploadImg',
    data() {
      return {
        inputVisible: false,
        inputValue: '',
        disabled: false,
        existTags: [],
        fileList: [],
        form: {
          tags: [],
          file: {},
          source: ''
        }
      }
    },
    methods: {
      submitForm() {
        if (this.fileList.length == 0) {
          alert('文件不能为空')
        }
        var formData = new FormData()
        this.form.tags.forEach(element => {
          formData.append('tags', element)
        })
        formData.append('file', this.fileList[0].raw)
        formData.append('isSexy', '0')
        formData.append('source', this.form.source)
        Network.upload('/business/picture/upload', formData).then(data => {
          if (data.code == '200') {
            this.$message.success('上传成功')
            this.resetForm()
          } else {
            this.$message.error(data.message)
          }
        })
      },
      querySearch(queryString, cb) {
        this.existTags = []
        Network.get('/business/tag/list', {
          name: this.inputValue
        }).then(data => {
          data.data.forEach(item => {
            this.existTags.push({
              value: item.name
            })
          })
        })
        cb(this.existTags);
      },
      handleSelect(item) {
        this.inputValue = item.value
      },
      resetForm() {
        this.form.tags = []
        this.form.file = {}
        this.form.source = ''
        this.existTags = []
        this.fileList = []
      },
      // 新增图片
      imgOnChange(file, fileList) {
        this.fileList = []
        this.fileList.push(file)
      },
      // 图片移除
      handleRemove(file) {
        this.fileList = []
      },
      //标签关闭
      handleClose(tag) {
        this.form.tags.splice(this.form.tags.indexOf(tag), 1);
      },
      //标签打开输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //标签输入框确认
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (this.form.tags.find(obj => obj == inputValue)) {
          alert('不能添加重复的标签')
          return
        }
        if (inputValue) {
          this.form.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
    }
  }
</script>

<style scoped>
  .el-tag+.el-tag {
    margin-left: 10px;
    margin-bottom: 5px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .input_ordinary {
    width: 50%;
    margin-left: 10px;
  }

  .img_upload {
    margin-left: 10px;
  }

  .float_left {
    float: left;
  }
</style>
