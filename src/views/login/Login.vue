<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avater-box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.userName"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
      
    </div>
  </div>
</template>

<script>
import { getLogin } from '@/network/login.js'


export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        userName: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {


    // 点击重置按钮 重置登录表单 
    resetLoginForm() {
      // console.log(this);
      // 对整个表单进行重置，移除校验结果
      this.$refs.loginFormRef.resetFields()
      // 由于 数据是双向绑定的 所有 清空数据
      this.loginForm.userName = ''
      this.loginForm.password = ''
    },
    // 点击登录按钮
    login() {
      this.$refs.loginFormRef.validate((value) => {
        // console.log(value);  element ui 的 表单方法 validate 有两个参数 （boolean，obj）
        if (!value) return
        getLogin(this.loginForm.userName, this.loginForm.password).then( res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('登录失败!')   // this.$message 是 element-ui 组件库 的Message 组件的全局挂载
          this.$message.success('登录成功')
          // 1. 将登录成功之后的 token 保存到客户端的 sessionStorage 中
          //   1.1 项目中出现了登录之外的其他API接口， 必须在登录之后才能访问
          //   1.2 token 只应用在当前网站打开期间生效，所有将 token 保存到sessionStorage 中
          // 2. 通过编程式导航跳转到后台主页， 路由地址是 /home
          // console.log(res.data.token)
          window.sessionStorage.setItem("token", res.data.token)
          this.$router.push('/home')

          // 在 登录界面  跳转到 home 首页 需要设置访问权限 因为 home 需要登录才能跳转 否者 跳转回登录界面
          // 因此 要在 router.js 设置路由导航守卫 router.beforeEach(to, from, next)
 
        })
        
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avater-box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee ;
    }
  }
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.btns {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
}


</style>