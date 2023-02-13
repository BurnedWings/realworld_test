<template>
  <div>
    <div ref="dialogContainer" class="my-dialog-container"></div>
    <div v-for="(article, index) in trendArticle" :key="article._id" class="trend-item">
      <div class="item-line"></div>
      <div class="trend-item-top">
        <img @click="toDetailUserView(article.author._id)" :src="$myBaseUrl + article.author.image" alt />
        <div @click="toDetailUserView(article.author._id)" class="username">{{ article.author.username }}</div>
        <div class="updateDate">{{ $dayjs(article.createdAt).format("YYYY/MM/DD") }}&nbsp;更新</div>
        <i @click="toEditComment(index)" class="my-edit-icon el-icon-more"></i>
        <div @mouseleave="closeBox(index)" ref="editBox" class="to-edit-comment">
          <span @click="toReportTheArticle(article._id, article.author._id)">举报</span>
        </div>
      </div>
      <div @click="showDetailArticle(article._id)" class="trend-tem-content">
        <div v-if="article.cover" class="article-cover">
          <img :src="$myBaseUrl + article.cover" alt />
        </div>
        <span class="article-title">{{ article.title }}</span>&nbsp;:
        <span v-html="article.body" class="article-body"></span>
      </div>
      <!-- <div class="message-line" ></div> -->
      <div class="article-message">
        <div class="article-message-item">
          <i class="iconfont icon-dianji"></i>
          {{ article.clicksCount }}热度
        </div>
        <div @click="showComment(index, article._id)" class="article-message-item">
          <i class="iconfont icon-taolun"></i>
          {{ article.commentsCount }}讨论
        </div>
        <div @click="kudos(article._id, article.author._id)" class="article-message-item">
          <i class="iconfont icon-dianzan"></i>
          <!-- el-icon-star-off -->
          {{ article.favoritesCount }}点赞
        </div>
      </div>
      <div class="article-tag">
        <div v-for="(tag, index) in article.tagList" class="article-tag-item">#{{ tag }}</div>
      </div>
      <!-- 评论 -->
      <div :class="'my-comment-container' + index"></div>
    </div>
    <el-divider v-if="!trendArticle" content-position="center">你还没有关注其他用户</el-divider>
    <el-dialog title="请编辑举报理由" :visible.sync="dialogVisible" width="29%" :before-close="handleClose"
      close="my-return-box" :modal="false">
      <span style="margin-right:95px;">请选择违规类型</span>
      <el-select clearable v-model="reportValue" placeholder="请选择">
        <el-option v-for="item in reportType" :key="item._id" :label="item.content" :value="item._id"></el-option>
      </el-select>
      <el-input style="width:98.2%;margin-top:20px;" type="textarea" :rows="6" resize="none" maxlength="160"
        show-word-limit placeholder="请输入具体描述" v-model="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeReportBox">取 消</el-button>
        <el-button style="margin-right:6px;" type="danger" @click="reportTheArticle">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store/index";
import router from '@/router';
import Comment from "@/components/Comment";
export default {
  name: "TrendArticle",
  computed: {
    reportType() {
      return this.$store.state.user.reportType;
    },
    concernNum() {
      return this.$store.state.user.userInfo.concernsCount;
    }
  },
  data() {
    return {
      commentAreaIndex: null,
      trendArticle: null,
      oldBoxIndex: null,
      dialogVisible: false,
      textarea: "",
      reportValue: null,
      targetArticle: null,
      targetOfUser: null
    };
  },
  methods: {
    toDetailUserView(userId) {
      this.$router.push({
        name: "userView",
        params: {
          userId
        }
      });
    },
    closeReportBox() {
      this.$refs.dialogContainer.classList.remove("my-dialog-background");
      this.dialogVisible = false;
    },
    async reportTheArticle() {
      if (!this.reportValue) {
        return this.$message({
          type: "warning",
          message: "你还没有选择违规类型"
        });
      }
      if (this.textarea.trim() === "") {
        return this.$message({
          type: "warning",
          message: "你还没有填写具体描述"
        });
      }
      const report = {};
      report.type = this.reportValue;
      report.message = this.textarea.trim();
      report.article = this.targetArticle;
      report.ofUser = this.targetOfUser;
      const ret = await this.$API.report.reportTheArticle(report);
      if (ret.code === 200) {
        this.reportValue = null;
        this.dialogVisible = false;
        this.targetArticle = null;
        this.targetOfUser = null;
        this.textarea = "";
        this.$refs.dialogContainer.classList.remove("my-dialog-background");
        this.$message({
          type: "success",
          message: "举报成功~"
        });
      }
    },
    handleClose() {
      this.$refs.dialogContainer.classList.remove("my-dialog-background");
      this.dialogVisible = false;
      this.textarea = "";
      this.targetArticle = null;
      this.targetOfUser = null;
    },
    //打开举报框
    toReportTheArticle(article, ofUser) {
      this.targetOfUser = ofUser;
      this.targetArticle = article;
      this.$refs.dialogContainer.classList.add("my-dialog-background");
      this.dialogVisible = true;
    },
    //点赞
    async kudos(articleId, authorId) {
      if (this.$store.state.user.userId) {
        const ret = await this.$API.article.kudos({
          article: articleId,
          user: this.$store.state.user.userId,
          ofUser: authorId
        });
        if (ret.code === 200) {
          this.getTrendArticle();
        }
      } else {
        this.$router.push("/login");
      }
    },
    //文章详情
    showDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    showComment(index, articleId) {
      if (this.commentAreaIndex === index) {
        const oldCommentArea = document.querySelector(
          `.my-comment-container${this.commentAreaIndex}`
        );
        oldCommentArea.removeChild(oldCommentArea.firstChild);
        this.commentAreaIndex = null
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
          const CommentComponent = Vue.extend(Comment);
          new CommentComponent({ store, router }).$mount(".test");
          this.commentAreaIndex = index;
          const commentDiv = document.querySelector(
            `.my-comment-container${index}`
          );
          window.scrollTo(0, commentDiv.offsetTop - 100);
        });
        setTimeout(() => {
          this.$bus.$emit("showComment", articleId);
        }, 50);
      }
    },
    //获取文章列表
    async getTrendArticle() {
      const ret = await this.$API.trend.getTrendArticle();
      if (ret.code === 200) {
        console.log(ret.articleList)
        for (const key in ret.articleList) {
          ret.articleList[key].body = ret.articleList[key].body.replaceAll(
            "http://localhost:3000/",
            this.$myBaseUrl
          )
        }
        this.trendArticle = ret.articleList;
      } else if (ret.code === 202) {
        this.hasNoArticle = true;
      }
    },
    //打开悬浮框
    toEditComment(index) {
      if (this.oldBoxIndex != null) {
        this.$refs.editBox[this.oldBoxIndex].style.display = "none";
      }
      this.$refs.editBox[index].style.display = "block";
      this.oldBoxIndex = index;
    },
    //关闭悬浮框
    closeBox(index) {
      this.$refs.editBox[index].style.display = "none";
    }
  },
  mounted() {
    if (this.concernNum > 0) {
      this.getTrendArticle();
    }

  }
};
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
}

.my-dialog-container {
  transition: all 0.2s;
}

.my-dialog-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
  z-index: 2000;
}

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

.trend-item {
  width: 100%;
  padding-top: 5px;
  padding-bottom: 5px;

  // background-color: red;
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
      cursor: pointer;
    }

    .username {
      position: absolute;
      top: 10px;
      margin-left: 10px;
      display: inline-block;
      cursor: pointer;
    }

    .updateDate {
      position: absolute;
      top: 33px;
      left: 73px;
      font-size: 14px;
      display: inline-block;
      cursor: default;
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
      right: 22px;
      top: 40px;
      width: 80px;
      height: 30px;
      color: #222;
      background-color: white;
      box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
      padding-top: 4px;
      padding-left: 11px;
      cursor: pointer;

      span {
        font-size: 14px;
        width: 80px;
        display: inline-block;
        padding-left: 14px;
        color: #000000c3;
        font-weight: 600;
      }

      span:hover {
        color: var(--theme_search_input_blue_color);
      }
    }
  }

  .trend-tem-content {
    max-height: 149px;
    margin-top: 10px;
    padding-left: 72px;
    padding-right: 20px;
    padding-bottom: 10px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    display: -webkit-box;
    cursor: pointer;

    .article-title {
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 5px;
      // display: block;
    }

    .article-cover {
      max-width: 205px;
      height: 140px;
      float: left;
      overflow: hidden;
      margin-right: 8px;

      img {
        height: 100%;
      }
    }

    .article-body {
      // display: block;
      line-height: 10px;
    }

    .article-body :deep(img) {
      width: 0;
      height: 0;
    }

    .article-body :deep(p) {
      // font-size: 16px;
      display: inline;
      letter-spacing: 0.5px;
    }

    .article-body :deep(*) {
      font-size: 1rem;
    }

    .article-body :deep(p:has(img)) {
      display: none !important;
    }
  }

  .article-message {
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

    .article-message-item {
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

    .article-message-item:hover {
      color: var(--theme_search_input_blue_color);
    }
  }

  .article-tag {
    width: 300px;
    margin-top: 22px;
    padding-right: 30px;
    float: right;

    &:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    .article-tag-item {
      float: right;
      font-size: 13px;
      margin-left: 20px;
      margin-bottom: 5px;
      font-style: italic;
      cursor: pointer;
      transition: color 0.2s;
    }

    .article-tag-item:hover {
      color: var(--theme_search_input_blue_color);
    }
  }

  // .message-line {
  //   margin-top: 10px;
  //   width: 93.5%;
  //   margin-left: 20px;
  //   height: 1px;
  //   transform: scaleY(0.5);
  //   background-color: rgb(131, 130, 130);
  // }
}
</style>