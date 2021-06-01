<template>
  <div class="container">
    <el-steps :active="active" finish-status="success" :space="400" style="margin-left:calc(50% - 250px/2);">
      <el-step title="验证旧邮箱"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div class="form-container" v-if="active==0">
      <el-form :model="form1" status-icon :rules="rules1" ref="form1" label-width="100px" class="form1">
        <el-form-item label="验证码" prop="validateCode">
          <el-input type="text" v-model="form1.validateCode" autocomplete="off" class="form-inpu"></el-input>
          <el-button type="primary" @click="sendOldCode()" :disabled="disabled1">发送</el-button>
        </el-form-item>
      </el-form>
      <div class="option-container">
        <el-button type="primary" @click="submitForm1('form1')">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Network from '../../api/network.js';
  export default {
    name: 'unBindEmail',
    data() {
      var validate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        }
        callback()
      };
      return {
        disabled1: false,
        active: 0,
        form1: {
          validateCode: '',
        },
        rules1: {
          validateCode: [{
            validator: validate,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      next() {
        if (this.active++ > 1) this.active = 0;
      },
      sendOldCode() {
        this.disabled1 = true
        setTimeout(() => {
          this.disabled1 = false
        }, 60000)
        Network.post('/user/msg/mail/remove').then(data => {
          if (data.code != '200') {
            this.disabled1 = false
            this.$message.error('错误 : ' + data.message)
          }
        })
      },
      submitForm1(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Network.post('/user/identity/email/remove', {
              code: this.form1.validateCode,
            }).then(data => {
              if (data.code == '200') {
                this.next()
                this.next()
              } else {
                this.$message.error('错误 : ' + data.message)
              }
            })
          } else {
            return false;
          }
        });
      }
    },
    mounted() {}
  }
</script>

<style scoped>
  .container {
    width: 100%;
    margin-top: 60px;
  }

  .form-inpu {
    width: 250px;
  }

  .form-container {
    width: 100%;
    margin-top: 100px;
  }

  .option-container {
    width: 100%;
    margin: 50px auto;
    text-align: center;
  }

  .form1 {
    margin-left: calc(50% - 350px/2);
  }
</style>
