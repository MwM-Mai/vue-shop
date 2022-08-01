<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <!-- 提示框 -->
        <el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeIndex * 1" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品照片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>


          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top"> 
            <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLvave" @tab-click="tabClicked">
              <!-- :before-leave="" 标签切换前的钩子 只要触发了这个属性就说明 将要进行标签切换 tab-click 选中时候触发 -->
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name" placeholder="" size="normal" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="addForm.goods_price" placeholder="" size="normal" clearable type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="addForm.goods_weight" placeholder="" size="normal" clearable type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="addForm.goods_number" placeholder="" size="normal" clearable type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                    v-model="addForm.goods_cat"
                    :options="cateList"
                    :props="cateProps"
                    @change="handleChange"></el-cascader>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <!-- 渲染表单的item项 -->
                <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                  <!-- 复选框组 -->
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="item2" v-for="(item2, index2) in item.attr_vals" :key="index2" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <!-- 渲染表单的item项 -->
                <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品照片" name="3">
                <!-- action 表示 图片要上传到的后台API接口 要写完整的API接口
                     on-preview 指定预览事件 就是点击预览图片
                     on-remove 点击 x 时触发事件
                     file-listc 处理文件列表的
                     headers 因为除了登录页面以外的所有请求都要 授权 所有要设置请求头
                     on-success 文件上传成功的钩子函数 -->
                <el-upload
                  action="http://127.0.0.1:8888/api/private/v1/upload"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  list-type="picture"
                  :headers="headersObj"
                  :on-success="headerSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <!-- 富文本编辑器组件 -->
                <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                <!-- 添加商品的按钮 -->
                <el-button type="primary" @click="add" class="btnAdd">添加商品</el-button>
                
              </el-tab-pane>
            </el-tabs>
          </el-form>


    </el-card>


    <!-- 预览图片的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewPathVisible"
      width="50%">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
// 引用 lodash 工具库 实现 深拷贝
import _ from 'lodash'

import { getCateList } from "@/network/cate"
import { getCurrentCateId } from "@/network/params"
import { addGoods } from '@/network/GoodsList'

export default {
  data() {
    return {
      // 步骤条的激活项
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品总量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 商品图片的上传成功的临时路径 数组形式
        pics: [],
        // 商品的详情描述 富文本框的内容
        goods_introduce: '',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: []

      },
      // 添加商品的表单验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选中商品分类', trigger: 'blur' }
        ],
      },
      // 商品分类列表
      cateList: [],
      // 级联选择器的配置对象
      cateProps: {
        // 指定选中项的 id
        value: 'cat_id',
        // 指定看到的值
        label: 'cat_name',
        // 指定父子节点的嵌套
        children: 'children',
        // 指定级联选择框 是点击打开 还是悬浮打开 子选择框
        expandTrigger: 'hover'
      },
      // 动态参数的列表数据
      manyTableData: [],
      // 静态属性的列表数据
      onlyTableData: [],
      // 图片上传的请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 点击预览图片的路径
      previewPath: '',
      // 控制图片对话框显示和隐藏
      previewPathVisible: false,
      
    }
  },
  methods: {
    // 级联选择器 选中项变化 触发事件
    handleChange() {
      // 只允许选中三级的商品分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
      // console.log(this.addForm.goods_cat);
    },
    // 标签页切换前 监听是否选中了分类
    beforeTabLvave(activeName, oldActiveName) {
      // console.log('即将离开的标签页是:' + oldActiveName);
      // console.log('即将进入的标签页是:' + activeName);
      // return false
      // 如果标签页名字为 '0' 而且 商品分类选不是三级分类 不能切换
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // 在标签页选中某项时 触发
    tabClicked() {
      // console.log(this.activeIndex);
      // 如果选中项为 商品参数 就发起请求获取 动态参数
      if (this.activeIndex === '1') {
        getCurrentCateId(this.cateId, 'many').then(res => {
          if (res.meta.status !== 200) return this.$message.error('获取动态参数失败')
          // console.log(res.data);
          res.data.forEach( item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ")
          });
          this.manyTableData = res.data
          console.log(this.manyTableData);
        })
      } else if (this.activeIndex === '2') {
        getCurrentCateId(this.cateId, 'only').then(res => {
          if (res.meta.status !== 200) return this.$message.error('获取静态属性失败')
          // console.log(res.data);
          this.onlyTableData = res.data
          console.log(this.onlyTableData);
        })
      }
    },
    // 点击处理图片预览效果  file 将要预览的图片信息
    handlePreview(file) {
      console.log(file);
      // 点击图片 获取图片信息的路径
      this.previewPath = file.response.data.url
      this.previewPathVisible = true

    },
    // 处理移除图片的操作 file 将要被移除的图片信息
    handleRemove(file) {
      // console.log(file);
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中， 找到这个图片的对应索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法， 把图片信息对象 从 pics 数组删除
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm);
    },
    // 监听图片上传成功 后返回的数据 response 服务器返回的数据对象
    headerSuccess(response) {
      console.log(response);
      // 1. 拼接得到一个图片信息对象
      const picsInfo = {"pic": response.data.tmp_path}
      // 2. 将图片的信息对象 push 到 pics数组中
      this.addForm.pics.push(picsInfo)
      // console.log(this.addForm);
    },
    // 点击添加商品 按钮事件
    add() {
      // 对表单进行验证
      this.$refs.addFormRef.validate(callback => {
        if (!callback) {
          return this.$message.error('请填写必要的表单项!')
        } else {
          // 执行添加的业务逻辑
          // 因为 el-from-item 的商品类型 需要的数组 所有在进行类型转换前需要深拷贝 一份 addFrom 对象
          // lodash 工具库的  cloneDeep(obj) obj 是需要拷贝对象3
          const form = _.cloneDeep(this.addForm)

          // 处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            this.addForm.attrs.push(newInfo)
          })

          // addForm 只供给页面上渲染
          // 直接操作form 就行


          form.goods_cat = form.goods_cat.join(',')

          // console.log(Object.prototype.toString.call(this.addForm.goods_cat));  查看变量类型
          console.log(form);

          // 发起请求添加商品
          addGoods(form).then(res => {
            // console.log(res);
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.$router.push('/goods')
          }) 
        }
      })
    }
  },
  created() {
    getCateList().then(res => {
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error('获取商品数据失败')
      return this.cateList = res.data
    })
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>