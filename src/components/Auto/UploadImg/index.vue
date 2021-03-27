<template>
  <div>
    <el-upload
      class="upload-demo"
      action="void"
      multiple
      :http-request="getpolicy"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      list-type="picture-card"
      :on-success="handleSuccess"
      :disabled="disabled"
    >
      <i slot="default" class="el-icon-plus"></i>
    </el-upload>
    <div v-show="dialogVisible" class="models" @click="dialogVisible=false">
      <img width="100%" :src="dialogImageUrl" alt="error" @click.stop="dialogVisible=true" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';
export default {
  name: 'UploadImg',
  props: {
    fileRes: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  computed: {
    fileList: {
      get() {
        const files = this.fileRes.filter((item) => {
          if (item.url) {
            item.name = item.url.split('/').pop();
            return item.url;
          }
        });
        return files;
      },
      set(n) {
        return n;
      },
    },

  },
  methods: {
    /**
     * 获取上传通行证 调用后端接口，获取oss相关信息
     */
    getpolicy(file) {
      request({ url: '/oss', method: 'get' }).then((res) => {
        this.ossUpload(file, res);
      });
    },
    ossUpload(file, ossToken) {
      // 随机命名
      // const fileName = file.file.name; // 当前本地上传的这张图片的名称(没有时间日期)
      // 上传文件后戳
      const hc = file.file.name.substring(file.file.name.lastIndexOf('.') + 1, file.file.name.length);
      const fileName = Math.random().toString(36).substr(2) + '.' + hc; // 随机名称
      const date = new Date();
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let days = date.getDate();
      month = month < 10 ? '0' + month : month;
      days = days < 10 ? '0' + days : days;
      // filePath 这里是把时间+图片名称拼接起来形成一个新的图片上传至oss，目的是区别于本地图片的名称，避免名称相同会误删，同时便于查看oss上最新上传图片的时间点
      const filePath = year + '-' + month + '-' + days + '/' + fileName;
      const formData = new FormData();
      formData.append('key', ossToken.dir + filePath); // 存储在oss的文件路径
      formData.append('policy', ossToken.policy); // policy
      formData.append('OSSAccessKeyId', ossToken.accessid); // accessKeyId
      formData.append('Signature', ossToken.signature); // 签名
      formData.append('success_action_status', 200); // 成功后返回的操作码
      formData.append('callback', ossToken.callback); // 回调
      formData.append('file', file.file);
      request({
        url: ossToken.host,
        method: 'post',
        data: formData,
      }).then((res) => {
        file.onSuccess(res);
      });
    },
    /**
     * 上传文件限制
     * jpg/jpeg/png
     */
    filesName(file) { // 验证上传文件格式
    // 上传文件后戳
      const hc = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      const isJPG = hc === 'jpg';
      const isJPEG = hc === 'jpeg';
      const isPNG = hc === 'png';
      if (isJPG || isJPEG || isPNG) {
        return true;
      }
    },
    beforeAvatarUpload(file) {
      if (!this.filesName(file)) {
        this.$message.error('只能上传 jpg/jpeg/png 格式的图片!');
        return false;
      }
    },
    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      this.$emit('files', fileList);
    },
    // 移除上传
    handleRemove(file, fileList) {
      this.$emit('files', fileList);
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>
<style scoped lang="scss">
.upload-demo{
  ::v-deep.el-upload-list__item{
    width: 80px ;
    height: 80px ;
    line-height: 80px ;
  }
  ::v-deep.el-upload--picture-card{
     width: 80px ;
    height: 80px ;
    line-height: 80px ;
  }
}

.models{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background: rgba(0,0,0,.7);
    height: 100%;
    display: flex;

}
.models img{
  display: block;
  width: max-content;
  height: max-content;
  margin: auto;
}
</style>
<style  lang="scss">
.el-upload-list--picture-card {
  .el-upload-list__item-status-label {
    .el-icon-check{
      position: absolute;
      left: 13px;
    }
  }
}
</style>
