<template>
  <div class="container-of-comment">
    <div class="comment-top-container">
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
        <CommentInput :trendId="trendId" ></CommentInput>
      </div>
      <div v-if="commentCount===0" class="no-comment-box">没有更多评论</div>
    </div>
    <div ref="commentsBody" class="comments-body">
      <div v-for="(comment,myIndex) in commentsList" :key="comment._id" class="comment-item">
        <div class="item-body">
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
              <div
                class="reply"
                @click="showReplyInput(myIndex,comment.user,null,comment._id,comment.trend)"
              >回复</div>
              <div class="comment-edit">
                <el-popconfirm
                  v-if="userId===comment.user._id"
                  title="你确定要删除评论嘛?"
                  @confirm="deleteOwnComment(comment._id)"
                >
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
                <i v-else @click="toEditComment(myIndex)" class="el-icon-more"></i>
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
                    @click="showReplyInput(myIndex,reply.user,reply.user._id,comment._id,comment.trend)"
                    class="reply"
                  >回复</div>
                  <div class="reply-edit">
                    <el-popconfirm
                      title="你确定要删除评论嘛?"
                      class="edit-container"
                      @confirm="deleteOwnReply(reply._id)"
                    >
                      <i
                        slot="reference"
                        v-if="userId===reply.user._id"
                        class="my-edit-icon el-icon-delete"
                      ></i>
                    </el-popconfirm>
                    <i
                      v-if="userId!=reply.user._id"
                      @click="toEditReply(myIndex,index)"
                      class="my-edit-icon el-icon-more"
                    ></i>
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
      </div>
      <!-- <ReplyInput v-if="isReplyInputShow" ref="ReplyInput" :toUser="toUser" :articleId="detailArticle._id" @refComments="getComments" ></ReplyInput>-->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import CommentInput from "@/components/CommentInput";
import ReplyInput from "@/components/ReplyInput";
import store from "@/store/index";
export default {
  name: "TrendComment",
  data() {
    return {
      inputAreaIndex: null,
      commentStatusArr: null,
      commentCount: null,
      commentsList: null,
      targetTrend: null,
    };
  },
  props: ["detailTrend"],
  components: {
    CommentInput
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    },
    trendId() {
      if(this.detailTrend){
        return this.detailTrend
      }else{
        return this.targetTrend
      }
    }
  },
  methods: {
    //显示回复输入框
    showReplyInput(index, user, replyId, commentId, trendId) {
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
        this.$bus.$emit("trendReply", user, trendId, commentId, replyId);
      }, 50);
    },
    //回复点赞
    async kudosTheReply(replyId, ofUserId) {
      if (!this.trendId) {
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
      } else {
        if (this.$store.state.user.userId) {
          const replyKudos = {};
          replyKudos.trendReply = replyId;
          replyKudos.ofUser = ofUserId;
          const ret = await this.$API.trend.replyKudos(replyKudos);
          if (ret.code === 200) {
            this.getComments();
          }
        } else {
          this.$router.push("/login");
        }
      }
    },
    //评论点赞
    async kudosTheComment(commentId, ofUserId) {
      if (!this.trendId) {
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
      } else {
        if (this.$store.state.user.userId) {
          const commentKudos = {};
          commentKudos.trendComment = commentId;
          commentKudos.ofUser = ofUserId;
          const ret = await this.$API.trend.commentKudos(commentKudos);
          if (ret.code === 200) {
            this.getComments();
          }
        } else {
          this.$router.push("/login");
        }
      }
    },
    //删除评论
    async deleteOwnComment(commentId) {
      if (this.detailTrend) {
        const ret = await this.$API.trend.deleteComment(
          commentId,
          this.detailTrend
        );
        if (ret.code === 200) {
          this.getComments();
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.inputAreaIndex = null;
        }
      } else if (this.targetTrend) {
        const ret = await this.$API.trend.deleteComment(
          commentId,
          this.targetTrend
        );
        if (ret.code === 200) {
          this.getComments();
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.inputAreaIndex = null;
        }
      }
    },
    closeBox(index) {
      this.$refs.editBox[index].style.display = "none";
    },
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
    //删除回复
    async deleteOwnReply(replyId) {
      const ret = await this.$API.trend.deleteReply(replyId);
        if (ret.code === 200) {
          this.getComments();
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
    },
    //获取评论
    async getComments(trendId) {
      if(this.detailTrend){
        const ret = await this.$API.trend.getCommentList(
        this.$route.params.trendId
      );
      if (ret.code === 200) {
        this.commentCount = ret.totalNum;
        this.commentsList = ret.comments;
        if (ret.status) {
          this.commentStatusArr = ret.status;
        }
      }
      }else if(this.targetTrend){
        const ret = await this.$API.trend.getCommentList(
        this.targetTrend
      );
      if (ret.code === 200) {
        this.commentCount = ret.totalNum;
        this.commentsList = ret.comments;
        if (ret.status) {
          this.commentStatusArr = ret.status;
        }
      }
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
    }
  },
  created(){
    this.$bus.$off("showComment");
    this.$bus.$off("refComments");
  },
  mounted() {
    if (this.detailTrend) {
      this.getComments();
    }
    
    this.$bus.$on("showComment", trendId => {
      this.targetTrend = trendId;
      this.getComments();
    });
    this.$bus.$on("refComments", () => {
      this.getComments();
    });
  }
};
</script>

<style lang='less' scoped>
:deep(.el-textarea__inner::placeholder) {
  color: var(--theme_search_input_blue_color);
}
:deep(.submit-button) {
  transition: all 0.3s;
  padding: 1px;
  color: white;
  height: 30px;
  width: 70px;
  float: right;
  margin-top: 8px;
  margin-bottom: 7px;
  margin-right: 5px;
  border: none;
  background-color: var(--theme_search_input_blue_color);
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
}
:deep(.submit-button:hover) {
  background-color: rgb(35, 109, 227);
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
}
.container-of-comment {
  position: relative;
  .comment-top-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;
    & :deep(.el-textarea) {
      width: 580px;
    }
    .search-type {
      font-size: 14px;
      ul {
        margin-top: 30px;
        margin-bottom: 0px;
        padding-left: 30px;
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
      left: 30px;
      z-index: 1;
      display: inline-block;
    }

    .active-line-two {
      width: 72px;
      height: 2px;
      background-color: var(--theme_search_input_blue_color);
      position: absolute;
      left: 119px;
      z-index: 1;
      display: inline-block;
    }

    .line {
      width: 93%;
      margin-left: 29px;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .comment-input-container {
      padding-left: 45px;
      .comment-input {
        & :deep(.emojis-button) {
          margin-left: 56px;
          height: 32px;
          margin-top: 8px;
          width: 65px;
          padding: 1px;
        }
        & :deep(.submit-button) {
          margin-right: 22px;
        }
      }
    }
  }

  .no-comment-box {
    width: 200px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
  }
  .comments-body {
    //   display: none;
    width: 100%;
    margin-top: 30px;
    padding-bottom: 20px;
    margin-left: 1px;
    .comment-item {
      // overflow: hidden;
      margin-bottom: 5px;
      width: 100%;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }

      .item-body {
        width: 87%;
        margin-left: 70px;
        position: relative;
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
          float: right;
          width: 100%;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .user-avatar {
          margin-top: 2px;
          margin-left: 2px;
          margin-right: 8px;
          float: left;
          img {
            width: 48px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .comment-content {
          float: left;
          width: 90%;
          .user-name {
            margin-bottom: 8px;
            margin-left: 5px;
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
              right: 2px;
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
                  right: 2px;
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
          // .reply-item:hover
          //   > .reply-right
          //   > .reply-item-bottom
          //   > .reply-edit
          //   > .my-edit-icon {
          //   opacity: 1;
          // }
          .reply-item:hover :deep(.my-edit-icon) {
            opacity: 1 !important;
          }

          #reply-input-container {
            width: 600px;
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
            & :deep(.submit-button) {
              margin-right: 47px;
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
    }
  }
}
</style>