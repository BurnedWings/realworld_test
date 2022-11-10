<template>
  <div>
    <div v-for="(trend,index) in concernTrendList" :key="trend._id" class="trend-item">
      <div class="item-line"></div>
      <div class="trend-item-top">
        <img :src="trend.user.image" alt />
        <div class="username">{{trend.user.username}}</div>
        <div class="updateDate">{{$dayjs(trend.createdAt).format("YYYY/MM/DD")}}&nbsp;更新</div>
        <i @click="toEditComment(index)" class="my-edit-icon el-icon-more"></i>
        <div @mouseleave="closeBox(index)" ref="editBox" class="to-edit-comment">
          <span>加入黑名单</span>
          <br />
          <span>举报</span>
        </div>
      </div>
      <div @click="toDetailTrend(trend._id)" class="trend-body">
        <span v-html="trend.body"></span>
      </div>
      <div class="img-container">
        <el-image
          v-for="(img,index) in trend.image"
          :key="index"
          :src="img"
          :preview-src-list="trend.image"
        ></el-image>
      </div>
      <div class="trend-message">
        <div class="trend-message-item">
          <i class="iconfont icon-dianji"></i>
          {{trend.clicksCount}}热度
        </div>
        <div @click="showComment(index,trend._id)" class="trend-message-item">
          <i class="iconfont icon-taolun"></i>
          {{trend.commentsCount}}讨论
        </div>
        <div @click="trendKudos(trend._id,trend.user._id)" class="trend-message-item">
          <i class="iconfont icon-dianzan"></i>
          <!-- el-icon-star-off -->
          {{trend.favoritesCount}}点赞
        </div>
      </div>
      <!-- 评论 -->
      <div :class="'my-comment-container'+index"></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store/index";
import TrendComment from "@/components/TrendComment";
export default {
  name: "ConcernTrend",
  data() {
    return {
      commentAreaIndex: null,
      concernTrendList: null,
      imgList: [],
      oldBoxIndex:null
    };
  },
  methods: {
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
        new CommentComponent({ store }).$mount(".test");
        this.commentAreaIndex = index;
      });
      setTimeout(() => {
        this.$bus.$emit("showComment", trendId);
      }, 50);
    },
    toDetailTrend(trendId) {
      this.$router.push({
        name: "detailTrend",
        params: {
          trendId
        }
      });
    },
    async getConcernTrend() {
      const ret = await this.$API.trend.getConcernTrend();
      if (ret.code === 200) {
        this.concernTrendList = ret.trendList;
      }
    },
    //打开悬浮框
    toEditComment(index) {
      if(this.oldBoxIndex!=null){
        this.$refs.editBox[this.oldBoxIndex].style.display = 'none'
      }
      this.$refs.editBox[index].style.display = 'block'
      this.oldBoxIndex = index
    },
    //关闭悬浮框
    closeBox(index) {
      this.$refs.editBox[index].style.display = "none";
    },
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
    this.getConcernTrend();
  }
};
</script>

<style lang="less" scoped>
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
    .to-edit-comment {
      display: none;
      z-index: 100;
      position: absolute;
      border-radius: 6px;
      right: 20px;
      top: 40px;
      width: 100px;
      height: 60px;
      color: #222;
      background-color: white;
      box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
      padding-top: 5px;
      span {
        font-size: 14px;
        width: 100%;
        display: inline-block;
        padding-left: 14px;
        cursor: pointer;
      }
      span:hover {
        background-color: whitesmoke;
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