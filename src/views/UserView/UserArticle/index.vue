<template>
  <div>
    <div class="user-article">
      <div v-for="(article, index) in articles" :key="article._id" class="article-item">
        <div @click="showDetailArticle(article._id)">
          <div class="title">{{ article.title }}</div>
          <div v-if="isLoginUser" class="article-edit">
            <el-button type="primary" size="mini" @click.stop="editArticle(article._id)">编辑</el-button>
            <el-button type="danger" size="mini" @click.stop="toDeleteArticle(article._id)">删除</el-button>
          </div>
          <div class="description">{{ article.description }}</div>
        </div>
        <div class="message">
          <div class="publish-time">
            <i class="el-icon-time"></i>
            发布于 &nbsp; {{ $dayjs(article.createdAt).format("YYYY/MM/DD") }}
          </div>
          <div class="message-item">
            <i class="iconfont icon-dianji"></i>
            {{ article.clicksCount }}热度
          </div>
          <div class="message-item">
            <i class="iconfont icon-taolun"></i>
            {{ article.commentsCount }}讨论
          </div>
          <div class="message-item">
            <i class="iconfont icon-dianzan"></i>
            {{ article.favoritesCount }}点赞
          </div>
        </div>
        <div class="line"></div>
      </div>
      <div v-if="hasNoArticle" class="no-article-message">还没有发布过文章~</div>
    </div>
    <el-dialog title="温馨提示" :show-close="false" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>你确定要删除嘛?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="deleteOneArticle()">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export default {
  name: "UserArticle",
  data() {
    return {
      articles: "",
      dialogVisible: false,
      hasNoArticle: false,
      toDeleteArticleId: null
    };
  },
  watch: {
    $route(to, from) {
      if (this.$route.params.userId) {
        this.getArticles();
      }
    }
  },
  methods: {
    //获取文章
    async getArticles() {
      const ret = await this.$API.article.getArticlesOfOneUser(this.userId);
      if (ret.code === 200) {
        this.articles = ret.articles;
        if (ret.articles.length === 0) {
          this.hasNoArticle = true;
        }
      }
    },
    showDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    //编辑文章
    editArticle(articleId) {
      this.$router.push({
        name: "editArticle",
        params: {
          articleId
        }
      });
    },
    toDeleteArticle(articleId) {
      this.dialogVisible = true;
      this.toDeleteArticleId = articleId
    },
    handleClose(done) {
      done();
    },
    //删除文章
    async deleteOneArticle() {
      const ret = await this.$API.article.deleteArticle(this.toDeleteArticleId);
      if (ret.code === 200) {
        this.getArticles();
        this.$message({
          type: "success",
          message: "删除成功"
        });
      }
      this.dialogVisible = false;
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    }
  },
  mounted() {
    this.getArticles();
  }
};
</script>

<style lang="less" scoped>
.user-article {
  .article-item {
    margin-top: 30px;
    position: relative;

    .title {
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
    }

    .article-edit {
      position: absolute;
      right: 0;
      top: 0px;
    }

    .description {
      margin-bottom: 10px;
      cursor: pointer;
    }

    .message {
      margin-bottom: 30px;

      .publish-time {
        display: inline-block;
      }

      .message-item {
        float: right;
        margin-left: 20px;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
  }
}

.no-article-message {
  font-size: 18px;
}
</style>