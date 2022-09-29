<template>
  <!-- 主体部分 -->
  <div class="main">
    <div class="container">
      <div class="row" style="overflow: hidden">
        <div class="container-title">首页文章列表</div>
        <div class="col-12 col-md-10 m-auto">
          <div
            class="row mx-auto index-card my-card"
            v-for="(article, index) in articleList"
          >
            <img class="my-card-img" @click="toUserView(article.author._id)" :src="article.author.image" alt="" />
            <div class="article-author" @click="toUserView(article.author._id)" >{{ article.author.username }}</div>
            <div class="publish-time">
              <i class="el-icon-time"></i>
              发布于 &nbsp {{ article.createdAt }}
            </div>
            <div  @click="showDetailArticle(article._id)">
              <div class="article-title">{{ article.title }}</div>
              <div class="article-description">
                {{ article.description }}
              </div>
            </div>
            <div class="article-message">
              <div class="article-message-item">
                <i class="el-icon-mouse"></i>
                123热度
              </div>
              <div class="article-message-item">
                <i class="el-icon-chat-dot-square"></i>
                123讨论
              </div>
              <div class="article-message-item">
                <i class="el-icon-star-off"></i>
                123收藏
              </div>
            </div>
            <div class="article-tag">
              <div
                v-for="(tag, index) in article.tagList"
                class="article-tag-item badge bg-light text-dark"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export default {
  name: "Home",
  data() {
    return {
      articleList: [],
    };
  },
  methods: {
    showDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId,
          
        },
      });
    },
    async getArticleList() {
      const ret = await this.$API.article.getArticleList();
      if (ret.code === 200) {
        ret.data.forEach((item) => {
          item.createdAt = dayjs(item.createdAt).format("YYYY/MM/DD");
        });
        this.articleList = ret.data;
      }
    },
    toUserView(userId){
      this.$router.push({
        name:'userView',
        params:{
          userId
        }
      });
    }
  },
  mounted() {
    this.getArticleList();
  },
};
</script>

<style lang="less" scoped >
//主体
.main {
  width: 100%;
  height: 100%;
  background-color: var(--theme_outer_bg_color);
  overflow: hidden;
  transition: all 0.5s;
  .container {
    transition: all 0.5s;
    width: 60%;
    background-color: var(--theme_inner_bg_color);
    margin-top: 90px;
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    margin-bottom: 20px;
    .container-title {
      font-weight: 800;
      margin: 20px 30px;
      font-size: 20px;
    }

    .my-card {
      border-top: rgb(131, 130, 130) 1px solid;
      border-style: dashed none none none;
      padding: 20px 0;
      position: relative;
      

      .my-card-img {
        width: 65px;
        height: 41px;
        border-radius: 50%;
        float: left;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .article-author {
        width: 50%;
        height: 41px;
        font-weight: 500;
        float: left;
        line-height: 41px;
        transition: all 0.5s;
        cursor: pointer;
      }

      .publish-time {
        position: absolute;
        width: 200px;
        height: 41px;
        right: 0;
        line-height: 41px;
        text-align: right;
        transition: all 0.5s;

        i {
          font-size: 19px;
          font-weight: 600;
        }
      }

      .article-title {
        font-size: 18px;
        font-weight: 600;
        // text-align: center;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .article-description {
        // text-indent: 2em;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .article-message {
        width: 60%;
        margin-bottom: 5px;

        .article-message-item {
          width: 100px;
          float: left;

          i {
            font-size: 19px;
            font-weight: 600;
          }
        }
      }

      .article-tag {
        width: 40%;

        .article-tag-item {
          float: right;
          margin-left: 10px;
          margin-bottom: 5px;
        }
      }

      @media screen and (max-width: 1136px) {
        .article-message {
          width: 100%;
          font-size: 13px;
          font-weight: 550;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          .article-message-item {
            width: 30%;
            float: left;
            text-align: center;
          }
        }

        .article-tag {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .article-tag-item {
            width: 30%;
            float: left;
            margin-left: 0;
          }
        }
      }

      @media screen and (max-width: 499px) {
        .article-message {
          .article-message-item {
            font-size: 12px;
          }
        }
        .article-tag {
          .article-tag-item {
            width: 30%;
            margin-bottom: 5px;
          }
        }
      }

      @media screen and (max-width: 281px) {
      }

      @media screen and (max-width: 870px) {
        .article-author {
          width: 130px;
          float: left;
          height: 51px;
          line-height: 25px;
          padding: 0;
        }

        .publish-time {
          width: 100%;
          text-align: left;
          margin-top: 50px;
          height: 20.5px;
          line-height: 20.5px;

          img {
            width: 18px;
            margin-top: -4px;
          }
        }

        .article-title {
          margin-top: 25px;
        }
      }

      @media screen and (max-width: 281px) {
        .my-card-img {
          display: none;
        }
        .publish-time {
          font-size: 12px;
          img {
            display: none;
          }
        }
        .article-title {
          margin-top: 45px;
        }
        .publish-time {
          i {
            display: none;
          }
        }
        .article-message {
          .article-message-item {
            width: 50%;
            margin-bottom: 3px;

            font-weight: normal;
          }
        }

        .article-tag {
          .article-tag-item {
            width: 45%;
            float: left;
            margin-left: 0;
            margin-bottom: 5px;
          }
        }
      }
    }
    @media screen and (max-width: 281px) {
      .container-title {
        margin: 20px 13px;
      }
    }
  }
}
</style>