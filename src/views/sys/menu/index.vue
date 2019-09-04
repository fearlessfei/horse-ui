<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-show="showSearchInput"
        v-model="listQuery.title"
        placeholder="标题"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <perm-button
        v-waves
        :show-search-input.sync="showSearchInput"
        perm-code="sys:menu:select"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </perm-button>
      <perm-button
        perm-code="sys:menu:create"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        创建菜单
      </perm-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
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
            <el-form-item label="重定向：">
              {{ props.row.redirect }}
            </el-form-item>
            <el-form-item label="显示根路由：">
              <el-tag :type="props.row.always_show | statusTagFilter">
                {{ props.row.always_show | statusFilter }}
              </el-tag>
            </el-form-item>
            <el-form-item label="隐藏：">
              <el-tag :type="props.row.hidden | statusTagFilter">
                {{ props.row.hidden | statusFilter }}
              </el-tag>
            </el-form-item>
            <el-form-item label="不缓存：">
              <el-tag :type="props.row.no_cache | statusTagFilter">
                {{ props.row.no_cache | statusFilter }}
              </el-tag>
            </el-form-item>
            <el-form-item label="面包屑显示：">
              <el-tag :type="props.row.breadcrumb | statusTagFilter">
                {{ props.row.breadcrumb | statusFilter }}
              </el-tag>
            </el-form-item>
            <el-form-item label="创建时间：">
              {{ props.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="菜单 ID"
        prop="id"
        sortable
        align="left"
        width="130"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title"
        align="center"
      >
        <template slot-scope="{row}">
          <span
            class="link-type"
            @click="handleUpdate(row)"
          >{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="名称"
        prop="name"
        align="center"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="权限代码"
        prop="perm_code"
        align="center"
        width="150"
      >
        <template slot-scope="{row}">
          <span>{{ row.perm_code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="路径"
        prop="path"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="组件"
        prop="component"
        width="151"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="图标"
        prop="icon"
        align="center"
      >
        <template slot-scope="scope">
          <span>
            <svg-icon :icon-class="scope.row.icon" />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.type | typeTagFilter">
            {{ row.type | typeFilter }}
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
            perm-code="sys:menu:edit"
            @click="handleUpdate(row)"
          >
            编辑
          </perm-button>
          <perm-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            perm-code="sys:menu:delete"
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
          :label="typeOptionsMap[temp.type]+'标题'"
          prop="title"
        >
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="路径"
          prop="path"
        >
          <el-input v-model="temp.path" />
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="组件"
          prop="component"
        >
          <el-input v-model="temp.component" />
        </el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
        >
          <el-input v-model="temp.icon" />
        </el-form-item>
        <el-form-item
          label="排序"
          prop="order"
        >
          <el-input v-model="temp.order" />
        </el-form-item>
        <el-form-item
          v-if="temp.type === 2"
          label="权限代码"
          prop="perm_code"
          :rules="[
            { required: true, message: '权限代码不能为空', trigger: 'blur' }
          ]"
        >
          <el-input v-model="temp.perm_code" />
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="重定向"
          prop="redirect"
        >
          <el-input v-model="temp.redirect" />
        </el-form-item>
        <el-form-item
          label="类型"
          prop="type"
        >
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="显示根路由"
        >
          <el-switch
            v-model="temp.always_show"
            active-color="#13ce66"
            inactive-color="#999"
          />
          <el-tooltip
            content="你可以设置 alwaysShow为开启状态，这样它就会忽略之前定义的规则，一直显示根路由"
            placement="right"
            effect="light"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="隐藏"
        >
          <el-switch
            v-model="temp.hidden"
            active-color="#13ce66"
            inactive-color="#999"
          />
          <el-tooltip
            content="当设置开启状态的时候该路由不会再侧边栏出现"
            placement="right"
            effect="light"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="不缓存"
        >
          <el-switch
            v-model="temp.no_cache"
            active-color="#13ce66"
            inactive-color="#999"
          />
          <el-tooltip
            content="如果设置为开启状态，则不会被 <keep-alive> 缓存(默认关闭状态)"
            placement="right"
            effect="light"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item
          v-if="temp.type !== 2"
          label="面包屑显示"
        >
          <el-switch
            v-model="temp.breadcrumb"
            active-color="#13ce66"
            inactive-color="#999"
          />
          <el-tooltip
            content="如果设置为关闭状态，则不会在breadcrumb面包屑中显示"
            placement="right"
            effect="light"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </el-form-item>
        <el-form-item
          label="父菜单"
          prop="parent_id"
        >
          <el-tree
            ref="tree"
            :props="defaultProps"
            :data="list"
            show-checkbox
            :check-strictly="true"
            node-key="id"
            @check-change="orgCheckChange"
          />
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
import { getMenuList, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PermButton from '@/components/PermButton' // permission control button
import { refreshRouter } from '@/router'
import { parseTime } from '@/utils'

const typeOptions = [
  { key: 0, display_name: '目录' },
  { key: 1, display_name: '菜单' },
  { key: 2, display_name: '按钮' }
]

const statusOptions = [
  { key: false, display_name: '否' },
  { key: true, display_name: '是' }
]

const typeOptionsMap = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const statusOptionsMap = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'SYSMenu',
  components: { Pagination, PermButton },
  directives: { waves },
  filters: {
    typeTagFilter(type) {
      const typeTagMap = {
        0: '',
        1: 'success',
        2: 'warning'
      }
      return typeTagMap[type]
    },
    statusTagFilter(type) {
      const typeTagMap = {
        false: 'danger',
        true: 'success'
      }
      return typeTagMap[type]
    },
    typeFilter(type) {
      return typeOptionsMap[type]
    },
    statusFilter(status) {
      return statusOptionsMap[status]
    },
    parseTime(timestamp) {
      return parseTime(timestamp)
    }
  },
  data() {
    return {
      showSearchInput: true,
      treeNodeNum: 0,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        title: ''
      },
      temp: {
        id: 0,
        parent_id: 0,
        name: '',
        title: '',
        perm_code: '',
        component: '',
        path: '',
        redirect: '',
        icon: '',
        url: '',
        type: 1,
        always_show: false,
        hidden: false,
        no_cache: false,
        breadcrumb: true,
        order: 10000
      },
      defaultProps: {
        label: 'title'
      },
      selectOrg: {
        orgsid: []
      },
      typeOptions,
      typeOptionsMap,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '组件不能为空', trigger: 'blur' }],
        icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
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
      getMenuList(this.listQuery).then(response => {
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
        parent_id: 0,
        name: '',
        title: '',
        perm_code: '',
        component: '',
        path: '',
        redirect: '',
        icon: '',
        url: '',
        type: 1,
        always_show: false,
        hidden: false,
        no_cache: false,
        breadcrumb: true,
        order: 10000
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.showPermCode = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.tree.setCheckedKeys([])
      })
    },
    getTreeSelectedKey() {
      const selectedKeys = this.$refs.tree.getCheckedKeys()
      const currentKey = selectedKeys.length > 0 ? selectedKeys[0] : 0
      return currentKey
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = Object.assign({}, this.temp)
          data['parent_id'] = this.getTreeSelectedKey()
          createMenu(data).then(response => {
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
              refreshRouter()
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
        // 先置空在赋值
        this.$refs.tree.setCheckedKeys([])
        this.$refs.tree.setCheckedKeys([row.parent_id])
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData['parent_id'] = this.getTreeSelectedKey()
          updateMenu(tempData).then(response => {
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
            refreshRouter()
          }).catch(error => {
            console.log(error)
            this.listLoading = false
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('这将会删除该菜单下的所有菜单，确定要删除这个菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          const { code } = response
          if (code === 20000) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            refreshRouter()
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
    // check-change
    // 节点选中状态发生变化时的回调
    // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    orgCheckChange(data, checked, indeterminate) {
      this.treeNodeNum++
      if (this.treeNodeNum % 2 === 0) {
        if (checked) {
          // 交叉点击节点
          this.$refs.tree.setCheckedKeys([])
          this.$refs.tree.setCheckedKeys([data.id])
        } else {
          // 点击已经选中的节点，置空
          this.$refs.tree.setCheckedKeys([])
        }
      }
    }
  }
}
</script>
