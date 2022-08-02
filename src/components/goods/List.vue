<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      
      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200px">
          <template v-slot="{ row }">
            {{ row.add_time | showDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作"  width="200px">
          <template v-slot="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 25]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total" background>
        </el-pagination>
    </el-card>
    
  </div>
</template>

<script>
import { getGoodsList, deletGoodsById } from "@/network/GoodsList"

// 导入 时间过滤器
import { fromatDate } from "@/components/filter/formatdate"

export default {
  filters: {
    showDate(value) {
      const date = new Date(value * 1000)

      return fromatDate(date)
    }
  },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数居条数
      total: 0
    }
  },
  methods: {
    // 根据分页获取对应的商品列表
    getGoodsList() {
      getGoodsList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
        // console.log(res);
        this.goodsList = res.data.goods
        this.total = res.data.total
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 当前页码 的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击删除按钮 删除该商品
    removeById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletGoodsById(id).then(res => {
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功!')
            this.getGoodsList()

          })
        }).catch(() => {
          this.$message.info('已取消删除!')        
        });
    },
    // 点击添加按钮跳转到添加商品的页面
    goAddpage() {
      this.$router.push('/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>

</style>