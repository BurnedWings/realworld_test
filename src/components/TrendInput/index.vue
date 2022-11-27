<template>
  <div class="comment-input">
    <el-input
      type="textarea"
      resize="none"
      maxlength="120"
      show-word-limit
      :rows="4"
      placeholder="有什么想和大家分享的？"
      v-model="textarea"
    ></el-input>
    <el-popover popper-class="comment-popover" placement="bottom-start" width="400" trigger="click">
      <i slot="reference" class="face-icon iconfont icon-a-jingyaguilian-02"></i>
      <div class="my-emojis-box">
        <ul>
          <li v-for="(item, index) in faceList" :key="index" @click="getBrow(index)">{{ item }}</li>
        </ul>
      </div>
    </el-popover>
    <el-popover
      class="img-container"
      placement="bottom"
      trigger="manual"
      width="520"
      v-model="visible"
    >
      <i style="float:right;cursor: pointer;" @click="closeImgBox" class="el-icon-close"></i>
      <el-upload
        action
        ref="upload"
        :limit="9"
        list-type="picture-card"
        :on-remove="handleRemove"
        :http-request="uploadFile"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <i slot="reference" @click="visible = !visible" class="img-icon iconfont icon-tupian"></i>
    </el-popover>
    <el-button class="submit-button" @click="commitTrend" slot="reference">发表动态</el-button>
  </div>
</template>

<script>
import appData from "@/assets/emojis/emojis.json";
export default {
  name: "TrendInput",
  data() {
    return {
      textarea: null,
      faceList: [],
      visible: false,
      imgList: null
    };
  },
  props: ["articleId"],
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    loadEmojis() {
      for (let i in appData) {
        this.faceList.push(appData[i].char);
      }
    },
    //提交动态
    async commitTrend() {
      if (this.$store.state.user.userInfo.status === 1) {
        this.textarea = null
        this.imgList = null
        this.visible = false
        this.$refs.upload.clearFiles();
        return this.$message({
          message: "你已被禁言十天，到期后自动解除",
          type: "error"
        });
      }
      if (this.textarea != null) {
        const trend = {};
        trend.body = this.textarea;
        const res = await this.$API.trend.createTrend(trend);
        if (res.code === 200) {
          this.$store.dispatch("getUserInfo");
          if (this.imgList != null) {
            const trendId = res.trendId;
            const ret = await this.$API.trend.handleTrendImg(
              this.imgList,
              trendId
            );
          }
          this.textarea = "";
          this.visible = false;
          this.imgList = null;
          this.$refs.upload.clearFiles();
          this.$message({
            type: "success",
            message: "发布动态成功"
          });
        }
      } else {
        this.$message({
          type: "info",
          message: "你还没有写动态内容哦~"
        });
      }
    },
    //输入表情
    getBrow(index) {
      for (let i in this.faceList) {
        if (index == i) {
          this.getBrowString = this.faceList[index];
          this.textarea += this.getBrowString;
        }
      }
    },
    handleRemove(file, fileList) {
      var formData = new FormData();
      for (const i in fileList) {
        formData.append("file", fileList[i].raw);
        if (fileList.length === parseInt(i) + 1) {
          this.imgList = formData;
        }
      }
    },
    async uploadFile(params) {
      const _file = params.file;
      // 通过 FormData 对象上传文件
      if (this.imgList === null) {
        var formData = new FormData();
        formData.append("file", _file);
        this.imgList = formData;
      } else {
        this.imgList.append("file", _file);
      }
    },
    closeImgBox() {
      this.visible = false;
      this.imgList = null;
      this.$refs.upload.clearFiles();
    }
  },
  created() {
    this.loadEmojis();
  },
  destroyed() {}
};
</script>
<style lang="less" scoped>
.comment-input {
  margin-bottom: 10px;

  :deep(.el-textarea) {
    outline-style: none;
  }
  & :deep(i) {
    font-size: 22px;
    margin-left: 10px;
    margin-right: 10px;
    color: rgb(81, 77, 77);
    font-weight: 600;
    position: relative;
    top: 7px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: var(--theme_search_input_blue_color);
    }
  }
  .user-img {
    float: left;
    margin-top: 12px;
    margin-right: 8px;
    img {
      width: 48px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
  & :deep(.el-upload-list__item .el-upload-list--picture-card) {
    width: 112px !important;
    height: 112px !important;
  }
}
.comment-input:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
</style>