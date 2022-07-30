
<!-- 解决了 element-ui 的标签页组件 切换时数据抖动一下的问题 -->


<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
     <el-alert title="注意: 只允许第三级分类设计相关参数!" type="warning" show-icon :closable="false"></el-alert>

     <!-- 选择商品分类区域 -->
     <el-row>
      <el-col>
        <span>选择商品分类:</span>
        <!-- 选择商品分类的级联选择框 -->
        <el-cascader
          v-model="selectedKeys"
          :options="categoriesList"
          :props="cateProps"
          @change="handleChange"></el-cascader>
      </el-col>
     </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 --> 
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe v-if="activeName === 'many'">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, index) in row.attr_vals" :key="index" closable @close="handleClose(row, index)">{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(row)">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="warning" @click="removeParams(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="nolyTableDate" border stripe v-if="activeName === 'only'">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="{ row }">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, index) in row.attr_vals" :key="index" closable @close="handleClose(row, index)">{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(row)">编辑</el-button>
                <el-button icon="el-icon-delete" size="mini" type="warning" @click="removeParams(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>


    <!-- 添加参数/属性的对话框 -->
    <el-dialog
      :title=" '添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose">
      <!-- 添加参数/属性的表单 -->
      <el-form ref="addFormRef" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

        <!-- 编辑参数/属性的对话框 -->
    <el-dialog
      :title=" '编辑' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose">
      <!-- 添加参数/属性的表单 -->
      <el-form ref="editFormRef" :model="editForm" label-width="100px" :rules="editFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { getcateList, getCurrentCateId, addParams, getParamsId, editParamsId, removeParamsId } from "@/network/params"

export default {
  data() {
    return {
      // 商品分类列表数据
      categoriesList: [],
      // 级联选择框 的配置对象
      cateProps: {
        // 指定选中的 id
        value: 'cat_id',
        // 指定看到的值
        label: 'cat_name',
        // 指定父子节点的嵌套
        children: 'children',
        // 指定级联选择框 是点击打开 还是悬浮打开 子选择框
        expandTrigger: 'hover'
      },
      // 级联选择框 双向绑定的 父级 id 数组
      selectedKeys: [],
      // 被激活的页签的名称 默认激活
      activeName: "many",
      // 动态参数面板的数据
      manyTableDate: [],
      // 静态参数面板的数据
      nolyTableDate: [],
      // 控制添加动态参数/静态属性的显示和隐藏
      addDialogVisible: false,
      // 添加参数/属性的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      // 控制编辑对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑对话框的表单数据对象
      editForm: {},
      // 编辑对话框的表单验证对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },

      // 每条数据的文本框和切换值都一样会产生联动效果 所有只能在每条数据添加属性

      // 控制按钮与文本框和按钮切换显示
      // inputVisible: false,
      // 文本框输入的内容
      // inputValue: ''
    }
  },
  methods: {
    getCateList() {
      getcateList().then( res => {
        if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
        this.categoriesList = res.data
        this.$message.success(res.meta.msg)
      })
    },
    // 级联选择框选中变化 会触发这个函数
    handleChange() {
      this.getParamsData()
    },
    // tab 页签 点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数的列表数据
    getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableDate = []
        this.nolyTableDate = []
        return
      }
      // 选中的是三级分类
      getCurrentCateId(this.cateId, this.activeName).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取参数列表失败!')
        // 将 每条数据中的attr_vals 转换为数组
        res.data.forEach( item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

          // 由于在data定义的 inputValue 和 inputVisible 受到 各条数据的影响 在不同的数据输入内容或者切换按钮和文本框都会产生
          // 联动效果 所有给每一天数据添加 inputValue 和 inputVisible 值 控制自己的显示和隐藏 和 输入框的文本
          // 添加布尔值控制文本框和按钮的切换
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })
        // console.log(res);

        // 判断获取到的是动态参数 还是静态参数
        if (this.activeName === 'many') {
          this.manyTableDate = res.data
        } else {
          this.nolyTableDate = res.data
        }
      })
    },
    // 监听添加对话框的关闭事件 重置 对话框的表单信息
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击对话框的确定按钮 添加参数/属性
    addParams() {
      // 在发起请求之前 对标的进行验证
      this.$refs.addFormRef.validate( callback => {
        // console.log(callback)
        if (!callback) return
        addParams(this.cateId, this.addForm.attr_name, this.activeName).then( res => {
          // console.log(res)
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.addDialogVisible = false
          this.getParamsData()
        })
      })
    },
    // 点击编辑按钮,展示修改对话框
    showEditDialog(row) {
      getParamsId(this.cateId, row.attr_id, this.activeName).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg) 
        this.editForm = res.data
        this.editDialogVisible = true

      })
    },
    // 监听编辑对话框的关闭事件 重置 对话框的表单信息
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 点击确认按钮修改编辑的对象参数信息
    editParams() {
      // 请求数据前 需要对表单精选验证
      // console.log(this.editForm);
      this.$refs.editFormRef.validate(callback => {
        if (!callback) return
        editParamsId(this.cateId, this.editForm.attr_id, this.editForm.attr_name, this.activeName, this.editForm.attr_vals).then(res => {
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
          this.getParamsData()
          // console.log(res)
        })
      })
    },
    // 根据id 删除对应的参数对象
    removeParams(row) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        removeParamsId(this.cateId, row.attr_id).then(res => {
          if (res.meta.status !== 200) return this.$message.error("删除失败")
          this.$message.success("删除成功!")
          this.getParamsData()
          })
        }).catch(() => {
          this.$message.inof('已取消删除!')
        })
    },
    // 文本框失去焦点或摁下回车键触发事件 
    handleInputConfirm(row) {
      console.log('ok')
      // trim() 方法 去除字符串两端的空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
        // 如果没有return 则证明输入的内容 需要做后续处理
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        // 保存到数据库
        this.setAttrVals(row)
      }
    },
    // 点击按钮展示文本框 隐藏按钮
    showInput (row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      // this.$nextTick() 方法作用 在页面上元素被重新渲染之后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 点击tag x号删除对应的参数可选项
    handleClose(row, index) {
      row.atte_vals = row.attr_vals.splice(index, 1)

      // 保存到数据库
      this.setAttrVals(row)
    },
    // 对 attr_vals 增加 或 删除操作 保存到数据库
    setAttrVals(row) {
      // 发起请求 保存到数据库中 在发请求保存到数据库前 需要对 row.attr_vals 进行转换为字符串
      const strAttr_vals = row.attr_vals.join(' ')
      // console.log(strAttr_vals);
      editParamsId(this.cateId, row.attr_id, row.attr_name, this.activeName, strAttr_vals).then( res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("修改参数项失败")
        this.$message.success('修改参数项成功')
      })
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    // 当商品的分类等级不是三级时,禁用按钮
    isBtnDisabled() {
      return this.selectedKeys.length !== 3
    },
    // 当前选中的三级分类Id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2] * 1
      } else {
        return null
      }
    },
    // 动态计算标题的文本
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    },
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>








