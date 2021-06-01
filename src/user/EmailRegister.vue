<template>
  <div>
    <p style="text-align: center;font-size: 25px;color: lightpink;font-weight: 900;">Sign Up</p>
    <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-width="90px" class="login-form">
      <el-form-item label="账号" prop="account">
        <el-input type="text" v-model="registerForm.account" autocomplete="off" class="register-input"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="registerForm.pass" autocomplete="off" class="register-input"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="registerForm.checkPass" autocomplete="off" class="register-input"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="registerForm.email" autocomplete="off" class="register-input"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="validateCode">
        <el-input type="text" v-model="registerForm.validateCode" autocomplete="off" class="register-input"></el-input>
        <el-button @click="sendRegisterCode()" :disabled="disabled1"
          style="background-color: lightpink;color: white;width: 20%;" type="text">发送</el-button>
      </el-form-item>
    </el-form>
    <div class="option-button-div">
      <el-button @click="submitForm('registerForm')">注册</el-button>
    </div>
  </div>
</template>

<script>
  import myHeader from '../page/Header.vue'
  import myFooter from '../page/Footer.vue'
  import Network from '../api/network.js'

  export default {
    name: 'emailRegister',
    components: {
      myHeader,
      myFooter
    },
    data() {
      var validate = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        }
        callback();
      };
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          if (value != this.registerForm.pass) {
            callback(new Error('两次密码输入不一致'))
          }
        }
        callback()
      };
      return {
        disabled1: false,
        registerForm: {
          account: '',
          checkPass: '',
          validateCode: '',
          pass: '',
          email: ''
        },
        rules: {
          account: [{
            validator: validate,
            trigger: 'blur'
          }],
          validateCode: [{
            validator: validate,
            trigger: 'blur'
          }],
          pass: [{
            validator: validate,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validateCheckPass,
            trigger: 'blur'
          }],
          email: [{
            validator: validate,
            trigger: 'blur'
          }, {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }]
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Network.post('/user/identity/register', {
              code: this.registerForm.validateCode,
              account: this.registerForm.account,
              email: this.registerForm.email,
              pwd: this.registerForm.checkPass
            }).then(data => {
              if (data.code != '200') {
                this.$message.error(data.message)
              } else {
                this.$alert('注册成功', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push({
                      path: '/login'
                    })
                  }
                });
              }
            })
          } else {
            return false;
          }
        });
      },
      sendRegisterCode() {
        if (this.registerForm.email == '') {

        }
        this.disabled1 = true
        setTimeout(() => {
          this.disabled1 = false
        }, 60000)
        Network.post('/user/msg/mail/register', {
          email: this.registerForm.email
        }).then(data => {
          if (data.code != '200') {
            this.$message.error('错误 : ' + data.message)
            this.disabled1 = false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-form {
    width: 100%;
    margin: 8% 10px;
    padding: 0 auto;
  }

  .option-button-div {
    margin-top: 66px;
    text-align: center;
  }

  .el-input__inner {
    height: 1.5625rem;
    border-color: transparent;
    background-color: rgba(255, 246, 254, 0.8);
  }

  .register-input {
    width: 70%;
  }
</style>
