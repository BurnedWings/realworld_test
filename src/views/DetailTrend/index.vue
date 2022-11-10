<template>
  <div class="trendView">
    <div class="trend-container">
      <div class="trend-item">
        <div class="trend-item-top">
          <img :src="detailTrend?detailTrend.user.image:''" alt />
          <div class="username">{{detailTrend?detailTrend.user.username:''}}</div>
          <div
            class="updateDate"
          >{{detailTrend?$dayjs(detailTrend.createdAt).format("YYYY/MM/DD"):''}}&nbsp;更新</div>
          <i class="my-edit-icon el-icon-more"></i>
        </div>
        <div class="trend-body">
          <span class="content-container" v-html="detailTrend?detailTrend.body:''"></span>
          <div v-if="detailTrend" class="img-container">
            <el-image
              v-for="(img,index) in detailTrend.image"
              :key="index"
              :src="img"
              :preview-src-list="detailTrend.image"
            ></el-image>
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
      <TrendComment v-if="detailTrend"  :detailTrend="detailTrend._id"></TrendComment>
    </div>
  </div>
</template>

<script>
import TrendComment from "@/components/TrendComment";
export default {
  name: "DetailTrend",
  data() {
    return {
      detailTrend: null,
      isKudos: null,
    };
  },
  components: {
    TrendComment
  },
  methods: {
    async getDetailTrend() {
      const ret = await this.$API.trend.getDetailTrend(
        this.$route.params.trendId
      );
      if (ret.code === 200) {
        this.detailTrend = ret.trend;
        this.getTrendKudosStatus();
      }
    },
    async trendKudos() {
      const ret = await this.$API.trend.kudos({
        trend: this.detailTrend._id,
        user: this.$store.state.user.userId,
        ofUser: this.detailTrend.user._id
      });
      if (ret.code === 200) {
        this.getDetailTrend();
      }
    },
    async getTrendKudosStatus() {
      const ret = await this.$API.trend.getTrendKudosStatus({
        trend: this.detailTrend._id
      });
      if (ret.code === 200) {
        this.isKudos = ret.isKudos;
      }
    },
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
.trendView {
  position: relative;
  transition: all 0.5s;
  min-width: 1531px;
  min-height: 745px;
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
          & :deep(.el-image) {
            width: 180px;
            margin-right: 5px;
            margin-bottom: 5px;
          }
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
          .my-kudos{
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