<template>
  <div class="comment-input">
    <div class="user-img">
      <img :src="userInfo.image" alt />
    </div>
    <el-input type="textarea" resize="none" :rows="3" placeholder="请输入你的留言" v-model="textarea"></el-input>
    <el-popover popper-class="comment-popover" placement="bottom-start" width="400" trigger="click">
      <el-button class="emojis-button" slot="reference">
        <span class="iconfont icon-face"></span>
        表情
      </el-button>
      <div  class="my-emojis-box">
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
  data(){
    return {
        textarea: "",
        faceList: [],
    }
  },
  props:["articleId"],
  computed:{
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods:{
    loadEmojis() {
      for (let i in appData) {
        this.faceList.push(appData[i].char);
      }
    },
    //提交评论
    async commitComment() {
      if (this.userInfo._id) {
        if (this.textarea) {
          const comment = {};
          comment.user = this.userInfo._id;
          comment.article = this.articleId;
          comment.body = this.textarea;
          const ret = await this.$API.comment.createComment(comment);
          if (ret.code === 200) {
            this.textarea = "";
            this.$emit("refComments")
          }
        } else {
          this.$message({
            type: "info",
            message: "你还没有评论!"
          });
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
    },
  },
  created(){
    this.loadEmojis()
  },
  destroyed(){
  }
};
</script>

<style lang="less" scoped>
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