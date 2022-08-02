<!-- 由于 axios 是异步请求 所以在页面渲染时 先渲染页面再 请求数据
     在这里 折线图渲染是同步操作 axios 是异步操作 要使用 async/await 异步请求同步化 
     或者在异步操作 完成后调用回调 渲染页面数据  -->


<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2. 为ECharts准备一个具有大小的(宽高)的Dom -->
      <div id="main" style="width: 750px;height:500px;"></div> 
    </el-card>
  </div>
</template>

<script>
// 1. 导入 ECharts 插件 实现数据绘制图表
import * as echarts from 'echarts';

import _ from 'lodash'

import { getreport } from "@/network/report"

export default {
  data() {
    return {
      // 需要合并的数据
      option: {
         title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    // 获取折线图数据
    getreport() {
      getreport().then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取折线图数据失败')
        // this.reportInfo = res.data
        // console.log(res.data);
        this.eCharts(res.data)
      })
    },

    eCharts(option) {
    // lodash 的 合并数据方法
    const result = _.merge(this.option, option)
    // console.log(result);

    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));

    // 4. 准备数据和配置项 绘制图表
    myChart.setOption(result);
    }
  },
  created() {
    
  },
  mounted() {
    this.getreport()
  }
}
</script>

<style lang="less" scoped>

</style>