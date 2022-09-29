<template>
  <div class="article-view">
    <div class="article-container">
      <div class="title">{{detailArticle.title}}</div>
      <div class="articleBody" v-html="detailArticle.body" ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailArticle",
  data() {
    return {
      detailArticle: "",
    };
  },
  methods: {
    async getDetailArticle() {
      const ret = await this.$API.article.getDetailArticle(
        this.$route.params.articleId
      );
      if(ret.code===200){
        this.detailArticle=ret.data
      }
    },
  },
  mounted() {
    this.getDetailArticle();
  },
};
</script>

<style lang="less" scoped >
.article-view {
  transition: all 0.5s;
  width: 100%;
  position: absolute;
  background-color: var(--theme_outer_bg_color);
  .article-container {
    transition: all 0.5s;
    width: 60%;
    height: 800px;
    margin: 100px auto;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .title {
      font-size: 30px;
      font-weight: 550;
      text-align: center;
      padding-top: 20px;
      margin-bottom: 20px;
    }
    .articleBody {
      font-size: 20px;
      padding: 0 20px;
      transform: scale(0.8,0.8);
    }
  }
}
</style>