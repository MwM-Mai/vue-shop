<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border="" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="{ row }">
            <el-tag type="danger" v-if="row.pay_status">未付款</el-tag>
            <el-tag v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="{ row }">
            {{row.create_time | showTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-tooltip  effect="dark" content="修改订单地址" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="物流进度" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClose">      
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <!-- 时间线 -->
       <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
      </div>
</template>

<script>
import { getOrderList, getprogress } from "@/network/order"

import { fromatDate } from "@/components/filter/formatdate"

// 引入 省市县 的数据
import citydata from '@/components/address/citydata'

export default {
  filters: {
    showTime(value) {
      const date = new Date(value * 1000)
      return fromatDate(date)
    }
  },
  data() {
    return {
      // 获取订单数据对象
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
        // 用户 ID
        user_id: '',
        // 支付状态
        pay_status: '',
        // 是否发货
        is_send: '',
        // ['个人','公司']
        order_fapiao_title: '',
        // 公司名称
        order_fapiao_company: '',
        // 发票内容
        order_fapiao_content: '',
        // 发货地址
        consignee_addr: ''
      },
      // 总的数据条数
      total: 0,
      // 订单数据列表
      orderList: [],
      // 控制修改地址对话框的显示和隐藏
      addressVisible: false,
      // 修改地址的表单数据对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 修改地址的表单验证规则对象
      addressFormRules: {
        address1: [{ required: true, message: '请选中省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      // 省市县数据
      citydata,
      // 控制物流进度对话框显示和隐藏
      progressVisible: false,
      // 物流信息数据 接口挂了 只能写假的数据
      progressInfo: [
        {
          "time": "2018-05-10 09:39:00",
          "ftime": "2018-05-10 09:39:00",
          "context": "已签收,感谢使用顺丰,期待再次为您服务",
          "location": ""
        },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }
      ]
    }
  },
  methods: {
    // 发起请求获取订单列表数据
    getOrderList() {
      getOrderList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) return this.$message.error('获取订单列表数据失败')
        this.orderList = res.data.goods 
        this.total = res.data.total
        console.log(res);
      })
    },

    // 监听页面 pagesize 发生变化 触发事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听当前页码的变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击显示 编辑地址的对话框
    showBox() {
      this.addressVisible = true
    },
    // 监听表单是否关闭 重置表单信息
    addressDialogClose() {
      console.log(11);
      this.$refs.addressFormRef.resetFields()
    },
    // 点击显示 物流进度对话框
    showProgressBox() {
      // 接口挂了 请求不到数据 已请求后台就关闭
      // getprogress().then(res => {
      //   if (res.meta.status !== 200) return this.$message.error('获取物流进度失败')
      //   this.progressInfo = res.data
      this.progressVisible = true 
      //   console.log(res); 
      // })
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>