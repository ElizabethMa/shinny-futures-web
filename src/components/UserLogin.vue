<template>
  <div>
    <el-form :model="userForm" ref="userForm" size="small" label-position="right" label-width="80px">
        <h3 class="title">Shinny Tech Web</h3>
        <el-form-item label="期货公司" prop="bid" :rules="[{ required: true, message: '请选择期货公司'}]">
            <el-select v-model="userForm.bid" placeholder="请选择">
                <el-option v-for="(item,index) in brokers" :label="item" :value="item" :key="index"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="user_name" :rules="[{ required: true, message: '请输入账号'}]">
            <el-input placeholder="请输入账号" v-model="userForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码'}]">
            <el-input placeholder="请输入密码" type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" :loading="loading" @click="onSubmit('userForm')">立即登录</el-button>
        </el-form-item>
    </el-form>
    <div :style="{padding: '10px 40px'}">
        <el-alert v-if="showLoginError"
          title="等待回应超时"
          description='可能的原因 (1)服务器正在运维，(2)网络不通，无法连接服务器，请稍后/检查网络后重试。'
          type="error"
          center
          show-icon>
        </el-alert>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { DefaultUser } from '@/configs'
  export default {
    name: 'userLogin',
    data() {
      return {
        userForm: Object.assign({
          bid: '',
          user_name: '',
          password: ''
        }, DefaultUser),
        loading: false,
        showLoginError: false
      }
    },
    computed: {
      ...mapGetters({
        brokers: 'getBrokers'
      })
    },
    methods: {
      onSubmit(form) {
        this.loading = true
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$store.commit('LOGIN', {
              bid: this.userForm.bid,
              user_name: this.userForm.user_name,
              password: this.userForm.password
            })
            setTimeout((function(){
              if (this.$store.state.trading_day.length === 0) {
                this.loading = false
                this.showLoginError = true
              }
            }).bind(this), 10000)
          }
        })
      }
    }
  }
</script>
<style scoped>
    .title {
        margin: 10px auto;
    }
    .el-form {
        text-align: center;
        width: 280px;
        margin:  0 auto;
        background-color: white;
    }
    .el-select {
        width: 100%;
    }
    .el-form-item {
        margin-bottom: 20px;
    }

</style>
