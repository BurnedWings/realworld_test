<template>
  <div class="comment-input">
    <div class="user-img">
      <img @click="toDetailUserView" :src="$myBaseUrl+userInfo.image" alt />
    </div>
    <el-input
      ref="replyTextarea"
      type="textarea"
      resize="none"
      maxlength="120"
      show-word-limit
      :rows="3"
      :placeholder="'@'+toUser.username"
      v-model="textarea"
    ></el-input>
    <el-popover popper-class="comment-popover" placement="bottom-start" width="400" trigger="click">
      <el-button class="emojis-button" slot="reference">
        <span class="iconfont icon-face"></span>
        表情
      </el-button>
      <div class="my-emojis-box">
        <ul>
          <li v-for="(item, index) in faceList" :key="index" @click="getBrow(index)">{{ item }}</li>
        </ul>
      </div>
    </el-popover>
    <el-button class="submit-button" @click="commitReply" slot="reference">发表评论</el-button>
  </div>
</template>

<script>
import appData from "@/assets/emojis/emojis.json";
export default {
  name: "InputInput",
  data() {
    return {
      textarea: "",
      faceList: [],
      toReplyId: null,
      toCommentId: "",
      toUser: "",
      articleId: "",
      trendId: null,
      toReplyOwnId:null
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
    toDetailUserView(){
      this.$router.push({
        name: "userView",
        params: {
          userId:this.userInfo._id
        }
      });
    },
    loadEmojis() {
      for (let i in appData) {
        this.faceList.push(appData[i].char);
      }
    },
    //提交评论
    async commitReply() {
      if (this.$store.state.user.userInfo.status === 1) {
        this.textarea = ''
        return this.$message({
          message: "你已被禁言十天，到期后自动解除",
          type: "error"
        });
      }
      if (this.userInfo._id) {
        if (!this.trendId) {
          if (this.textarea) {
            const reply = {};
            reply.user = this.userInfo._id;
            reply.article = this.articleId;
            reply.body = this.textarea;
            reply.comment = this.toCommentId;
            if (this.toReplyId) {
              reply.toReply = this.toReplyId;
              reply.toReplyId = this.toReplyOwnId
              
            }
            const ret = await this.$API.comment.createReply(reply);
            if (ret.code === 200) {
              this.textarea = "";
              this.$bus.$emit("refComments");
            } else {
              this.$message({
                type: "error",
                message: "发送失败!"
              });
            }
          } else {
            this.$message({
              type: "info",
              message: "你还没有评论!"
            });
          }
        } else {
          //发表动态回复
          if (this.textarea) {
            const reply = {};
            reply.user = this.userInfo._id;
            reply.trend = this.trendId;
            reply.body = this.textarea;
            reply.trendComment = this.toCommentId;
            if (this.toReplyId) {
              reply.toReply = this.toReplyId;
              reply.toReplyId = this.toReplyOwnId
            }
            const ret = await this.$API.trend.createTrendReply(reply);
            if (ret.code === 200) {
              this.textarea = "";
              this.$bus.$emit("refComments");
            } else {
              this.$message({
                type: "error",
                message: "发送失败!"
              });
            }
          } else {
            this.$message({
              type: "info",
              message: "你还没有评论!"
            });
          }
        }
      } else {
        this.$router.push("/login");
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
    }
  },
  created() {
    this.loadEmojis();
    this.$bus.$off("myFocus");
    this.$bus.$off("trendReply");
  },
  mounted() {
    this.$bus.$on("myFocus", (user, articleId, commentId, replyId,toReplyId) => {
      this.toCommentId = commentId;
      this.toReplyId = replyId;
      this.articleId = articleId;
      this.toUser = user;
      this.toReplyOwnId = toReplyId
      this.$nextTick(() => {
        this.$refs.replyTextarea.focus();
      });
    });
    this.$bus.$on("trendReply", (user, trendId, commentId, replyId,toReplyId) => {
      this.toCommentId = commentId;
      this.toReplyId = replyId;
      this.trendId = trendId;
      this.toUser = user;
      this.toReplyOwnId = toReplyId
      this.$nextTick(() => {
        this.$refs.replyTextarea.focus();
      });
    });
  },
  beforeDestroy() {
    this.$bus.$off("myFocus");
    this.$bus.$off("trendReply");
  }
};
</script>

<style lang="less" scoped>
:deep(.el-textarea__inner::placeholder) {
  color: var(--theme_search_input_blue_color);
}
.comment-input {
  margin-top: 30px;
  margin-bottom: 10px;

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