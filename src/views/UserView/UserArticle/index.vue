<template>
  <div class="user-article">
    <div v-for="(article, index) in articles" class="article-item">
      <div @click="showDetailArticle(article._id)">
        <div class="title">{{ article.title }}</div>
        <div class="description">
          {{ article.description }}
        </div>
      </div>
      <div class="message">
        <div class="publish-time">
          <i class="el-icon-time"></i>
          发布于 &nbsp {{ article.createdAt }}
        </div>
        <div class="message-item">
          <i class="el-icon-mouse"></i>
          123热度
        </div>
        <div class="message-item">
          <i class="el-icon-chat-dot-square"></i>
          123讨论
        </div>
        <div class="message-item">
          <i class="el-icon-star-off"></i>
          123收藏
        </div>
      </div>
      <div class="line"></div>
    </div>
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
    };
  },
  methods: {
    async getArticles() {
      try {
        const ret = await this.$API.article.getArticlesOfOneUser(this.userId);
        if (ret.code === 200) {
          ret.articles.forEach((item) => {
            item.createdAt = dayjs(item.createdAt).format("YYYY/MM/DD");
          });
          this.articles = ret.articles;
        }
      } catch (error) {}
    },
    showDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId,
        },
      });
    },
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
  },
  mounted() {
    this.getArticles();
  },
};
</script>

<style lang="less">
.user-article {
  .article-item {
    margin-top: 30px;
    .title {
      margin-bottom: 10px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
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
</style>