<template>
  <div class="comment-input">
    <div class="user-img">
      <img :src="userInfo.image" alt />
    </div>
    <el-input
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
      faceList: []
    };
  },
  props: ["articleId", "trendId"],
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
    async commitComment() {},
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
  },
  destroyed() {}
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