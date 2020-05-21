<template>
  <el-upload
    ref="upload"
    v-bind="$attrs"
    v-loading="loading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="lw-img-uploader"
    :class="{round:round}"
    :before-upload="beforeUpload"
    :on-change="onChange"
    :on-success="onSuccess"
    :on-error="onError"
    :accept="accept"
    :action="actionUrl"
    :show-file-list="false"
    :style="{height: size, width: size}"
  >
    <img v-if="imageUrl" :src="imageUrl" class="lw-img" :style="{height: size, width: size}" />
    <i
      v-else
      class="el-icon-plus lw-img-uploader-icon"
      :style="{height: size, width: size, lineHeight: size}"
    ></i>
    <label class="lw-img__status is-success" v-show="status === 'success'">
      <i class="el-icon-upload-success el-icon-check"></i>
    </label>
  </el-upload>
</template>

<script>
import axios from "axios";
import config from "@/config";
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    defaultUrl: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: '128px'
    },
    round: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.png, .jpg, .jpeg, .gif, .bmp, .ai, .raw, .wmf, .webp'
    },
    uploadUrl: {
      type: String,
      default: '/api/file/upload'
    }
  },
  data() {
    return {
      imageUrl: '',
      actionUrl: config.apiUrl + this.uploadUrl,
      loading: false,
      status: 'pending'
    };
  },
  methods: {
    beforeUpload() {
      this.loading = true;
    },
    onPending() {
      this.status = 'pending';
    },
    onChange(file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    onSuccess(res, file) {
      if (res.respCode !== 0) {
        this.onError();
        this.$message.error('图片上传失败');
        return false;
      }
      const data = res.content;
      this.loading = false;
      this.status = 'success';
      this.imageUrl = data.fileUrl;
      this.$emit('input', data.id);
      this.$emit('success', {
        fileId: data.id,
        fileUrl: data.fileUrl,
        fileType: data.fileType
      });
    },
    onError() {
      this.loading = false;
      this.status = 'error';
    },
  },
  watch: {
    defaultUrl: {
      handler() {
        this.imageUrl = this.defaultUrl;
        this.onPending();
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.lw-img-uploader {
  position: relative;
  display: inline-block;
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409eff;
  }
}
.lw-img-uploader.round {
  .el-upload {
    border-radius: 50%;
  }
}

.lw-img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}

.lw-img {
  display: block;
}

.lw-img__tip {
  font-size: 12px;
  color: #999;
}

.lw-img__status {
  position: absolute;
  right: -17px;
  top: -7px;
  width: 46px;
  height: 26px;
  text-align: center;
  transform: rotate(45deg);
  box-shadow: 0 1px 1px #ccc;
  &.is-success {
    background: #13ce66;
  }
  i {
    font-size: 12px;
    margin-top: 12px;
    transform: rotate(-45deg);
    color: #fff;
  }
}
</style>
