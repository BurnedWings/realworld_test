<template>
  <!-- 主体部分 -->
  <div class="main">
    <div class="my-container">
      <div class="row container-row" style="overflow: hidden">
        <div class="container-title">首页文章列表</div>
        <div v-if="articlesCount===0" class="no-article-list">
          <div class="title-line"></div>
          <div class="prompt-message">还没有人发表文章哦,快去发表新的文章吧~</div>
        </div>
        <div>
          <div class="row index-card my-card" v-for="(article, index) in articleList">
            <div class="publish-time">
              <i class="iconfont icon-shijian"></i>
              发布于 &nbsp; {{$dayjs(article.createdAt).format("YYYY/MM/DD")}}
            </div>
            <div style="cursor: pointer;" @click="showDetailArticle(article._id)">
              <div class="article-title">{{ article.title }}</div>
              <div v-if="article.cover" class="article-cover">
                <img :src="article.cover" alt />
              </div>
              <span class="article-description">
                {{article.author.username}}:
                <span v-html="article.body"></span>
              </span>
            </div>
            <div class="article-message">
              <div @click="showDetailArticle(article._id)" class="article-message-item">
                <i class="iconfont icon-dianji"></i>
                {{article.clicksCount}}热度
              </div>
              <div @click="showDetailArticle(article._id)" class="article-message-item">
                <i class="iconfont icon-taolun"></i>
                {{article.commentsCount}}讨论
              </div>
              <div @click="kudos(article._id,article.author._id)" class="article-message-item">
                <i class="iconfont icon-dianzan"></i>
                <!-- el-icon-star-off -->
                {{article.favoritesCount}}点赞
              </div>
            </div>
            <div class="article-tag">
              <div v-for="(tag, index) in article.tagList" class="article-tag-item">#{{ tag }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <div class="title">不知道该写什么~~~</div>
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
      articlesCount: null,
      noMore: false,
      offset: 1,
      canGetNewArticle: true
    };
  },
  methods: {
    showDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    async getArticleList() {
      const ret = await this.$API.article.getArticleList();
      if (ret.code === 200) {
        this.articleList = ret.data;
        this.articlesCount = ret.articlesCount;
      }
    },
    // toUserView(userId) {
    //   this.$router.push({
    //     name: "userView",
    //     params: {
    //       userId
    //     }
    //   });
    // },
    async kudos(articleId, authorId) {
      if (this.$store.state.user.userId) {
        const ret = await this.$API.article.kudos({
          article: articleId,
          user: this.$store.state.user.userId,
          ofUser: authorId
        });
        if (ret.code === 200) {
          this.getArticleList();
        }
      } else {
        this.$router.push("/login");
      }
    },
    //获取当前可视范围的高度
    getClientHeight() {
      var clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      } else {
        clientHeight = Math.max(
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
      }
      clientHeight = Math.ceil(clientHeight);
      return clientHeight;
    },
    //获取文档完整的高度
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
    },
    //获取当前滚动条的位置
    getScrollTop() {
      var scrollTop = 0;
      //window.pageYOffset = document.documentElement.scrollTop
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    async windowScroll() {
      //获取三个值
      var scrollTop = Math.trunc(this.getScrollTop());
      var clientHeight = this.getClientHeight();
      var scrollHeight = this.getScrollHeight();
      //如果满足公式则，确实到底了
      if ((scrollHeight - (scrollTop + clientHeight)) / scrollHeight < 0.15) {
        if (this.canGetNewArticle) {
          this.canGetNewArticle = false;
          //发送异步请求请求数据，同时携带offset并自增offset
          //noMore是自定义变量，如果是最后一批数据则以后都不加载
          if (!this.noMore) {
            const ret = await this.$API.article.getArticleList(this.offset);
            if (ret.code === 200) {
              if (ret.articlesCount < 4) {
                this.noMore = true;
              }
              this.articleList.push(...ret.data);
              this.articlesCount += ret.articlesCount;
              this.offset += 1;
              this.$nextTick(() => {
                this.canGetNewArticle = true;
              });
            }
          }
        }
      }
    }
  },
  mounted() {
    this.getArticleList();
    window.addEventListener("scroll", this.windowScroll); //监听页面滚动
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
  }
};
</script>

<style lang="less" scoped >
//主体
.main {
  min-width: 918px;
  background-color: var(--theme_outer_bg_color);
  transition: all 0.5s;
  padding-top: 90px;
  // padding-bottom: 30px;
  .my-container {
    transition: all 0.5s;
    width: 850px;
    min-height: 655px;
    margin-left: 13%;
    padding-left: 35px;
    background-color: var(--theme_inner_bg_color);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    position: relative;
    .container-row {
      width: 100%;
      .container-title {
        font-weight: 800;
        margin: 20px 30px;
        font-size: 20px;
      }

      .no-article-list {
        .title-line {
          background-color: rgb(131, 130, 130);
          width: 95%;
          height: 1px;
          margin-left: auto;
          margin-right: auto;
          transform: scaleY(0.6);
        }

        .prompt-message {
          text-align: center;
          margin-top: 27%;
          font-size: 18px;
        }
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
          right: 2px;
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

        .article-cover {
          max-width: 190px;
          height: 130px;
          float: left;
          overflow: hidden;
          margin-right: 15px;
          img {
            height: 100%;
          }
        }

        .article-description {
          word-wrap: break-word;
          white-space: normal;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
          display: -webkit-box;
          cursor: pointer;
          max-height: 150px;
        }
        .article-description :deep(img) {
          width: 0;
          height: 0;
        }
        .article-description :deep(p) {
          // font-size: 16px;
          line-height: 27px;
          display: inline;
          letter-spacing: 0.5px;
        }
        .article-description :deep(*) {
          font-size: 1rem;
        }

        .article-message {
          width: 60%;
          margin-top: 20px;

          .article-message-item {
            float: left;
            margin-right: 15px;

            cursor: pointer;
            transition: color 0.3s;

            i {
              font-size: 19px;
              font-weight: 600;
            }
          }
          .article-message-item:hover {
            color: var(--theme_search_input_blue_color);
          }
        }

        .article-tag {
          width: 40%;
          margin-top: 25px;
          padding-right: 15px;

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

        // @media screen and (max-width: 1136px) {
        //   .article-message {
        //     width: 100%;
        //     font-size: 13px;
        //     font-weight: 550;
        //     display: flex;
        //     justify-content: space-between;
        //     flex-wrap: wrap;

        //     .article-message-item {
        //       width: 30%;
        //       float: left;
        //       text-align: center;
        //     }
        //   }

        //   .article-tag {
        //     width: 100%;
        //     display: flex;
        //     flex-wrap: wrap;
        //     justify-content: space-between;
        //     .article-tag-item {
        //       width: 30%;
        //       float: left;
        //       margin-left: 0;
        //     }
        //   }
        // }

        // @media screen and (max-width: 499px) {
        //   .article-message {
        //     .article-message-item {
        //       font-size: 12px;
        //     }
        //   }
        //   .article-tag {
        //     .article-tag-item {
        //       width: 30%;
        //       margin-bottom: 5px;
        //     }
        //   }
        // }

        // @media screen and (max-width: 281px) {
        // }

        // @media screen and (max-width: 870px) {
        //   .article-author {
        //     width: 130px;
        //     float: left;
        //     height: 51px;
        //     line-height: 25px;
        //     padding: 0;
        //   }

        //   .publish-time {
        //     width: 100%;
        //     text-align: left;
        //     margin-top: 50px;
        //     height: 20.5px;
        //     line-height: 20.5px;

        //     img {
        //       width: 18px;
        //       margin-top: -4px;
        //     }
        //   }

        //   .article-title {
        //     margin-top: 25px;
        //   }
        // }

        // @media screen and (max-width: 281px) {
        //   .my-card-img {
        //     display: none;
        //   }
        //   .publish-time {
        //     font-size: 12px;
        //     img {
        //       display: none;
        //     }
        //   }
        //   .article-title {
        //     margin-top: 45px;
        //   }
        //   .publish-time {
        //     i {
        //       display: none;
        //     }
        //   }
        //   .article-message {
        //     .article-message-item {
        //       width: 50%;
        //       margin-bottom: 3px;

        //       font-weight: normal;
        //     }
        //   }

        //   .article-tag {
        //     .article-tag-item {
        //       width: 45%;
        //       float: left;
        //       margin-left: 0;
        //       margin-bottom: 5px;
        //     }
        //   }
        // }
      }
      // @media screen and (max-width: 281px) {
      //   .container-title {
      //     margin: 20px 13px;
      //   }
      // }
    }
    .right-container {
      transition: all 0.5s;
      position: absolute;
      right: -285px;
      top: 0px;
      width: 260px;
      height: 220px;
      background-color: var(--theme_inner_bg_color);
      border-radius: 0.5rem;
      box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
      .title {
        text-align: center;
        margin-top: 10px;
        font-size: 18px;
      }
    }
  }
}
</style>