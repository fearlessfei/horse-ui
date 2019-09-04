<template>
  <div class="components-container">

    <pan-thumb :image="image" />

    <el-button
      type="primary"
      icon="upload"
      style="position: absolute;bottom: -50px; absolute;left: 30px"
      @click="imagecropperShow=true"
    >
      更改头像
    </el-button>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="width"
      :height="height"
      :url="url"
      :lang-type="langType"
      :with-credentials="true"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  name: 'AvatarUploadDemo',
  components: { ImageCropper, PanThumb },
  props: {
    imagecropperKey: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    },
    url: {
      type: String,
      default: 'https://httpbin.org/post'
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
    langType: {
      type: String,
      default: 'zh'
    }
  },
  data() {
    return {
      imagecropperShow: false
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>

