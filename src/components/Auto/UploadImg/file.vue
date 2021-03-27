<template>
  <div class="test">
    <div>
      <el-upload
        ref="upload"
        class="upload-demo"
        action="void"
        multiple
        :before-upload="beforeAvatarUpload"
        :http-request="getpolicy"
        :on-remove="handleRemove"
        :file-list="fileList"
        :on-preview="previewDown"
        :on-success="handleSuccess"
      >
        <!-- <i class="el-icon-upload"></i> -->
        <el-button type="primary">点击上传</el-button>
        <div style="color:#c0c4cc">只能上传7z/zip/rar xls/xlsx csv pdf doc/docx格式文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'UploadFile',
  props: {
    fileRes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileUrl: '',
      files: [],
    };
  },
  computed: {
    fileList: {
      get() {
        const files = this.fileRes.filter((item) => {
          return item;
        });
        return files;
      },
      set(newval) {
        return newval;
      },
    },
  },
  methods: {
    /**
     * 获取上传通行证 调用后端接口，获取oss相关信息
     */
    getpolicy(file) {
      if (this.$refs.upload) {
        request({ url: '/oss', method: 'get' }).then((res) => {
          this.ossUpload(file, res);
        });
      }
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
      // 注意formData里append添加的键的大小写
      formData.append('key', ossToken.dir + filePath); // 存储在oss的文件路径
      formData.append('OSSAccessKeyId', ossToken.accessid); // accessKeyId
      formData.append('policy', ossToken.policy); // policy
      formData.append('Signature', ossToken.signature); // 签名
      formData.append('callback', ossToken.callback); // 回调
      formData.append('success_action_status', 200); // 成功后返回的操作码
      formData.append('file', file.file);
      request({
        url: ossToken.host,
        method: 'post',
        onUploadProgress: (progressEvent) => {
          const num = ((progressEvent.loaded / progressEvent.total) * 100) | 0; // 百分比
          file.onProgress({ percent: num }); // 进度条
        },
        data: formData,
      }).then((res) => {
        file.onSuccess(res);
        // this.files = this.files.map((item) => {
        //   if (item.name === res.file_path.split('/').pop()) {
        //     item.url = res.file_path;
        //   }
        //   return item;
        // });
        // this.$emit('files', this.files);
      });
    },
    /**
     * 上传文件限制
     * 压缩包rar  zip
     * 文档 xls/xlsx csv pdf doc/docx
     */
    filesName(file) { // 验证上传文件格式
      const hc = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
      const is7Z = hc === '7z';
      const isZIP = hc === 'zip';
      const isRAR = hc === 'rar';
      const isXLS = hc === 'xls';
      const isXLSX = hc === 'xlsx';
      const isCSV = hc === 'csv';
      const isPDF = hc === 'pdf';
      const isDOC = hc === 'doc';
      const isDOCX = hc === 'docx';
      if (isRAR || isZIP || isXLS || isXLSX || isCSV || isPDF || isDOC || isDOCX || is7Z) {
        return true;
      }
    },
    beforeAvatarUpload(file) {
      if (!this.filesName(file)) {
        this.$message.error(
          '只能上传 7z/zip/rar xls/xlsx csv pdf doc/docx 格式!'
        );
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
    // 上传成功回调
    // handleProgress(event, file, fileList) {
    //   this.files = fileList;
    // },
    // 移除上传
    // handleRemove(file, fileList) {
    //   if (this.filesName(file)) { // 判断当上传格式错误时，不走移除回调
    //     const files = this.fileList.filter((item) => {
    //       return item.uid !== file.uid;
    //     });
    //     this.$emit('files', files);
    //     this.$message({ message: '成功移除' + file.name, type: 'success' });
    //   }
    // },
    // 下载
    previewDown(file) {
      if (file) {
        window.location.href = file.url;
      }
    },
  },
};
</script>
<style scoped>
.upload-demo /deep/.el-upload{
  text-align: left;
}
.upload__text{
  color: #ccc;
}
</style>
