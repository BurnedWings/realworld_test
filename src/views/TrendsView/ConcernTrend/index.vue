<template>
  <div>
    <div ref="dialogContainer" class="my-dialog-container"></div>
    <div v-for="(trend, index) in concernTrendList" :key="trend._id" class="trend-item">
      <div class="item-line"></div>
      <div class="trend-item-top">
        <img @click="toDetailUserView(trend.user._id)" :src="$myBaseUrl + trend.user.image" alt />
        <div @click="toDetailUserView(trend.user._id)" class="username">{{ trend.user.username }}</div>
        <div class="updateDate">{{ $dayjs(trend.createdAt).format("YYYY/MM/DD") }}&nbsp;更新</div>
        <i @click="toEditComment(index)" class="my-edit-icon el-icon-more"></i>
        <div @mouseleave="closeBox(index)" ref="editBox" class="to-edit-comment">
          <span @click="toReportTheTrend(trend._id, trend.user._id)">举报</span>
        </div>
      </div>
      <div @click="toDetailTrend(trend._id)" class="trend-body">
        <span v-html="trend.body"></span>
      </div>
      <div class="img-container">
        <div v-for="(img, index) in trend.image"
          style="margin-right:5px;width:200px;height:200px;overflow:hidden;display:inline-block;">
          <el-image :key="index" style="width:100%;height:100%;" :src="img" fit="cover"
            :preview-src-list="trend.image"></el-image>
        </div>
      </div>
      <div class="trend-message">
        <div class="trend-message-item">
          <i class="iconfont icon-dianji"></i>
          {{ trend.clicksCount }}热度
        </div>
        <div @click="showComment(index, trend._id)" class="trend-message-item">
          <i class="iconfont icon-taolun"></i>
          {{ trend.commentsCount }}讨论
        </div>
        <div @click="trendKudos(trend._id, trend.user._id)" class="trend-message-item">
          <i class="iconfont icon-dianzan"></i>
          <!-- el-icon-star-off -->
          {{ trend.favoritesCount }}点赞
        </div>
      </div>
      <!-- 评论 -->
      <div :class="'my-comment-container' + index"></div>
    </div>
    <el-divider v-if="!concernTrendList" content-position="center">你还没有关注其他用户</el-divider>
    <el-dialog title="请编辑举报理由" :visible.sync="dialogVisible" width="30%" :modal="false" :before-close="handleClose"
      close="my-return-box">
      <span style="margin-right:95px;">请选择违规类型</span>
      <el-select clearable v-model="reportValue" placeholder="请选择">
        <el-option v-for="item in reportType" :key="item._id" :label="item.content" :value="item._id"></el-option>
      </el-select>
      <el-input style="width:397px;margin-top:20px;" type="textarea" :rows="6" resize="none" maxlength="160"
        show-word-limit placeholder="请输入具体描述" v-model="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReportBox">取 消</el-button>
        <el-button style="margin-right:21px;" type="danger" @click="reportTheTrend">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store/index";
import TrendComment from "@/components/TrendComment";
import router from '@/router';
export default {
  name: "ConcernTrend",
  data() {
    return {
      commentAreaIndex: null,
      concernTrendList: null,
      imgList: [],
      oldBoxIndex: null,
      dialogVisible: false,
      textarea: "",
      reportValue: "",
      targetReportTrend: null,
      ofUser: null
    };
  },
  computed: {
    reportType() {
      return this.$store.state.user.reportType;
    },
    concernNum() {
      return this.$store.state.user.userInfo.concernsCount;
    }
  },
  methods: {
    toDetailUserView(userId) {
      this.$router.push({
        name: "userView",
        params: {
          userId
        }
      });
    },
    closeReportBox() {
      this.$refs.dialogContainer.classList.remove("my-dialog-background");
      this.dialogVisible = false;
    },
    toReportTheTrend(trendId, ofUser) {
      this.targetReportTrend = trendId;
      this.ofUser = ofUser;
      this.$refs.dialogContainer.classList.add("my-dialog-background");
      this.dialogVisible = true;
    },
    //举报动态
    async reportTheTrend() {
      if (!this.reportValue) {
        return this.$message({
          type: "warning",
          message: "你还没有选择违规类型"
        });
      }
      if (this.textarea.trim() === "") {
        return this.$message({
          type: "warning",
          message: "你还没有输入具体描述"
        });
      }
      const reportMessage = {};
      reportMessage.type = this.reportValue;
      reportMessage.message = this.textarea.trim();
      reportMessage.trend = this.targetReportTrend;
      reportMessage.ofUser = this.ofUser;
      const ret = await this.$API.report.reportTheTrend(reportMessage);
      if (ret.code === 200) {
        this.$refs.dialogContainer.classList.remove("my-dialog-background");
        this.textarea = "";
        this.dialogVisible = false;
        this.targetReportTrend = null;
        this.reportValue = null;
        this.ofUser = null;
        this.$message({
          type: "success",
          message: "举报成功"
        });
      }
    },
    //对话框关闭回调
    handleClose() {
      this.$refs.dialogContainer.classList.remove("my-dialog-background");
      this.textarea = "";
      this.dialogVisible = false;
      this.targetReportTrend = null;
      this.reportValue = null;
      this.ofUser = null;
    },
    //点赞
    async trendKudos(trendId, authorId) {
      if (this.$store.state.user.userId) {
        const ret = await this.$API.trend.kudos({
          trend: trendId,
          user: this.$store.state.user.userId,
          ofUser: authorId
        });
        if (ret.code === 200) {
          this.getConcernTrend();
        }
      } else {
        this.$router.push("/login");
      }
    },
    showComment(index, trendId) {
      if (this.commentAreaIndex === index) {
        const oldCommentArea = document.querySelector(
          `.my-comment-container${this.commentAreaIndex}`
        );
        oldCommentArea.removeChild(oldCommentArea.firstChild);
        this.commentAreaIndex = null;
      } else {
        const commentArea = document.querySelector(
          `.my-comment-container${index}`
        );
        // if (!commentArea.firstChild) {
        // }
        if (this.commentAreaIndex != null) {
          const oldCommentArea = document.querySelector(
            `.my-comment-container${this.commentAreaIndex}`
          );
          oldCommentArea.removeChild(oldCommentArea.firstChild);
        }
        this.$nextTick(() => {
          const myDiv = document.createElement("div");
          myDiv.classList.add("test");
          commentArea.appendChild(myDiv);
          const CommentComponent = Vue.extend(TrendComment);
          new CommentComponent({ store, router }).$mount(".test");
          this.commentAreaIndex = index;
          const commentDiv = document.querySelector(
            `.my-comment-container${index}`
          );
          window.scrollTo(0, commentDiv.offsetTop - 100);
        });
        setTimeout(() => {
          this.$bus.$emit("showComment", trendId);
        }, 50);
      }
    },
    toDetailTrend(trendId) {
      this.$router.push({
        name: "detailTrend",
        params: {
          trendId
        }
      });
    },
    //获取动态列表
    async getConcernTrend() {
      console.log(this.$API.trend.getConcernTrend)
      const ret = await this.$API.trend.getConcernTrend();
      console.log(ret)
      if (ret.code === 200) {
        for (const i in ret.trendList) {
          let imgArr = [];
          ret.trendList[i].image.forEach(item => {
            item = this.$myBaseUrl + item;
            imgArr.push(item);
          });
          ret.trendList[i].image = imgArr;
        }
        this.concernTrendList = ret.trendList;
      }
    },
    //打开悬浮框
    toEditComment(index) {
      if (this.oldBoxIndex != null) {
        this.$refs.editBox[this.oldBoxIndex].style.display = "none";
      }
      this.$refs.editBox[index].style.display = "block";
      this.oldBoxIndex = index;
    },
    //关闭悬浮框
    closeBox(index) {
      this.$refs.editBox[index].style.display = "none";
    }
    // async trendKudos() {
    //   const ret = await this.$API.trend.kudos({
    //     trend: this.detailTrend._id,
    //     user: this.$store.state.user.userId,
    //     ofUser: this.detailTrend.user._id
    //   });
    //   if (ret.code === 200) {
    //     this.getDetailTrend();
    //   }
    // },
  },
  mounted() {
    if (this.concernNum > 0) {
      this.getConcernTrend();
    }

  }
};
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
}

.my-dialog-container {
  transition: all 0.2s;
}

.my-dialog-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 2000;
}

.trend-item {
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;

  & :deep(.comment-top-container) {
    margin-top: 70px;
  }

  &:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .item-line {
    height: 1px;
    transform: scaleY(0.5);
    background-color: rgb(131, 130, 130);
    margin-bottom: 10px;
  }

  .trend-item-top {
    position: relative;

    img {
      width: 49px;
      border-radius: 50%;
      margin-left: 15px;
      margin-top: 5px;
      cursor: pointer;
    }

    .username {
      cursor: pointer;
      position: absolute;
      top: 10px;
      margin-left: 10px;
      display: inline-block;
    }

    .updateDate {
      cursor: default;
      position: absolute;
      top: 33px;
      left: 73px;
      font-size: 14px;
      display: inline-block;
    }

    .my-edit-icon {
      float: right;
      margin-top: 25px;
      margin-right: 20px;
      cursor: pointer;
    }

    .to-edit-comment {
      display: none;
      z-index: 100;
      position: absolute;
      border-radius: 6px;
      right: 22px;
      top: 40px;
      width: 80px;
      height: 30px;
      color: #222;
      background-color: white;
      box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
      padding-top: 4px;
      padding-left: 11px;
      cursor: pointer;

      span {
        font-size: 14px;
        width: 80px;
        display: inline-block;
        padding-left: 14px;
        color: #000000c3;
        font-weight: 600;
      }

      span:hover {
        color: var(--theme_search_input_blue_color);
      }
    }
  }

  .trend-body {
    max-height: 145px;
    margin-top: 10px;
    padding-left: 72px;
    padding-right: 20px;
    padding-bottom: 10px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    display: -webkit-box;
    cursor: pointer;
  }

  .img-container {
    width: 82%;
    margin-top: 10px;
    margin-left: 73px;

    & :deep(.el-image) {
      width: 180px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }

  .trend-message {
    width: 300px;
    margin-top: 20px;
    margin-left: 75px;
    float: left;

    &:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    .trend-message-item {
      float: left;
      margin-right: 15px;
      font-size: 14px;
      cursor: pointer;
      transition: color 0.3s;

      i {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .trend-message-item:hover {
      color: var(--theme_search_input_blue_color);
    }
  }
}
</style>