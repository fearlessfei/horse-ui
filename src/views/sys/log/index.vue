<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-show="showSearchInput"
        v-model="searchForm.creator"
        placeholder="用户名"
        prefix-icon="el-icon-search"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="searchForm.create_time"
        class="filter-item"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        align="right"
        value-format="timestamp"
      />
      <perm-button
        v-waves
        :show-search-input.sync="showSearchInput"
        perm-code="sys:log:select"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
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
        label="访问者"
        prop="creator"
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="访问IP"
        width="130"
        prop="ip"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="访问时间"
        prop="create_time"
        width="155"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="请求接口"
        prop="path"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="请求方法"
        prop="method"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="请求参数"
        prop="body"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <span>
            <el-input
              v-model="scope.row.body"
              type="textarea"
              :disabled="true"
            />
          </span>
        </template>

      </el-table-column>
      <el-table-column
        label="状态码"
        prop="code"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消息"
        prop="message"
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
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
  </div>
</template>

<script>
import { getLogList } from '@/api/log'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PermButton from '@/components/PermButton' // permission control button

export default {
  name: 'PokerLoginHistory',
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
      searchForm: {
        creator: '',
        create_time: null
      },
      listQuery: {
        page: 1,
        limit: 20,
        creator: null,
        start_time: null,
        end_time: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      this.listQuery.start_time = null
      this.listQuery.end_time = null
      if (this.searchForm.create_time !== null) {
        this.listQuery.start_time = this.searchForm.create_time[0]
        this.listQuery.end_time = this.searchForm.create_time[1]
      }
      this.listQuery.creator = this.searchForm.creator
      getLogList(this.listQuery).then(response => {
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
      this.listQuery.page = this.listQuery.page
      this.getList()
    }
  }
}
</script>
