<template>
  <div class="container">
    <div class="form-container">
      <el-form :model="userForm" status-icon :rules="rules" ref="form1" label-width="100px" class="form1">
        <el-form-item label="原密码" prop="oPwd">
          <el-input type="password" v-model="userForm.oPwd" autocomplete="off" class="form-inpu"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="userForm.password" autocomplete="off" class="form-inpu"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password" v-model="userForm.checkPwd" autocomplete="off" class="form-inpu"></el-input>
        </el-form-item>
      </el-form>
      <div class="option-container">
        <el-button type="primary" @click="submitForm('form1')">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Network from '../../api/network.js';
  export default {
    name: 'modifyEmail',
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        }
        callback()
      };
      var validateCheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          if (value != this.userForm.password) {
            callback(new Error('两次密码输入不一致'))
          }
        }
        callback()
      };
      return {
        userForm: {
          oPwd: '',
          password: '',
          checkPwd: ''
        },
        rules: {
          oPwd: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPwd: [{
            validator: validateCheckPass,
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            Network.post('/user/identity/pwd/change', {
              oldPassword: this.userForm.oPwd,
              newPassword: this.userForm.checkPwd
            }).then(data => {
              if (data.code == '200') {
                if (data.data == 'success') {
                  localStorage.clear()
                  this.$alert('修改成功', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$router.push({
                        path: '/login'
                      })
                    }
                  });
                } else {
                  this.$message.info(data.data)
                }
              } else {
                this.$message.info(data.message)
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
  .container {
    width: 100%;
    margin-top: 60px;
  }

  .form-inpu {
    width: 250px;
  }

  .form-container {
    width: 100%;
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
