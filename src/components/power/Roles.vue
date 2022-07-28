<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" size="default" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vconter']" v-for="(item1, index1) in row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19" >
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vconter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" 
                      v-for="item3 in item2.children" 
                      :key="item3.id" closable 
                      @close="removeRightById(row, item3.id)">
                        {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            
            <!-- <pre>
              {{row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="{ row }">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showSetRightDialog(row)">分配权限</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </el-card>

    <!-- 添加用户的对话框  :visible.sync 显示和隐藏-->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%" 
      @close="addDalogClosed">
      <!-- 内容主体区域 -->
      <span>
        <!-- el-form element-ui 的表单组件 :model数据绑定 绑定要添加的表单上
             :rules是验证规则 -->
        <el-form :model="addFrom" ref="addFromRef" label-width="70px">
        <!-- prop 验证规则 -->
          <el-form-item label="角色名称">
            <el-input v-model="addFrom.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addFrom.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <span>
        <el-form :model="editForm" ref="addFromRef" label-width="70px">
          <el-form-item label="角色名称">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>>
        </el-form>
      </span>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer"> 
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { getRolesList, getRolesInfo, editRolesInfo, deleteRolesInfo, addRolesInfo, deleteRolesPower, getAllpower, rolesEmpower } from '@/network/roles'

export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 角色信息数据
      editForm: {},
      // 控制添加角色对话框的显示和隐藏
      addDialogVisible: false,
      // 添加角色的信息
      addFrom: {
        roleName: '',
        roleDesc: ''
      },
      // 控制设置权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 所以权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中节点 Id值 数组
      defKeys: [],
      // 分配权限该项的id
      roleId: ''
    }
  },
  methods: {
    // 获取所有角色列表数据
    getRolesList() {
      getRolesList().then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取角色列表失败!')
        this.rolesList = res.data
        this.$message.success('获取角色列表成功!')
      })
    },

    // 点击编辑 弹出修改角色信息对话框
    showEditDialog(id) {
      getRolesInfo(id).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('查询用户信息失败')
        this.editForm = res.data
        this.editDialogVisible = true
      })
    },
    // 监听修改角色信息对话框的关闭 重置表单 信息
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 监听添加角色信息对话框的关闭 重置表单 信息
    addDalogClosed() {
      // this.$refs.addFromRef.resetFields()
      this.addFrom.roleName = ''
      this.addFrom.roleDesc = ''
    },

    // 监听分配权限信息对话框的关闭 重置表单 信息
    setRightDialogClosed() {
      this.defKeys = []
    },

    // 点击确认 修改角色信息
    editUserInfo() {
      editRolesInfo(this.editForm.roleId, this.editForm.roleName, this.editForm.roleDesc).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('修改角色失败')
        this.getRolesList()
        this.editDialogVisible = false
        
      })
    },
    // 点击删除按钮 根据 id 删除该角色
    removeRolesById(rolesId, rightId) {
      // 弹框提示用户是否删除数据
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( () => {
        // 用户确认删除 res 打印的是 confirm
          // console.log(res);
          console.log(rolesId, rightId);
        deleteRolesInfo(rolesId, rightId).then(res => {
          // console.log(res);
          if (res.meta.status !== 200) return this.$message.error('删除失败!')
          this.$message.success('删除成功!')
          // 删除成功后重新请求数据  
           this.getRolesList()
        })
      }).catch( () => {
        // 用户取消删除 err 打印的是 concel
          // console.log(err);
          this.$message.info('已取消删除!')       
        });
    },
    // 添加 角色信息
    addRolesInfo() {
      addRolesInfo(this.addFrom.roleName, this.addFrom.roleDesc).then(res => {
        // console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加用户失败!')
        this.getRolesList()
        this.addDialogVisible = false
        
      })
    },
    // 根据id删除对于的权限
    removeRightById(row, rightId) {
      // 弹框提示用户是否删除
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then( () => {
        // 用户确认删除 res 打印的是 confirm
          // console.log(res);
          // console.log(rolesId, rightId);
        deleteRolesPower(row.id, rightId).then(res => {
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error('删除权限失败!')
          this.$message.success('删除权限成功!')
          // 删除成功后重新请求数据 会导致 权限的展开列表关闭
          //  this.getRolesList()
          // 因为返回的 data 是当前角色最新的数据 所以把最新的数据重新赋值给该角色就行
          row.children = res.data
        })
      }).catch( () => {
        // 用户取消删除 err 打印的是 concel
          // console.log(err);
          this.$message.info('已取消删除权限!')       
        });
    },
    // 展示分配权限的对话框 
    showSetRightDialog(row) {
      getAllpower().then( res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取所有权限失败')
        this.rightsList = res.data
        this.roleId = row.id
        // 通过递归获取第三级节点的id
        this.getleafKeys(row, this.defKeys)
        // console.log(this.defKeys);
        this.setRightDialogVisible = true
      })
    },
    // 通过递归的形式,获取角色下所有三级权限的id, 并保存到 defKeys 数值中 可以使 对话框打开时 默认选中已有权限
    getleafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getleafKeys(item, arr)
      })
    },
    // 点击确认为角色分配权限
    allotRight() {
      // getCheckedKeys 方法 是树状控件的 方法 获取 被选中的节点的key所组成的数组
      // getHalfCheckedKeys 方法 是树状控件的 方法 获取 被选中的节点的 key 所组成的数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      
      
      // 进行数组转换为字符串以逗号分隔
      const idStr = keys.join(',')
      // console.log(idStr);

      rolesEmpower(this.roleId, idStr).then(res => {
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('分配权限失败')
        this.getRolesList()
        this.$message.success('分配权限成功')
      })

    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}


.vconter {
  display: flex;
  align-items: center;
}
</style>