<template>
  <div class="user-trends">
    <div class="title">个人动态</div>
    <div>
      <div v-for="(trend, index) in concernTrendList" :key="trend._id" class="trend-item">
        <div class="item-line"></div>
        <div class="trend-item-top">
          <img :src="$myBaseUrl + trend.user.image" alt />
          <div class="username">{{ trend.user.username }}</div>
          <div class="updateDate">{{ $dayjs(trend.createdAt).format("YYYY/MM/DD") }}&nbsp;更新</div>
          <el-popconfirm title="你确定要删除动态嘛?" class="edit-container" @confirm="deleteOwnTrend(trend._id)">
            <i slot="reference" v-if="userId === trend.user._id" class="my-edit-icon el-icon-delete"></i>
          </el-popconfirm>
        </div>
        <div @click="toDetailTrend(trend._id)" class="trend-body">
          <span v-text="trend.body"></span>
        </div>
        <div class="img-container">
          <div v-for="(img, index) in trend.image"
            style="width:200px;height:200px;overflow:hidden;display:inline-block;margin-right:5px;">
            <el-image style="width:100%;height: 100%;" :key="index" :src="img" :preview-src-list="trend.image"
              fit="cover"></el-image>
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
          <div @click="kudos(trend._id, trend.user._id)" class="trend-message-item">
            <i class="iconfont icon-dianzan"></i>
            <!-- el-icon-star-off -->
            {{ trend.favoritesCount }}点赞
          </div>
        </div>
        <!-- 评论 -->
        <div id="my-comment-container" :class="'my-comment-container' + index"></div>
      </div>
      <div class="bottom-line"></div>
      <div class="noMoreMessage">没有更多动态了哦</div>
    </div>
  </div>
</template>
  
<script>
import Vue from "vue";
import store from "@/store/index";
import TrendComment from "@/components/TrendComment";
import router from '@/router';
export default {
  name: "UserTrends",
  components: {},
  data() {
    return {
      commentAreaIndex: null,
      concernTrendList: null,
      imgList: []
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userInfo._id;
    }
  },
  methods: {
    //点赞
    async kudos(trendId, authorId) {
      if (this.$store.state.user.userInfo._id) {
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
    //获取动态
    async getConcernTrend() {
      const ret = await this.$API.trend.getOwnTrend(this.$route.params.userId);
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
    //删除动态
    async deleteOwnTrend(trendId) {
      const ret = await this.$API.trend.deleteTrend(trendId);
      if (ret.code === 200) {
        this.getConcernTrend();
        this.$message({
          type: "success",
          message: "删除成功~"
        });
      }
    }
  },
  mounted() {
    this.getConcernTrend();
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
:deep(.el-textarea__inner::placeholder) {
  color: var(--theme_search_input_blue_color);
}

:deep(.submit-button:hover) {
  background-color: rgb(35, 109, 227);
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
}

.user-trends {
  padding-bottom: 200px;

  .title {
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 18px;
  }

  .trend-item {
    width: 100%;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-right: 13px;

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

      .my-edit-icon {
        float: right;
        margin-top: 15px;
        cursor: pointer;

        &:hover {
          color: var(--theme_search_input_blue_color);
        }
      }

      img {
        cursor: default;
        width: 49px;
        border-radius: 50%;
        margin-left: 15px;
        margin-top: 5px;
      }

      .username {
        cursor: default;
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
      width: 52%;
      margin-top: 10px;
      margin-left: 73px;
      // :deep(.el-image) {
      //   width: 180px;
      //   margin-right: 5px;
      //   margin-bottom: 5px;
      //   object-fit: cover;
      // }
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

    #my-comment-container {
      :deep(.comment-top-container .el-textarea) {
        width: 772px;
      }

      :deep(#reply-input-container) {
        width: 793px;

        .comment-input {
          .submit-button {
            margin-right: 74px;
          }
        }

        & :deep(.el-textarea) {
          width: 85.5%;
        }

        & :deep(.emojis-button) {
          margin-left: 42px;
          height: 32px;
          margin-top: 8px;
          width: 65px;
          padding: 1px;
        }

        & :deep(.user-img) {
          margin-top: 18px;
          width: 33px;

          img {
            width: 33px;
          }
        }
      }
    }
  }

  .bottom-line {
    width: 100%;
    height: 1px;
    background-color: rgb(131, 130, 130);
    transform: scaleY(0.5);
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .noMoreMessage {
    text-align: center;
  }
}
</style>