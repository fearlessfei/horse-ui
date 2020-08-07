<template>
  <div>
    <el-button
      type="warning"
      icon="el-icon-download"
      @click="exportFile"
    >
      {{ btnText }}
    </el-button>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'FileDownload',
  components: {},
  props: {
    fileName: {
      type: String,
      default: 'result'
    },
    btnText: {
      type: String,
      default: '确定要下载吗？'
    },
    confirmText: {
      type: String,
      default: '确定要下载吗？'
    },
    url: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'get'
    },
    contentType: {
      type: String,
      default: 'application/json'
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  methods: {
    exportFile: function() {
      const _this = this
      _this.$confirm(_this.confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        _this.loading = true
        request({
          url: _this.url,
          method: _this.method,
          responseType: 'blob', // 表明返回服务器返回的数据类型
          headers: {
            'Content-Type': _this.contentType
          },
          params: _this.params
        }).then(function(response) {
          _this.loading = false
          _this.downloadFile(response)
        }).catch(function(error) {
          _this.loading = false
          console.log(error)
        })
      }).catch(function() {
        _this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    downloadFile: function(response) {
      const blob = new Blob([response])
      const fileName = this.fileName
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    }
  }
}
</script>
