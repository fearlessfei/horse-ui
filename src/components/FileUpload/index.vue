<template>
  <div>
    <el-upload
      ref="upload"
      class="el-upload"
      :drag="drag"
      :multiple="multiple"
      :action="action"
      :accept="accept"
      :limit="limit"
      :file-list="fileList"
      :http-request="uploadFile"
      :on-error="onError"
      :on-success="onSuccess"
      :on-exceed="onExceed"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">{{ uploadText }}</div>
      <div
        slot="tip"
        class="el-upload__tip"
      >{{ uploadTip }}</div>
    </el-upload>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'FileUpload',
  components: {},
  props: {
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: 'application/octet-stream'
    },
    contentType: {
      type: String,
      default: 'multipart/form-data'
    },
    action: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'post'
    },
    uploadText: {
      type: String,
      default: '将文件拖到此处，或点击上传'
    },
    uploadTip: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    uploadFile(obj) {
      const _this = this
      var formData = new FormData()
      formData.append('file', obj.file)
      request({
        url: this.action,
        method: this.method,
        headers: {
          'Content-Type': this.contentType
        },
        data: formData
      }).then(function(response) {
        _this.onSuccess(response, obj.file, _this.fileList)
      }).catch(function(error) {
        console.log(error)
      })
    },
    abort: function() {
      this.$refs.upload.abort()
    },
    clear: function() {
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    onExceed: function(files, fileList) {
      const _this = this
      console.log(files, fileList)
      this.$message({
        type: 'error',
        message: '允许上传最大个数为' + _this.limit + '个文件' + ',您选择了' + files.length + '个文件'
      })
    },
    onError: function(err, file, fileList) {
      console.log(err, file, fileList)
    },
    onSuccess: function(response, file, fileList) {
      this.$emit('onSuccess', { response: response, file: file, fileList: fileList })
    }
  }
}
</script>
