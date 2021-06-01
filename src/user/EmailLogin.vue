<template>
  <div>
    <p style="text-align: center;font-size: 25px;color: lightpink;font-weight: 900;">Sign In</p>
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="90px" class="login-form">
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="loginForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div class="option-button-div">
      <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
    </div>
  </div>
</template>

<script>
  import myHeader from '../page/Header.vue'
  import myFooter from '../page/Footer.vue'
  import Network from '../api/network.js'


  export default {
    name: 'emailLogin',
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
      return {
        loginForm: {
          pass: '',
          email: ''
        },
        rules: {
          pass: [{
            validator: validate,
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
            Network.post('/user/identity/email/login', {
              email: this.loginForm.email,
              password: this.loginForm.pass
            }).then(data => {
              if (data.code != '200') {
                this.$message.error(data.message)
              } else {
                localStorage.setItem('token', data.data.token)
                let user = data.data.user;
                this.formatUserPhoto(user)
                localStorage.setItem('user', JSON.stringify(user))
                this.$router.push({
                  path: '/'
                })
              }
            })
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .login-form {
    width: 80%;
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
</style>
