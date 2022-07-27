<template>
    <!-- element-ui 组件的布局容器 -->
    <el-container class="home-container">
    <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../../assets/image/home/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>

      <!-- 主体区域 -->
      <el-container>
      <!-- 侧边栏 -->
        <el-aside :width="isChang ? '60px' : '200px' ">
          <div class="toggle-button" @click="toggleChange">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            :default-active= this.$route.path 
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff" 
            unique-opened 
            :collapse="isChang" 
            :collapse-transition="false"
            router>
            <!-- 一级菜单 index 就是点击哪项哪项展开 只接收字符串 -->
            <el-submenu :index="item.path + ''" v-for="item in menusList" :key="item.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index=" '/' + childItem.path" v-for="childItem in item.children" :key="childItem.id" @click="saveNavState('/' + childItem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{childItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-container>
          <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
</template>

<script>
import { getMenuList } from '@/network/home.js'

export default {
  data() {
    return {
      // 左侧菜单数据
      menusList: [],
      // 自定义图标 通过 动态绑定 一级菜单的id 获取图标
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 侧边栏是否展开
      isChang: false
    }
  },
  methods: {
    // 点击 退出按钮 退出登录
    logout() {
      window.sessionStorage.setItem('token', '')
      this.$router.push('/Login')
    },

    // 点击 ||| 实现 侧边栏的折叠展开
    toggleChange() {
      this.isChang = !this.isChang
      console.log(this.isChang);
    },

    // 点击保存 childItem 的 path 值 到本地存储 动态绑定 default-active 实现 实现左侧 二级 子菜单 属于高亮状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
    
  },
  created() {
    // 获取所有菜单
    getMenuList().then(res => {
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.eeror(res.meta.msg)
      this.menusList = res.data
    })
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }  
  }
}

.el-menu {
  border: none;
}

.el-aside {
  background-color: #333744;
  border: none;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
 
.toggle-button {
  color: #fff;
  text-align: center;
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;    // 鼠标悬浮 显示小手图标
}
</style>