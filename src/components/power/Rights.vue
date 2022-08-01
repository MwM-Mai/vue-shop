<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="{ row }">
            <el-tag v-if="row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
  </div>
</template>

<script>
import { getRightsList } from '@/network/rights'

export default {
  data() {
    return {
      // 权限列表数据
      rightsList: []
    }
  },
  methods: {
    // 获取权限列表数据
    getRightsList() {
      getRightsList().then(res => {
        // console.log(res); 
        if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
        this.rightsList = res.data
        // console.log(this.rightsList);
      })
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>

</style>