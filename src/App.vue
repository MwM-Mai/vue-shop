<template>
  <div id="app">
    <!-- 在设置路由规则之后 还要放置路由占位符 router-view
         否则 Login 这些组件无法显示出来
    -->
    <router-view></router-view>   
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {

  }
}
</script>

<style>

</style>
