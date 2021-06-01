<template>
  <div class="container">
    <div class="form-container">
      <el-form :model="user" status-icon :rules="rules" ref="baseInfoForm" label-width="100px" class="baseInfoForm">
        <el-form-item label="昵称" prop="username">
          <el-input type="text" v-model="user.username" autocomplete="off" class="form-inpu"></el-input>
        </el-form-item>
      </el-form>
      <div class="option-container">
        <el-button type="primary" @click="submitForm('baseInfoForm')">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Network from '../../api/network.js';
  export default {
    name: 'UserBaseInfo',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('昵称不能为空'));
        }
        callback()
      };
      return {
        user: {},
        rules: {
          username: [{
            validator: validatePass,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Network.post('/user/identity/info/modify', {
              username: this.user.username
            }).then(data => {
              if (data.code == '200') {
                this.$addStorageEvent(1, 'user', JSON.stringify(this.user))
                this.$message.info('修改成功')
              } else {
                this.$message.info(data.message)
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    created() {
      this.user = JSON.parse(localStorage.getItem('user'))
    }
  }
</script>

<style scoped>
  .container {
    width: 100%;
    margin-top: 60px;
  }

  .form-inpu {
    width: 30%;
  }

  .form-container {
    width: 100%;
  }

  .option-container {
    width: 100%;
    margin: 50px auto;
    text-align: center;
  }
</style>
