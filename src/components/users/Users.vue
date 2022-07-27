<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card >
      <!-- element-ui 的布局组件  -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column> <!-- 代表的是列 -->
        <el-table-column label="姓名" prop="username"></el-table-column> <!-- 代表的是列 -->
        <el-table-column label="邮箱" prop="email"></el-table-column> <!-- 代表的是列 -->
        <el-table-column label="电话" prop="mobile"></el-table-column> <!-- 代表的是列 -->
        <el-table-column label="角色" prop="role_name"></el-table-column> <!-- 代表的是列 -->
        <el-table-column label="状态">
          <!-- 使用作用域插槽必须要写在 template 模板里面 -->
          <template v-slot="{ row }">   <!-- 作用域插槽 子组件传递 row 数据 就是用户列表的某一行数据 -->
            <!-- {{row}} 显示的是 姓名 邮箱 ... 这些数据 -->
            <el-switch v-model="row.mg_state" @change="userStateChanged(row)">
            </el-switch>
          </template>
        </el-table-column> <!-- 代表的是列 -->
        <el-table-column label="操作" width="180px">
          <template v-slot="{ row }">
          <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
          </el-tooltip>
          </template>
        </el-table-column> <!-- 代表的是列 -->
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 4, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框  :visible.sync 显示和隐藏-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDalogClose">
      <!-- 内容主体区域 -->
      <span>
        <!-- el-form element-ui 的表单组件 :model数据绑定 绑定要添加的表单上
             :rules是验证规则 -->
        <el-form :model="addFrom" :rules="addFormRules" ref="addFromRef" label-width="70px">
        <!-- prop 验证规则 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFrom.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <span>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersList, userStateChanged, getNewuser, getUserId, editUserInfo, deleteUserInfo } from '@/network/users'

export default {
  data() {
    // 验证邮箱的自定义规则 三个参数 第一个是验证规则 第二个是验证的值 第三个是回调函数
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      // test 方法 要验证的字符串
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 验证手机号的自定义规则
    var checkmobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        // 搜索的关键字
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页多少条数据
        pagesize: 1
      },
      // 用户数据列表
      usersList: [],
      // 总数据
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据对象
      addFrom: {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 邮箱
        email: '',
        // 手机号码
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询的用户信息
      editForm: {},
      // 修改用户信息的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {validator: checkmobile, trigger: 'blur' }
        ]
      }
    } 
  },
  methods: {
    // 获取数据的方法
    getUsersList() {
      getUsersList(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.usersList = res.data.users
        this.total = res.data.total
      })
    },


    // 监听 pagesize 改变的事件 
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      // 当 当前每页的数据发生变化 重新请求数据
      this.getUsersList()
      if(this.queryInfo.pagenum * this.queryInfo.pagesize >= this.total) return this.$message('数据已到最后一页')
    },

    // 页码值要是发生了变化就会触发
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage
      this.getUsersList()
      if(this.queryInfo.pagenum * this.queryInfo.pagesize >= this.total) return this.$message('数据已到最后一页')
    },

    // 监听 switch 状态按钮 的变化
    userStateChanged(userinfo) { 
      // console.log(userinfo);
      // 调用请求函数 修改 状态按钮
      userStateChanged(userinfo).then(res => {
        console.log(res);  
        if (res.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败')
        }
        this.$message.success('更新用户状态成功')
      })
    },

    // 监听添加对话框的关闭事件
    addDalogClose() {
      this.$refs.addFromRef.resetFields()
    },

    // 点击确认后 添加新用户 关闭表单 进行预验证
    addUser() {
      this.$refs.addFromRef.validate(callback => {
        // console.log(callback);   返回的是 布尔值 
        if (!callback) return 
        // 验证通过后发起请求 添加新用户
        getNewuser(this.addFrom).then(res => {
          console.log(res);
          if(res.meta.status !== 201) return this.$message.error('res.meta.msg')
          this.addDialogVisible = false
          this.getUsersList()          
        })
      })
    },

    // 点击修改按钮 修改用户信息
    showEditDialog(id) {
      // console.log(id);
      // 通过点击修改用户的按钮 获取id 请求 改用户的数据
      getUserId(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = res.data
      })
      // 显示对话框 
      this.editDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      // 重置表单 的验证信息
      this.$refs.editFormRef.resetFields()
    },
    // 点击修改用户信息的对话框的确定按钮 修改用户信息并提交 
    editUserInfo() {
      // 提交前先对表单进行验证
      this.$refs.editFormRef.validate(callback => {
        // 验证未通过 返回
        if (!callback) return
        // 验证通过 请求接口 修改用户数据
        editUserInfo(this.editForm.id, this.editForm.email, this.editForm.mobile).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error(this.meta.msg)
          // 关闭对话框
          this.editDialogVisible = false
          // 重新请求数据
          this.getUsersList()
          // 提示修改成功
          this.$message.success('修改用户数据成功')
        })
      })
    },
    // 点击删除按钮 根据 id 删除该用户
    removeUserById(id) {
      // 弹框提示用户是否删除数据
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( () => {
        // 用户确认删除 res 打印的是 confirm
          // console.log(res);
          console.log(id);
        deleteUserInfo(id).then(res => {
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('删除失败!')
          this.$message.success('删除成功!')
          // 删除成功后重新请求数据  
          this.getUsersList()
        })
      }).catch( () => {
        // 用户取消删除 err 打印的是 concel
          // console.log(err);
          this.$message.info('已取消删除!')       
        });
    }
  },
  created() {
    // 获取用户的数据
    this.getUsersList()
  }
}
</script>

<style lang="less" scoped>

</style>