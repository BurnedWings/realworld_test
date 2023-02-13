<template>
  <div class="trendView">
    <div class="trend-container">
      <div class="trend-item">
        <div class="trend-item-top">
          <img :src="detailTrend?$myBaseUrl+detailTrend.user.image:''" alt />
          <div class="username">{{detailTrend?detailTrend.user.username:''}}</div>
          <div
            class="updateDate"
          >{{detailTrend?$dayjs(detailTrend.createdAt).format("YYYY/MM/DD"):''}}&nbsp;更新</div>
          <i @click="toReportTheTrend" class="my-edit-icon el-icon-more"></i>
          <div @mouseleave="closeToReportBox" @click="dialogVisible=true" class="report-box">举报</div>
        </div>
        <div class="trend-body">
          <span class="content-container" v-html="detailTrend?detailTrend.body:''"></span>
          <div v-if="detailTrend" class="img-container">
            <div
              v-for="(img,index) in detailTrend.image"
              style="margin-right:5px;width:200px;height:200px;overflow:hidden;display:inline-block;"
            >
              <el-image
                style="width:100%;height:100%; "
                :key="index"
                fit="cover"
                :src="img"
                :preview-src-list="detailTrend.image"
              ></el-image>
            </div>
          </div>
        </div>
        <div v-if="detailTrend" class="trend-message">
          <div class="trend-message-item">
            <i class="iconfont icon-dianji"></i>
            {{detailTrend.clicksCount}}热度
          </div>
          <div class="trend-message-item">
            <i class="iconfont icon-taolun"></i>
            {{detailTrend.commentsCount}}讨论
          </div>
          <div @click="trendKudos" class="trend-message-item">
            <i v-if="!isKudos" class="iconfont icon-dianzan"></i>
            <i v-if="isKudos" class="my-kudos iconfont icon-dianzan_kuai"></i>
            {{detailTrend.favoritesCount}}点赞
          </div>
        </div>
      </div>
      <transition name="fade-transform" mode="out-in">
        <TrendComment v-if="detailTrend" :detailTrend="detailTrend._id"></TrendComment>
      </transition>
    </div>
    <el-dialog
      title="请编辑举报理由"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      close="my-return-box"
      :modal-append-to-body="false"
    >
      <span style="margin-right:95px;">请选择违规类型</span>
      <el-select clearable v-model="reportValue" placeholder="请选择">
        <el-option
          v-for="item in reportType"
          :key="item._id"
          :label="item.content"
          :value="item._id"
        ></el-option>
      </el-select>
      <el-input
        style="width:95%;margin-top:20px;"
        type="textarea"
        :rows="6"
        resize="none"
        maxlength="160"
        show-word-limit
        placeholder="请输入具体描述"
        v-model="textarea"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button style="margin-right:21px;" type="danger" @click="reportTheTrend">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const TrendComment = () => import("@/components/TrendComment");
export default {
  name: "DetailTrend",
  data() {
    return {
      detailTrend: null,
      isKudos: null,
      textarea: "",
      dialogVisible: false,
      reportValue: null
    };
  },
  computed: {
    reportType() {
      return this.$store.state.user.reportType;
    }
  },
  components: {
    TrendComment
  },
  methods: {
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
      reportMessage.trend = this.detailTrend._id;
      reportMessage.ofUser = this.detailTrend.user._id;
      const ret = await this.$API.report.reportTheTrend(reportMessage);
      if (ret.code === 200) {
        this.textarea = "";
        this.dialogVisible = false;
        this.reportValue = null;
        this.$message({
          type: "success",
          message: "举报成功"
        });
      }
    },
    //关闭回调
    handleClose() {
      this.textarea = "";
      this.dialogVisible = false;
      this.reportValue = null;
    },
    //关闭举报动态框
    closeToReportBox() {
      document.querySelector(".report-box").style.display = "none";
    },
    //打开举报动态框
    toReportTheTrend() {
      document.querySelector(".report-box").style.display = "block";
    },
    async getDetailTrend() {
      const ret = await this.$API.trend.getDetailTrend(
        this.$route.params.trendId
      );
      if (ret.code === 200) {
        let imageArr = [];
        ret.trend.image.forEach(item => {
          item = this.$myBaseUrl + item;
          imageArr.push(item);
        });
        ret.trend.image = imageArr;
        this.detailTrend = ret.trend;
        if(this.$store.state.user.userInfo._id){
          this.getTrendKudosStatus();
        }
      }
    },
    async trendKudos() {
      if(this.$store.state.user.userInfo._id){
        const ret = await this.$API.trend.kudos({
        trend: this.detailTrend._id,
        user: this.$store.state.user.userId,
        ofUser: this.detailTrend.user._id
      });
      if (ret.code === 200) {
        this.getDetailTrend();
      }
      }else{
        this.$router.push('/login')
      }
    },
    async getTrendKudosStatus() {
      const ret = await this.$API.trend.getTrendKudosStatus({
        trend: this.detailTrend._id
      });
      if (ret.code === 200) {
        this.isKudos = ret.isKudos;
      }
    }
  },
  mounted() {
    this.getDetailTrend();
  }
};
</script>
<style lang="less">
.comment-popover {
  border: none;
  background-color: transparent;
}
.my-emojis-box {
  width: 100%;
  height: 190px;
  border-radius: 5px;
  background: white;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 100;
  overflow-y: scroll;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    li {
      cursor: pointer;
      width: 10%;
      font-size: 26px;
      list-style: none;
      text-align: center;
    }
  }
}
</style>
<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
}
.trendView {
  transition: all 0.5s;
  min-width: 1531px;
  min-height: 100vh;
  padding-top: 90px;
  padding-bottom: 100px;
  background-color: var(--theme_outer_bg_color);
  .trend-container {
    transition: all 0.5s;
    width: 702px;
    min-height: 200px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
    padding-top: 10px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .trend-item {
      width: 100%;
      padding-top: 5px;
      padding-bottom: 0px;
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
        .report-box {
          display: none;
          width: 80px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          color: #000000c3;
          background-color: white;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
          position: absolute;
          right: 20px;
          top: 40px;
          border-radius: 5px;
          cursor: pointer;
          &:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
        img {
          width: 49px;
          border-radius: 50%;
          margin-left: 15px;
          margin-top: 5px;
        }
        .username {
          position: absolute;
          top: 10px;
          margin-left: 10px;
          display: inline-block;
        }
        .updateDate {
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
      }
      .trend-body {
        margin-top: 10px;
        padding-left: 72px;
        padding-right: 20px;
        padding-bottom: 10px;
        cursor: default;
        .img-container {
          width: 82%;
          margin-top: 10px;
          margin-left: 2px;
          // & :deep(.el-image) {
          //   width: 180px;
          //   margin-right: 5px;
          //   margin-bottom: 5px;
          // }
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
          .my-kudos {
            color: var(--theme_search_input_blue_color);
          }
        }
        .trend-message-item:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }
  }
}
</style>