<template>
  <div class="comment-input">
    <div class="user-img">
      <img :src="$myBaseUrl+userInfo.image" alt />
    </div>
    <el-input
      ref="replyTextarea"
      type="textarea"
      resize="none"
      maxlength="120"
      show-word-limit
      :rows="3"
      placeholder="请输入你的留言"
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
    <el-button class="submit-button" @click="commitComment" slot="reference">发表评论</el-button>
  </div>
</template>

<script>
import appData from "@/assets/emojis/emojis.json";
export default {
  name: "CommentInput",
  data() {
    return {
      textarea: "",
      faceList: [],
      trendId: null,
      articleId: null,
      toReplyId: null,
      toCommentId: null,
      toReplyOnwId: null
    };
  },
  // props: ["articleId", "trendId"],
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
    //提交评论
    async commitComment() {
      if (this.$store.state.user.userInfo.status === 1) {
        this.textarea = null
        return this.$message({
          message: "你已被禁言十天，到期后自动解除",
          type: "error"
        });
      }
      //发表动态回复
      if (!this.trendId) {
        //回复文章评论
        if (this.textarea) {
          const reply = {};
          reply.user = this.userInfo._id;
          reply.article = this.articleId;
          reply.body = this.textarea;
          reply.comment = this.toCommentId;
          if (this.toReplyId && this.toReplyOnwId) {
            reply.toReply = this.toReplyId;
            reply.toReplyId = this.toReplyOnwId;
          }
          const ret = await this.$API.comment.createReply(reply);
          if (ret.code === 200) {
            this.textarea = "";
            this.$message({
              type: "success",
              message: "回复成功！"
            });
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
        //回复动态评论
        if (this.textarea) {
          const reply = {};
          reply.user = this.userInfo._id;
          reply.trend = this.trendId;
          reply.body = this.textarea;
          reply.trendComment = this.toCommentId;
          if (this.toReplyId && this.toReplyOnwId) {
            reply.toReply = this.toReplyId;
            reply.toReplyId = this.toReplyOnwId;
          }
          const ret = await this.$API.trend.createTrendReply(reply);
          if (ret.code === 200) {
            this.textarea = "";
            this.$message({
              type: "success",
              message: "回复成功！"
            });
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
    this.$bus.$off("reply");
    this.$bus.$off("myFocus");
  },
  mounted() {
    this.$bus.$on("myFocus", (articleId, commentId, replyId, toReplyId) => {
      this.toCommentId = commentId;
      this.toReplyId = replyId;
      this.articleId = articleId;
      this.toReplyOnwId = toReplyId;
      this.$nextTick(() => {
        this.$refs.replyTextarea.focus();
      });
    });
    this.$bus.$on("reply", (trendId, commentId, replyId, toReplyId) => {
      this.toCommentId = commentId;
      this.toReplyId = replyId;
      this.trendId = trendId;
      this.toReplyOnwId = toReplyId;
      this.$nextTick(() => {
        this.$refs.replyTextarea.focus();
      });
    });
  },
  destroyed() {
    this.$bus.$off("reply");
    this.$bus.$off("myFocus");
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
.comment-input {
  margin-top: 30px;
  margin-bottom: 10px;

  .user-img {
    float: left;
    margin-top: 12px;
    margin-right: 9px;
    img {
      width: 48px;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  &:deep(.el-button) {
    padding: 9px 8px;
  }
  &:deep(.el-textarea) {
    width: 93.5%;
  }
  &:deep(.emojis-button) {
    position: relative;
    left: 57px;
    top: 2px;
  }
  &:deep(.submit-button) {
    position: relative;
    left: 746px;
    top: 1.5px;
    height: 36px;
    border: none;
    color: white;
    background-color: rgb(35, 109, 227);
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  }
  &:deep(.submit-button:hover) {
    background-color: var(--theme_search_input_blue_color);
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
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