<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-show="showSearchInput"
        v-model="listQuery.username"
        placeholder="用户名"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <perm-button
        v-waves
        :show-search-input.sync="showSearchInput"
        perm-code="sys:user:select"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </perm-button>
      <perm-button
        perm-code="sys:user:create"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        创建用户
      </perm-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            class="demo-table-expand"
          >
            <el-form-item label="注册时间：">
              <span>{{ props.row.reg_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="最后登录时间">
              <span>{{ props.row.last_login | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </el-form-item>
            <el-form-item label="邮箱：">
              {{ props.row.email }}
            </el-form-item>
            <el-form-item label="手机号：">
              {{ props.row.phone }}
            </el-form-item>
            <el-form-item label="登录IP：">
              {{ props.row.login_ip }}
            </el-form-item>
            <el-form-item label="排序：">
              {{ props.row.order }}
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="用户 ID"
        prop="id"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户"
        prop="username"
        align="center"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="超级管理员"
        prop="is_superuser"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.is_superuser | typeFilter">
            {{ row.is_superuser | isSuperuserFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建者"
        prop="id"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效"
        prop="status"
        align="center"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | typeFilter">
            {{ scope.row.status | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        width="188"
      >
        <template slot-scope="{row}">
          <perm-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            perm-code="sys:user:edit"
            @click="handleUpdate(row)"
          >
            编辑
          </perm-button>
          <perm-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            perm-code="sys:user:delete"
            @click="handleDelete(row)"
          >
            删除
          </perm-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="82px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item
          label="用户"
          prop="username"
        >
          <el-input
            v-model="temp.username"
            :disabled="usernameDisabled"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="temp.password"
            :placeholder="passwordPlaceholder"
            show-password
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item
          label="手机"
          prop="phone"
        >
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="order"
        >
          <el-input v-model="temp.order" />
        </el-form-item>
        <el-form-item
          label="超级用户"
          prop="is_superuser"
        >
          <el-switch
            v-model="temp.is_superuser"
            active-color="#13ce66"
            inactive-color="#999"
          />
        </el-form-item>
        <el-form-item label="是否有效">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#999"
          />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="roles"
        >
          <el-select
            v-model="temp.user_role"
            multiple
            filterable
            class="filter-item"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="头像"
          prop="avatar"
        >
          <avatar-upload />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'
import { getRoleList } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PermButton from '@/components/PermButton' // permission control button
import AvatarUpload from '@/components/AvatarUpload' // avatar upload

const isSuperuserOptions = [
  { key: false, display_name: '否' },
  { key: true, display_name: '是' }
]

const statusOptions = [
  { key: false, display_name: '无效' },
  { key: true, display_name: '有效' }
]

const isSuperuserOptionsMap = isSuperuserOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusOptionsMap = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'SYSUser',
  components: { Pagination, AvatarUpload, PermButton },
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = {
        true: 'success',
        false: 'danger'
      }
      return typeMap[type]
    },
    statusFilter(status) {
      return statusOptionsMap[status]
    },
    isSuperuserFilter(status) {
      return isSuperuserOptionsMap[status]
    },
    parseTime(timestamp) {
      return parseTime(timestamp)
    }
  },
  data() {
    return {
      showSearchInput: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        username: ''
      },
      rolesList: [],
      isSuperuserOptions,
      temp: {
        id: 0,
        username: '',
        password: '',
        email: '',
        phone: '',
        avatar: '',
        order: 10000,
        status: true,
        is_superuser: false,
        user_role: []

      },
      dialogFormVisible: false,
      dialogStatus: '',
      passwordPlaceholder: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [{ required: true, message: '用户不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机不能为空', trigger: 'blur' }],
        order: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
        const data = response.data
        this.list = data.results
        this.total = data.count

        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    getRoleList(user_id) {
      const queryCond = {}
      getRoleList(queryCond).then(response => {
        this.rolesList = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        username: '',
        password: '',
        email: '',
        phone: '',
        avatar: '',
        order: 10000,
        status: true,
        is_superuser: false,
        user_role: []
      }
    },
    handleCreate() {
      this.resetTemp()
      this.passwordPlaceholder = ''
      this.$set(this.rules, 'password', [{ required: true, message: '密码不能为空', trigger: 'blur' }])
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.getRoleList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          createUser(data).then(response => {
            const { code } = response
            if (code === 20000) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败',
                type: 'error',
                duration: 2000
              })
            }
          }).catch(error => {
            console.log(error)
            this.listLoading = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.passwordPlaceholder = '不填写表示不更改原始密码'
      this.$delete(this.rules, 'password')
      this.temp = Object.assign({}, row)
      this.temp.password = ''
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.getRoleList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(response => {
            const { code } = response
            if (code === 20000) {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
            this.getList()
          }).catch(error => {
            console.log(error)
            this.listLoading = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除这个用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({ id: row.id }).then(response => {
          const { code } = response
          if (code === 20000) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          console.log(error)
          this.listLoading = false
        })
      })
    }
  }
}
</script>
