<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row> 
      
      <!-- 表格区域 -->
      <tree-table :data="cateList" 
                  :columns="columns" 
                  :selection-type="false"
                  :expand-type="false"
                  :show-index="true"
                  index-text="#"
                  border
                  :show-row-hover="false"
                  class="tree-table">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="{ row }">
          <i class="el-icon-error" v-if="row.cate_delete === true" style="color: red"></i>
          <i class="el-icon-success" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="setCategoriesInfo(row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateById(row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
       <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose">
      <!-- 添加分类的表单 -->
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px" :rules="addCateFormRules">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择器 options 指定数据源 prop用来指定对象 v-model 选择器选中 的父级分类 id 数组 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            @change="ParentCateHandleChanged"
            :props="cascaderProps" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      @close="editCateDialogClosed">
      <span>
        <el-form :model="setCateInfo" :rules="editFormCate" ref="editCateRef" label-width="90px">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="setCateInfo.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, getParentCateList, addCate, getCategoriesInfo, setCateInfo, deleteCateInfo } from '@/network/cate'

export default {
  data() {
    return {
      // 查询商品数据的条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5 
      },
      // 商品分类的数据列表,默认为空
      cateList: [],
      // 商品分类的总数居条数
      total: 0,
      // 为 treee-table 指定列的定义 
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // type: 'tempale' 表示将当前列定义为模板列  插槽
        type: 'template',
        // 表示当前这列使用的模板名称
        template: 'isok'
      }, {
        label: '排序',
        // type: 'tempale' 表示将当前列定义为模板列  插槽
        type: 'template',
        // 表示当前这列使用的模板名称
        template: 'order'
      }, {
        label: '操作',
        // type: 'tempale' 表示将当前列定义为模板列  插槽
        type: 'template',
        // 表示当前这列使用的模板名称
        template: 'opt'

      }],
      // 控制添加分类对话框的显示和隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 父级分类的id
        cat_pid: 0,
        // 将要添加分类的名称
        cat_name: '',
        // 分类等级 默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类的验证规则
      addCateFormRules:{
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',  // 具体选中哪个属性的 key
        label: 'cat_name',  // 指定所看到的属性
        children: 'children',  // 指定父子嵌套用的是哪个属性
        expandTrigger: 'hover',   // 鼠标悬浮显示出选项列表
        checkStrictly: true    // 是否可选父属性
      },
      // 选择器选中 的父级分类 id 数组
      selectedKeys: [],
      // 编辑分类
      setCateInfo: {},
      // 编辑分类商品的验证规则
      editFormCate: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 控制编辑商品分类对话框的显示和隐藏
      editCateDialogVisible: false
    }
  },
  methods: {
    getCateList() {
      getCateList(this.queryInfo).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')
        this.cateList = res.data.result
        this.total = res.data.total
        this.$message.success('获取商品分类成功')
      })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击 添加分类的 按钮 展示添加分类对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表 
      getParentCateList(2).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取父级分类数据失败')
        this.parentCateList = res.data
        // console.log(this.parentCateList)
        this.addCateDialogVisible = true
        
      })
    },
    // 监听级联选择器 选择项发生变化触发这个函数
    ParentCateHandleChanged() {
      // console.log(this.selectedKeys);
      // 如果 selectedKeys 数组中的 lenght 大于 0 证明选中了父级分类
      // 否之没有选中父级分类 默认分类等级问 一级
      if (this.selectedKeys.length > 0) {
        // 数组最后一项是要添加分类的父级 id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        // console.log(this.addCateForm.cat_level);
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击确定按钮 添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate( callback => {
        // console.log(callback);
        if (!callback) return
        // 调用请求添加商品分类的 接口函数
        addCate(this.addCateForm.cat_name, this.addCateForm.cat_pid, this.addCateForm.cat_level).then( res => {
          // console.log(res);
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 监听 添加分类对话框的 关闭 重置 addCateForm 添加分类对象的 属性值 和 父级分类的 id 数组
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      // 级联选择器中的 父级分类 数组 清空
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      // console.log(this.addCateForm)
    },
    // 点击编辑 打开编辑对话框
    setCategoriesInfo(row) {
      // console.log(row);
      getCategoriesInfo(row.cat_id).then(res => {
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.setCateInfo = res.data
        this.editCateDialogVisible = true
      })
    },
    // 监听 编辑商品分类对话框 关闭 重置信息
    editCateDialogClosed() {
      this.setCateInfo = {}
    },
    // 点击确定 修改商品分类的信息
    setCate() {
      this.$refs.editCateRef.validate(callback => {
        if (!callback) return
        setCateInfo(this.setCateInfo.cat_id, this.setCateInfo.cat_name).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getCateList()
        })
      })
      this.editCateDialogVisible = false
    },
    // 点击删除按钮 根据 id 删除该角色
    removeCateById(cateId) {
      // 弹框提示用户是否删除数据
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( () => {
        // 用户确认删除 res 打印的是 confirm
          // console.log(res);
          console.log(cateId);
        deleteCateInfo(cateId).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('删除失败!')
          this.$message.success('删除成功!')
          // 删除成功后重新请求数据  
           this.getCateList()
        })
      }).catch( () => {
        // 用户取消删除 err 打印的是 concel
          // console.log(err);
          this.$message.info('已取消删除!')       
        });
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}



</style>