<template>
  <div class="right">
    <div class="right-top">文章相关</div>
    <div class="right-main">
      <div v-for="(comment,index) in articleCommentList" :key="comment._id" class="main-item">
        <div class="data-item">
          <div class="data-container">
            <div class="side-bar"></div>
            <img class="user-img" :src="comment.user.image" />
            <div class="item-message-container">
              <span class="user-name">{{comment.user.username}}</span>
              <span class="item-title">评论了你的文章</span>
              <br />
              <span class="user-bio">{{comment.body}}</span>
            </div>
            <div class="own-message">
              <span>{{comment.article.title}}</span>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div class="messageDate">{{$dayjs(comment.createdAt).format("YYYY/MM/DD HH:mm")}}</div>
          <div class="my-toReply">
            <i class="iconfont icon-taolun"></i>
            回复
          </div>
          <div @click="kudosTheComment(comment._id,comment.user._id)" class="my-kudos">
            <i v-if="commentStatusArr[index].status===0" class="iconfont icon-dianzan"></i>
            <i v-else class="my-kudos-i iconfont icon-dianzan"></i>
            点赞
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutArticle",
  data() {
    return {
      articleCommentList: null,
      commentStatusArr: null
    };
  },
  methods: {
    async getArticleComment() {
      const ret = await this.$API.message.getArticleComment();
      if (ret.code === 200) {
        this.articleCommentList = ret.articleCommentArr;
        this.commentStatusArr = ret.commentStatusArr;
      }
    },
    async kudosTheComment(commentId,ofUserId) {
      const commentKudos = {};
      commentKudos.comment = commentId;
      commentKudos.ofUser = ofUserId;
      const ret = await this.$API.comment.commentKudos(commentKudos);
      if (ret.code === 200) {
        this.getArticleComment()
      }
    }
  },
  mounted() {
    this.getArticleComment();
  }
};
</script>

<style lang='less' scoped>
.right {
  width: 910px;
  height: 100%;
  float: right;
  transition: all 0.3s;
  .right-top {
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
    width: 100%;
    height: 50px;
    background-color: var(--theme_inner_bg_color);
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
    transition: all 0.3s;
  }
  .right-main {
    width: 100%;
    height: 615px;
    overflow-y: auto;
    background-color: var(--theme_inner_bg_color);
    border-radius: 5px;
    transition: all 0.3s;
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
    .main-item {
      margin-top: 20px;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .data-item {
        margin-bottom: 0px;
        transition: all 0.4s;
        .data-container {
          transition: all 0.5s;
          font-weight: 600;
          position: relative;
          height: 70px;
          .own-message {
            position: absolute;
            right: 0;
            top: 5px;
            width: 65px;
            height: 66px;
            line-height: 13px;
            font-weight: 300;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            cursor: default;
          }
          &:after {
            /*伪元素是行内元素 正常浏览器清除浮动方法*/
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
          }
          .side-bar {
            width: 3px;
            height: 70px;
            float: left;
            background-color: rgb(13, 71, 161);
          }
          .user-img {
            float: left;
            width: 50px;
            border-radius: 50%;
            line-height: 50px;
            margin-left: 20px;
            margin-top: 35px;
            transform: translateY(-50%);
            cursor: pointer;
          }
          .item-message-container {
            float: left;
            margin-top: 35px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 14px;
            line-height: 24px;
            max-height: 70px;
            transform: translateY(-50%);
            margin-left: 8px;
            width: 820px;
            &:after {
              /*伪元素是行内元素 正常浏览器清除浮动方法*/
              content: "";
              display: block;
              height: 0;
              clear: both;
              visibility: hidden;
            }
            .user-name {
              font-weight: 600;
              cursor: pointer;
              transition: color 0.4s;
              margin-left: 2px;
              &:hover {
                color: var(--theme_search_input_blue_color);
              }
            }
            .item-title {
              margin-left: 10px;
              cursor: pointer;
            }
            .user-bio {
              font-weight: 500;
              cursor: default;
            }
          }
        }
      }
      .data-item:hover {
        background-color: var(--theme_search_data_title_hover_bg);
      }
      .bottom-box {
        min-height: 23px;
        float: right;
        width: 95%;
        margin-top: -18px;
        margin-right: 20px;
        .messageDate {
          margin-left: 55px;
          font-size: 14px;
          float: left;
        }
        .my-toReply {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
        }
        .my-kudos {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
          .my-kudos-i {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
  }
  .right-main::-webkit-scrollbar {
    width: 3px;
  }
}
</style>