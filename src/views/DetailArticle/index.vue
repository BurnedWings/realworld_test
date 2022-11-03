<template>
  <div class="article-view">
    <div class="article-container">
      <div class="title">{{detailArticle.title}}</div>
      <div class="article-message">
        <span>2022-10-21 12:45</span>·
        <span>{{detailArticle.clicksCount}}阅读</span>·
        <span>{{detailArticle.favoritesCount}}喜欢</span>·
        <span>{{detailArticle.commentsCount}}评论</span>
      </div>
      <div class="author-info">
        <img @click="toUserView" class="author-image" :src="authorInfo.image" />
        <div class="author-message">
          <span @click="toUserView" class="author-name">{{authorInfo.username}}</span>
          <br />
          <span class="author-fans">粉丝:&nbsp;&nbsp;1231231</span>
          <span>文章:&nbsp;&nbsp;{{authorInfo.articleCount}}</span>
        </div>
        <div class="concern-btn">
          <div class="concern-button">关注</div>
        </div>
      </div>
      <div class="title-line"></div>
      <div class="articleBody" v-html="detailArticle.body"></div>
      <div class="article-tag">
        <span v-for="(tag,index) in detailArticle.tagList">#{{tag}}</span>
      </div>
      <div class="bottom-line"></div>
      <div class="share-box">
        <ul class="box-container">
          分享到:
          <li class="share-box-item">
            <i class="iconfont icon-dongtai"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-weibo"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-weixin"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-qqkongjian"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-QQ"></i>
          </li>
        </ul>
      </div>
      <div class="article-advice">投诉或建议</div>
    </div>
    <div id="comments-container" class="comments-container">
      <div class="num">{{commentCount}}条评论</div>
      <div class="search-type">
        <ul>
          <li ref="orderByHot" class="active" @click="orderByHot">按热度排序</li>
          <li ref="orderByTime" @click="orderByTime">按时间排序</li>
        </ul>
      </div>
      <div ref="activeLineOne" class="active-line-one"></div>
      <div ref="activeLineTwo"></div>
      <div class="line"></div>
      <div class="comment-input-container">
        <CommentInput :articleId="detailArticle._id" @refComments="getComments"></CommentInput>
      </div>
      <div v-if="commentCount===0" class="no-comment-box">没有更多评论</div>
      <div class="comments-body">
        <div v-for="(comment,myIndex) in commentsList" :key="comment._id" class="comment-item">
          <div class="item-line"></div>
          <div class="user-avatar">
            <img :src="comment.user.image" alt />
          </div>
          <div class="comment-content">
            <div class="user-name">{{comment.user.username}}</div>
            <div class="comment-body">{{comment.body}}</div>
            <div class="comment-bottom">
              <div
                class="comment-date"
              >{{$dayjs(comment.createdAt).format("YYYY/MM/DD")}}&nbsp;&nbsp;{{$dayjs(comment.createdAt).format("HH:mm")}}</div>
              <div @click="kudosTheComment(comment._id,comment.user._id)" class="kudos">
                <i
                  v-if="commentStatusArr===null||commentStatusArr[myIndex].status===0"
                  class="iconfont icon-dianzan"
                ></i>
                <i
                  v-if="commentStatusArr!=null&&commentStatusArr[myIndex].status===1"
                  class="my-dianzan-icon iconfont icon-dianzan"
                ></i>&nbsp;
                <span>{{comment.favoritesCount>0?comment.favoritesCount:''}}</span>
              </div>
              <div class="reply" @click="showReplyInput(myIndex,comment.user,null,comment._id)">回复</div>
              <div class="comment-edit">
                <i @click="toEditComment(myIndex)" class="el-icon-more"></i>
                <div @mouseleave="closeBox(myIndex)" ref="editBox" class="to-edit-comment">
                  <span>加入黑名单</span>
                  <br />
                  <span>举报</span>
                </div>
              </div>
            </div>
            <div class="reply-item" v-for="(reply,index) in comment.replyList" :key="reply._id">
              <div class="reply-left">
                <img :src="reply.user.image" alt />
              </div>
              <div class="reply-right">
                <span class="reply-user-name">{{reply.user.username}}</span>
                <span v-if="reply.toReply" class="reply-to">@{{reply.toReply.username}}</span>
                <span>{{reply.body}}</span>
                <div class="reply-item-bottom">
                  <div
                    class="reply-date"
                  >{{$dayjs(reply.createdAt).format("YYYY/MM/DD")}}&nbsp;&nbsp;{{$dayjs(reply.createdAt).format("HH:mm")}}</div>
                  <div @click="kudosTheReply(reply._id,reply.user._id)" class="kudos">
                    <i
                      v-if="commentStatusArr===null||commentStatusArr[myIndex].reply[index]===0"
                      class="iconfont icon-dianzan"
                    ></i>
                    <i
                      v-if="commentStatusArr!=null&&commentStatusArr[myIndex].reply[index]===1"
                      class="my-dianzan-icon iconfont icon-dianzan"
                    ></i>&nbsp;
                    <span>{{reply.favoritesCount>0?reply.favoritesCount:''}}</span>
                  </div>
                  <div
                    @click="showReplyInput(myIndex,reply.user,reply.user._id,comment._id)"
                    class="reply"
                  >回复</div>
                  <div class="reply-edit">
                    <i @click="toEditReply(myIndex,index)" class="my-edit-icon el-icon-more"></i>
                    <div
                      @mouseleave="closeReplyBox(myIndex,index)"
                      :ref="'replyEditBox'+myIndex+index"
                      class="to-edit-reply"
                    >
                      <span>加入黑名单</span>
                      <br />
                      <span>举报</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="reply-input-container" :class="'reply-input-container'+myIndex"></div>
          </div>
        </div>
        <!-- <ReplyInput v-if="isReplyInputShow" ref="ReplyInput" :toUser="toUser" :articleId="detailArticle._id" @refComments="getComments" ></ReplyInput> -->
      </div>
    </div>
    <div ref="sideToolbar" class="side-toolbar">
      <div class="side-toolbar-directory">
        <i class="el-icon-document"></i>
      </div>
      <ul class="side-toolbar-container">
        <li @click="kudos" class="side-toolbar-item">
          <i v-if="!isKudos" class="iconfont icon-dianzan"></i>
          <i v-if="isKudos" class="iconfont icon-dianzan_kuai"></i>
        </li>
        <li class="side-toolbar-item">
          <a href="#comments-container">
            <i class="el-icon-chat-dot-square"></i>
          </a>
        </li>
        <li @click="collection" class="side-toolbar-item">
          <i v-if="isCollection" class="iconfont icon-shoucangxuanzhong"></i>
          <i v-if="!isCollection" class="iconfont icon-shoucang"></i>
        </li>
      </ul>
      <div @click="toTop" ref="toolbarToTop" class="side-toolbar-toTop">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
    <el-dialog class="my-dialog" title="加入收藏夹" center :visible.sync="dialogTableVisible">
      <div class="line"></div>
      <div class="inner-collection-container">
        <div
          v-for="(collection,index) in collectionList"
          :key="collection._id"
          class="collection-item"
        >
          <div class="data-title">
            <div class="side-bar"></div>
            <i class="myIcon el-icon-wallet"></i>
            <div class="title-content">{{collection.collectionName}}</div>
            <span
              @click="collectionArticle(collection._id)"
              class="collection-status"
            >{{isCollectionArr[index]===1?'已收藏':'收藏'}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import CommentInput from "@/components/CommentInput";
import ReplyInput from "@/components/ReplyInput";
import store from "@/store/index";
export default {
  name: "DetailArticle",
  components: {
    CommentInput,
    ReplyInput
  },
  data() {
    return {
      detailArticle: {},
      authorInfo: {},
      commentsList: null,
      chooseBox: null,
      replyInputContainer: null,
      chooseReplyBox: null,
      isReplyInputShow: false,
      inputAreaIndex: null,
      oldMyIndex: null,
      oldIndex: null,
      commentCount: null,
      isScroll: false,
      isKudos: false,
      dialogTableVisible: false,
      collectionList: null,
      isCollection: false,
      isCollectionArr: null,
      commentStatusArr: null
    };
  },
  computed: {},
  watch: {
    $route(to, from) {
      if (this.$route.params.articleId) {
        this.getDetailArticle();
        this.getComments();
        this.getKudosStatus();
        this.getCollectionStatus();
      }
    }
  },
  methods: {
    toUserView() {
      this.$router.push({
        name: "userView",
        params: {
          userId:this.authorInfo._id
        }
      });
    },
    async getDetailArticle() {
      const ret = await this.$API.article.getDetailArticle(
        this.$route.params.articleId
      );
      if (ret.code === 200) {
        this.detailArticle = ret.data;
        this.authorInfo = ret.data.author;
      }
    },
    orderByHot() {
      this.$refs.orderByTime.classList.remove("active");
      this.$refs.activeLineTwo.classList.remove("active-line-two");
      this.$refs.orderByHot.classList.add("active");
      this.$refs.activeLineOne.classList.add("active-line-one");
    },
    orderByTime() {
      this.$refs.orderByTime.classList.add("active");
      this.$refs.activeLineTwo.classList.add("active-line-two");
      this.$refs.orderByHot.classList.remove("active");
      this.$refs.activeLineOne.classList.remove("active-line-one");
    },
    async getComments() {
      const ret = await this.$API.comment.getCommentsList(
        this.$route.params.articleId
      );
      if (ret.code === 200) {
        this.commentCount = ret.totalNum;
        this.commentsList = ret.comments;
        if (ret.status) {
          this.commentStatusArr = ret.status;
        }
      }
    },
    //打开操作评论悬浮框
    toEditComment(index) {
      if (this.oldMyIndex != null) {
        this.$refs[
          `replyEditBox${this.oldMyIndex}${this.oldIndex}`
        ][0].style.display = "none";
      }
      if (this.chooseBox != null) {
        this.$refs.editBox[this.chooseBox].style.display = "none";
      }
      if (this.chooseReplyBox != null) {
        this.$refs.replyEditBox[this.chooseReplyBox].style.display = "none";
      }
      this.$refs.editBox[index].style.display = "block";
      this.chooseBox = index;
    },
    //打开操作回复悬浮框
    toEditReply(myIndex, index) {
      if (this.chooseBox != null) {
        this.$refs.editBox[this.chooseBox].style.display = "none";
      }
      if (this.oldMyIndex != null) {
        this.$refs[
          `replyEditBox${this.oldMyIndex}${this.oldIndex}`
        ][0].style.display = "none";
      }
      this.$refs[`replyEditBox${myIndex}${index}`][0].style.display = "block";
      this.oldMyIndex = myIndex;
      this.oldIndex = index;
    },
    //关闭回复悬浮框
    closeReplyBox() {
      this.$refs[
        `replyEditBox${this.oldMyIndex}${this.oldIndex}`
      ][0].style.display = "none";
    },
    //关闭操作评论悬浮框
    closeBox(index) {
      this.$refs.editBox[index].style.display = "none";
    },
    //显示回复输入框
    showReplyInput(index, user, replyId, commentId) {
      const inputArea = document.querySelector(
        `.reply-input-container${index}`
      );

      if (!inputArea.firstChild) {
        if (this.inputAreaIndex != null) {
          const oldInputArea = document.querySelector(
            `.reply-input-container${this.inputAreaIndex}`
          );
          oldInputArea.removeChild(oldInputArea.firstChild);
        }
        this.$nextTick(() => {
          const myDiv = document.createElement("div");
          myDiv.classList.add("test");
          inputArea.appendChild(myDiv);
          const ReplyInputComponent = Vue.extend(ReplyInput);
          new ReplyInputComponent({ store }).$mount(".test");
          this.inputAreaIndex = index;
        });
      }
      setTimeout(() => {
        this.$bus.$emit(
          "myFocus",
          user,
          this.detailArticle._id,
          commentId,
          replyId
        );
      }, 50);
    },
    myScroll() {
      const osTop =
        document.documentElement.scrollTop || document.body.srcollTop;
      if (osTop > 335 && !this.isScroll) {
        this.$refs.sideToolbar.style.top = 410 + "px";
        this.$refs.toolbarToTop.style.opacity = 1;
        this.isScroll = true;
      } else if (osTop < 335 && this.isScroll) {
        this.$refs.sideToolbar.style.top = 490 + "px";
        this.$refs.toolbarToTop.style.opacity = 0;
        this.isScroll = false;
      }
    },
    toTop() {
      window.scrollTo(0, 0);
    },
    //获取点赞状态
    async getKudosStatus() {
      const ret = await this.$API.article.getKudosStatus({
        article: this.$route.params.articleId,
        user: this.$store.state.user.userId
      });
      if (ret.code === 200) {
        this.isKudos = ret.isKudos;
      }
    },
    //点赞
    async kudos() {
      if (this.$store.state.user.userId) {
        const ret = await this.$API.article.kudos({
          article: this.$route.params.articleId,
          user: this.$store.state.user.userId,
          ofUser: this.authorInfo._id
        });
        if (ret.code === 200) {
          this.getDetailArticle();
          this.getKudosStatus();
        }
      } else {
        this.$router.push("/login");
      }
    },
    async collection() {
      if (this.$store.state.user.userId) {
        const ret = await this.$API.collection.getCollectionList(
          this.$route.params.articleId
        );
        if (ret.code === 200) {
          this.collectionList = ret.collectionList;
          this.isCollectionArr = ret.arr;
        }
        this.dialogTableVisible = true;
      } else {
        this.$router.push("/login");
      }
    },
    async collectionArticle(collectionId) {
      const collection = {
        article: this.detailArticle._id,
        ofCollection: collectionId
      };
      const ret = await this.$API.collection.collectionArticle(collection);
      if (ret.code === 200) {
        this.getCollectionStatus();
        this.dialogTableVisible = false;
        this.$message({
          type: "success",
          message: "更新成功"
        });
      }
    },
    //获取收藏状态
    async getCollectionStatus() {
      const ret = await this.$API.collection.getCollectionStatus(
        this.$route.params.articleId
      );
      if (ret.code === 200) {
        this.isCollection = ret.isCollection;
      }
    },
    //评论点赞
    async kudosTheComment(commentId, ofUserId) {
      if (this.$store.state.user.userId) {
        const commentKudos = {};
        commentKudos.comment = commentId;
        commentKudos.ofUser = ofUserId;
        const ret = await this.$API.comment.commentKudos(commentKudos);
        if (ret.code === 200) {
          this.getComments();
        }
      } else {
        this.$router.push("/login");
      }
    },
    //回复点赞
    async kudosTheReply(replyId, ofUserId) {
      if (this.$store.state.user.userId) {
        const replyKudos = {};
        replyKudos.reply = replyId;
        replyKudos.ofUser = ofUserId;
        const ret = await this.$API.comment.replyKudos(replyKudos);
        if (ret.code === 200) {
          this.getComments();
        }
      } else {
        this.$router.push("/login");
      }
    }
  },
  created() {},
  mounted() {
    this.getDetailArticle();
    if (this.$store.state.user.userInfo._id) {
      this.getKudosStatus();
      this.getCollectionStatus();
    }
    this.getComments();
    this.$bus.$on("refComments", () => {
      this.getComments();
    });
    window.addEventListener("scroll", this.myScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.myScroll);
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

<style lang="less" scoped >
:deep(.el-textarea) {
  float: right;
  width: 86.4%;
  margin-right: 5%;
}
:deep(.emojis-button) {
  padding: 5px;
  float: left;
  width: 70px;
  height: 30px;
  margin-left: 8.6%;
  margin-top: 10px;
  box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
}
:deep(.submit-button) {
  transition: all 0.3s;
  padding: 1px;
  color: white;
  height: 30px;
  width: 70px;
  float: right;
  margin-top: 10px;
  margin-right: 5%;
  border: none;
  background-color: var(--theme_search_input_blue_color);
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}
:deep(.submit-button:hover) {
  background-color: rgb(35, 109, 227);
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
}

.article-view {
  position: relative;
  transition: all 0.5s;
  min-width: 1531px;
  min-height: 745px;
  padding-top: 110px;
  padding-bottom: 100px;
  background-color: var(--theme_outer_bg_color);
  .article-container {
    transition: all 0.5s;
    width: 918px;
    min-height: 200px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .title {
      font-size: 25px;
      font-weight: 550;
      text-align: left;
      padding-top: 20px;
      padding-left: 90px;
      padding-right: 90px;
    }
    .article-message {
      margin-top: 15px;
      padding: 0 90px;
      span {
        margin-right: 18px;
      }
    }
    .author-info {
      padding: 0 90px;
      margin-top: 25px;
      margin-bottom: 20px;
      .author-image {
        float: left;
        width: 44px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: pointer;
      }
      .author-message {
        float: left;
        width: 300px;
        font-size: 15px;
        .author-fans {
          margin-right: 20px;
        }
        .author-name {
          cursor: pointer;
        }
      }
      .concern-btn {
        float: right;
        margin-top: 15px;
        .concern-button {
          color: white;
          background-color: var(--theme_search_input_blue_color);
          box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%),
            0 5px 15px 0 rgb(0 0 0 / 19%);
          border-radius: 6px;
          width: 160px;
          text-align: center;
          cursor: pointer;
          transition: all 0.5s;
        }
        .concern-button:hover {
          background-color: rgb(35, 109, 227);
          box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%),
            0 2px 10px 0 rgb(0 0 0 / 12%);
        }
      }
    }
    .author-info:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    .title-line {
      width: 90%;
      background-color: rgb(131, 130, 130);
      height: 1px;
      margin: 0 auto;
      transform: scaleY(0.7);
      margin-bottom: 20px;
    }
    .articleBody {
      width: 83%;
      margin: 0 auto;
      font-size: 17px;
      padding: 20px 13px;

      // transform: scale(0.7, 0.7);
    }
    .article-tag {
      width: 80.5%;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 30px;
      font-size: 13px;
      font-style: italic;
      span {
        margin-right: 10px;
        cursor: pointer;
        transition: all 0.3s;
      }
      span:hover {
        color: var(--theme_search_input_blue_color);
      }
    }

    .bottom-line {
      width: 90%;
      background-color: rgb(131, 130, 130);
      height: 1px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;

      transform: scaleY(0.7);
      margin-bottom: 30px;
    }

    .share-box {
      width: 190px;
      text-align: center;
      margin-left: 85px;
      float: left;
      .box-container {
        text-align: center;
        padding: 0;
        font-size: 15px;
        .share-box-item {
          display: inline;
          margin-left: 7px;
          transition: color 0.2s;
          cursor: pointer;
          i {
            font-size: 18px;
          }
        }
        .share-box-item:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }

    .article-advice {
      width: 150px;
      text-align: center;
      float: right;
      margin-right: 10px;
      cursor: pointer;
      font-size: 14px;
    }

    .articleBody :deep(img) {
      margin-left: 50%;
      transform: translateX(-50%);
      max-width: 90%;
    }
  }
  .article-container:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .comments-container {
    position: relative;
    transition: all 0.3s;
    width: 918px;
    min-height: 600px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
    .num {
      padding-left: 5%;
      padding-top: 20px;
      font-size: 18px;
    }
    .search-type {
      font-size: 14px;
      margin-bottom: 5px;
      ul {
        margin-top: 30px;
        margin-bottom: 0px;
        padding-left: 5%;
        li {
          display: inline-block;
          margin-right: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.5s;
        }
        .active {
          text-decoration: none;
          color: var(--theme_search_input_blue_color);
        }
        li:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }

    .active-line-one {
      width: 72px;
      height: 2px;
      background-color: var(--theme_search_input_blue_color);
      position: absolute;
      left: 5%;
      z-index: 1;
      display: inline-block;
    }

    .active-line-two {
      width: 72px;
      height: 2px;
      background-color: var(--theme_search_input_blue_color);
      position: absolute;
      left: 135px;
      z-index: 1;
      display: inline-block;
    }

    .line {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .comment-input-container {
      padding-left: 45px;
    }

    .no-comment-box {
      width: 200px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 80px;
    }

    .comments-body {
      margin-left: auto;
      margin-right: auto;
      width: 90%;
      margin-top: 30px;
      padding-bottom: 20px;
      .comment-item {
        overflow: hidden;
        margin-bottom: 5px;
        .user-avatar {
          margin-top: 10px;
          margin-right: 3%;
          float: left;
          img {
            width: 48px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .comment-content {
          float: left;
          width: 750px;
          .user-name {
            margin-bottom: 8px;
          }
          .comment-body {
            font-size: 18px;
            margin-bottom: 5px;
          }
          .comment-bottom {
            width: 100%;
            overflow: hidden;
            margin-bottom: 10px;

            .comment-date {
              float: left;
            }
            .reply {
              float: left;
              margin-left: 20px;
              cursor: pointer;
              transition: all 0.5s;
            }
            .reply:hover {
              color: var(--theme_search_input_blue_color);
            }
            .kudos {
              float: left;
              margin-left: 20px;
              cursor: pointer;
              i {
                transition: all 0.5s;
              }
              .my-dianzan-icon {
                color: var(--theme_search_input_blue_color);
              }
            }
            i:hover {
              color: var(--theme_search_input_blue_color);
            }
            .comment-edit {
              right: 50px;
              position: absolute;
              cursor: pointer;
              i {
                transition: color 0.5s;
              }
              i:hover {
                color: var(--theme_search_input_blue_color);
              }
              .to-edit-comment {
                display: none;
                z-index: 100;
                position: absolute;
                border-radius: 6px;
                right: -1px;
                top: 30px;
                width: 100px;
                height: 60px;
                color: #222;
                background-color: white;
                box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%),
                  0 2px 5px 0 rgb(0 0 0 / 19%);
                padding-top: 5px;
                span {
                  font-size: 14px;
                  width: 100%;
                  display: inline-block;
                  padding-left: 14px;
                }
                span:hover {
                  background-color: whitesmoke;
                  color: var(--theme_search_input_blue_color);
                }
              }
            }
          }
          .reply-item {
            max-width: 750px;
            margin-bottom: 15px;
            .reply-left {
              float: left;
              margin-right: 10px;
              img {
                width: 33px;
                border-radius: 50%;
                cursor: pointer;
              }
            }
            .reply-right {
              .reply-user-name {
                margin-right: 0.7rem;
              }
              .reply-to {
                cursor: pointer;
                margin-right: 1rem;
                color: var(--theme_search_input_blue_color);
              }
              .reply-item-bottom {
                width: 100%;
                overflow: hidden;
                margin-top: 5px;
                padding-left: 42px;
                .reply-date {
                  float: left;
                }
                .reply {
                  float: left;
                  margin-left: 20px;
                  cursor: pointer;
                  transition: all 0.5s;
                }
                .reply:hover {
                  color: var(--theme_search_input_blue_color);
                }
                .kudos {
                  float: left;
                  margin-left: 20px;
                  cursor: pointer;
                  i {
                    transition: all 0.5s;
                  }
                  .my-dianzan-icon {
                    color: var(--theme_search_input_blue_color);
                  }
                }
                .kudos:hover > i {
                  color: var(--theme_search_input_blue_color);
                }
                .reply-edit {
                  right: 50px;
                  position: absolute;
                  cursor: pointer;
                  i {
                    opacity: 0;
                    transition: all 0.5s;
                  }
                  i:hover {
                    color: var(--theme_search_input_blue_color);
                  }
                  .to-edit-reply {
                    display: none;
                    z-index: 100;
                    position: absolute;
                    border-radius: 6px;
                    right: -1px;
                    top: 30px;
                    width: 100px;
                    height: 60px;
                    color: #222;
                    background-color: white;
                    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%),
                      0 2px 5px 0 rgb(0 0 0 / 19%);
                    padding-top: 5px;
                    span {
                      font-size: 14px;
                      width: 100%;
                      display: inline-block;
                      padding-left: 14px;
                    }
                    span:hover {
                      background-color: whitesmoke;
                      color: var(--theme_search_input_blue_color);
                    }
                  }
                }
              }
            }
          }
          .reply-item:hover
            > .reply-right
            > .reply-item-bottom
            > .reply-edit
            > .my-edit-icon {
            opacity: 1;
          }
          #reply-input-container {
            width: 793px;
          }
        }
        .item-line {
          height: 1px;
          transform: scaleY(0.5);
          background-color: rgb(131, 130, 130);
          float: right;
          width: 91.3%;
          margin-top: 10px;
          margin-bottom: 20px;
        }
      }
    }
  }
  .side-toolbar {
    width: 50px;
    height: 280px;
    position: fixed;
    top: 490px;
    left: 1250px;
    transition: linear 0.5s;
    transition-property: top;
    .side-toolbar-directory {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      text-align: center;
      background-color: var(--theme_inner_bg_color);
      margin-bottom: 10px;
      height: 50px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      i {
        margin-top: 50%;
        transform: translateY(-50%);
        font-size: 22px;
      }
    }
    .side-toolbar-directory:hover {
      color: var(--theme_search_input_blue_color);
    }
    .side-toolbar-container {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      padding: 0;
      width: 100%;
      border-radius: 5px;
      overflow: hidden;

      .side-toolbar-item {
        width: 100%;
        height: 60px;
        background-color: var(--theme_inner_bg_color);
        text-align: center;
        padding-top: 15px;
        cursor: pointer;
        transition: all 0.3s;
        i {
          font-size: 22px;
          margin-top: 4px;
        }
        .my-star {
          font-size: 28px;
        }
      }
      .side-toolbar-item:hover {
        color: var(--theme_search_input_blue_color);
      }
    }
    .side-toolbar-toTop {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      opacity: 0;
      text-align: center;
      height: 50px;
      background-color: var(--theme_inner_bg_color);
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
      transition-property: opacity top;
      i {
        font-size: 22px;
        margin-top: 50%;
        transform: translateY(-50%);
      }
    }
    .side-toolbar-toTop:hover {
      color: var(--theme_search_input_blue_color);
    }
  }
  .my-dialog {
    .line {
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .inner-collection-container {
      overflow-y: auto;
      max-height: 490px;
      padding-right: 20px;
      .collection-item {
        margin-top: 10px;
        .data-title {
          transition: all 0.5s;
          height: 50px;
          font-weight: 600;
          .side-bar {
            width: 3px;
            height: 50px;
            float: left;
            background-color: rgb(13, 71, 161);
          }
          .title-content {
            float: left;
            height: 50px;
            line-height: 50px;
            margin-left: 10px;
          }
          .myIcon {
            font-size: 18px;
            display: block;
            margin-top: 17px;
            float: left;
            margin-left: 10px;
          }
          .collection-status {
            margin-top: 17px;
            float: right;
            margin-left: 10px;
            cursor: pointer;
            transition: color 0.3s;
          }
          .collection-status:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
    .inner-collection-container::-webkit-scrollbar {
      width: 3px;
    }
  }
}

.article-view :deep(.el-dialog) {
  width: 540px;
  position: absolute;
  left: 550px;
}
.article-view :deep(.el-dialog__body) {
  padding-top: 3px;
}
</style>