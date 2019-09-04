<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-show="showSearchInput"
        v-model="listQuery.name"
        placeholder="角色名"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <perm-button
        v-waves
        :show-search-input.sync="showSearchInput"
        perm-code="sys:role:select"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </perm-button>
      <perm-button
        perm-code="sys:role:create"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        创建角色
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
      <el-table-column
        label="角色 ID"
        prop="id"
        sortable
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        prop="name"
        align="center"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.name }}</span>
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
        label="创建时间"
        prop="create_time"
        align="center"
        width="155"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <span>
            <el-input
              v-model="scope.row.desc"
              type="textarea"
              :disabled="true"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
        width="278"
      >
        <template slot-scope="{row}">
          <perm-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            perm-code="sys:role:edit"
            @click="handleUpdate(row)"
          >
            编辑
          </perm-button>
          <perm-button
            icon="el-icon-unlock"
            type="warning"
            size="mini"
            perm-code="sys:role:perm"
            @click="getRoleMenulist(row)"
          >
            权限
          </perm-button>
          <perm-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            perm-code="sys:role:delete"
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
          label="角色"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          label="描述"
          prop="desc"
        >
          <el-input
            v-model="temp.desc"
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="order"
        >
          <el-input v-model="temp.order" />
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

    <el-dialog
      :title="roleName + '权限'"
      :visible.sync="dialogPermFormVisible"
      :close-on-click-modal="false"
    >
      <div style="margin-left: 40%">
        <div style="padding-bottom:  20px">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :props="defaultProps"
            :data="menu"
            show-checkbox
            node-key="id"
          />
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogPermFormVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="updateRoleMenu"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, createRole, updateRole, deleteRole, getRoleMenulist, updateRoleMenu } from '@/api/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PermButton from '@/components/PermButton' // permission control button
import { parseTime } from '@/utils'

export default {
  name: 'SYSRole',
  components: { Pagination, PermButton },
  directives: { waves },
  filters: {
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
        name: ''
      },
      temp: {
        id: 0,
        name: '',
        desc: '',
        order: 10000
      },
      defaultProps: {
        label: 'title'
      },
      dialogFormVisible: false,
      dialogPermFormVisible: false,
      dialogStatus: '',
      roleName: '',
      roleId: 0,
      role_menu: [],
      menu: [],
      checkStrictly: true,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
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
      getRoleList(this.listQuery).then(response => {
        const data = response.data
        this.list = data.results
        this.total = data.count

        this.listLoading = false
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: '',
        desc: '',
        order: 10000
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          createRole(data).then(response => {
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
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRole(tempData).then(response => {
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
      this.$confirm('确定要删除这个角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ id: row.id }).then(response => {
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
    },
    getRoleMenulist(row) {
      this.roleName = row.name
      this.roleId = row.id
      this.listLoading = true
      this.checkStrictly = true
      getRoleMenulist(this.roleId).then(response => {
        this.listLoading = false
        this.dialogPermFormVisible = true

        const data = response.data
        this.menu = data.menu
        this.role_menu = data.role_menu
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.role_menu)
          this.checkStrictly = false
        })
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    },
    updateRoleMenu(row) {
      this.listLoading = true
      this.checkStrictly = true
      const role_menu = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      updateRoleMenu(this.roleId, { role_menu: role_menu }).then(response => {
        this.listLoading = false
        const { code } = response
        if (code === 20000) {
          this.dialogPermFormVisible = false
          this.$refs.tree.setCheckedKeys(this.role_menu)
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
      }).catch(error => {
        console.log(error)
        this.listLoading = false
      })
    }
  }
}
</script>
