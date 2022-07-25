<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
    
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    logout() {
      window.sessionStorage.setItem('token', '')
      this.$router.push('/Login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>