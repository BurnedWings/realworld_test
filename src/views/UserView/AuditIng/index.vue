<template>
  <div>
    <div class="user-article">
      <div v-for="(article, index) in articles" :key="article._id" class="article-item">
        <div @click="showDetailArticle(article._id,article.isAudit,article.status)">
          <div
            class="title"
          >{{ article.title }}{{!article.isAudit?'(审核中)':''}}{{article.status===1?'(已退回)':''}}</div>
          <div v-if="isLoginUser" class="article-edit">
            <el-button type="primary" size="mini" @click.stop="editArticle(article._id)">编辑</el-button>
            <el-button type="danger" size="mini" @click.stop="toDeleteArticle">删除</el-button>
          </div>
          <div class="description">{{ article.description }}</div>
        </div>
        <div class="message">
          <div class="publish-time">
            <i class="el-icon-time"></i>
            发布于 &nbsp; {{$dayjs(article.createdAt).format("YYYY/MM/DD") }}
          </div>
          <div class="message-item">
            <i class="iconfont icon-dianji"></i>
            {{article.clicksCount}}热度
          </div>
          <div class="message-item">
            <i class="iconfont icon-taolun"></i>
            {{article.commentsCount}}讨论
          </div>
          <div class="message-item">
            <i class="iconfont icon-dianzan"></i>
            {{article.favoritesCount}}点赞
          </div>
        </div>
        <div class="line"></div>
        <el-dialog
          title="温馨提示"
          :modal="false"
          :show-close="false"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <span>你确定要删除嘛?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="deleteOneArticle(article._id)">删 除</el-button>
          </span>
        </el-dialog>
      </div>
      <div v-if="hasNoArticle" class="no-article-message">没有待审核的文章~</div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export default {
  name: "Auditing",
  data() {
    return {
      articles: "",
      dialogVisible: false,
      hasNoArticle: false
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
    async getArticles() {
      try {
        const ret = await this.$API.article.getNotAuditAndBackArticle(
          this.userId
        );
        if (ret.code === 200) {
          this.articles = ret.articles;
          if (ret.articles.length === 0) {
            this.hasNoArticle = true;
          }
        }
      } catch (error) {}
    },
    showDetailArticle(articleId, isAudit, status) {
      if (isAudit&&status===0) {
        this.$router.push({
          name: "detailArticle",
          params: {
            articleId
          }
        });
      } else if (status === 1) {
        this.$message({
          type: "error",
          message: "该文章已被退回锁定"
        });
      } else {
        this.$message({
          type: "error",
          message: "该文章还没有通过审核"
        });
      }
    },
    editArticle(articleId) {
      this.$router.push({
        name: "editArticle",
        params: {
          articleId,
          isNotAudit:true
        }
      });
    },
    toDeleteArticle() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      done();
    },
    async deleteOneArticle(articleId) {
      this.dialogVisible = false;
      const ret = await this.$API.article.deleteArticle(articleId);
      if (ret.code === 200) {
        this.getArticles();
        this.$message({
          type: "success",
          message: "删除成功"
        });
      }
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