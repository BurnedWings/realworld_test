<template>
  <!-- 主体部分 -->
  <div class="main">
    <div class="my-container">
      <div class="row container-row" style="overflow: hidden">
        <div class="container-title">
          <div ref="typeItem" v-for="(type, index) in articleType" @click="searchByType(index, type._id)"
            :class="index === 0 ? 'active-title-item title-item' : 'title-item'">{{ type.content }}</div>
        </div>
        <div v-if="articlesCount === 0" class="no-article-list">
          <div class="title-line"></div>
          <div class="prompt-message">还没有人发表文章哦,快去发表新的文章吧~</div>
        </div>
        <div>
          <div class="row index-card my-card" v-for="(article, index) in articleList" :key="article._id">
            <div class="publish-time">
              <i class="iconfont icon-shijian"></i>
              发布于 &nbsp; {{ $dayjs(article.createdAt).format("YYYY/MM/DD") }}
            </div>
            <div style="cursor: pointer;" @click="showDetailArticle(article._id)">
              <div class="article-title">{{ article.title }}</div>
              <div v-if="article.cover" class="article-cover">
                <img :src="$myBaseUrl + article.cover" alt />
              </div>
              <span class="article-description">
                {{ article.author.username }}:
                <span v-html="article.body"></span>
              </span>
            </div>
            <div class="article-message">
              <div @click="showDetailArticle(article._id)" class="article-message-item">
                <i class="iconfont icon-dianji"></i>
                {{ article.clicksCount }}热度
              </div>
              <div @click="showDetailArticle(article._id)" class="article-message-item">
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
          </div>
          <div v-if="articleList.length === totalCount && totalCount != 0" class="row index-card my-card">
            <div class="bottom-message">没有更多文章了~</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-container">
      <div class="right-top-container">
        <el-carousel :interval="4000" indicator-position="outside">
          <el-carousel-item v-for="(item, index) in swiperList" :key="item._id">
            <el-popover placement="right-start" width="160" trigger="hover"
              :content="item.description ? '该封面是' + item.description + ',喜欢就为Ta点赞吧' : '该封面暂时还没有详细信息,喜欢就为Ta点赞吧'">
              <el-image slot="reference" @click="kudosTheSwiper(item._id)" style="width:100%;height:100%;"
                :src="$myBaseUrl + item.image" fit="cover"></el-image>
            </el-popover>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="right-bottom-container">
        <div class="right-bottom-container-title">
          <i class="iconfont icon-yongyan"></i>
          <span>站长推荐</span>
        </div>
        <div class="right-bottom-container-content">
          <div @click="showRecommendDetail(item._id)" v-for="(item, index) in recommendArticle" :key="item._id"
            class="content-item">
            <i class="el-icon-edit-outline"></i>
            <span>{{ item.title }}</span>
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
      articlesCount: null,
      noMore: false,
      offset: 1,
      canGetNewArticle: true,
      oldTypeIndex: 0,
      targetType: null,
      totalCount: null,
      articleType: null,
      canKudosSwiper: null
    };
  },
  computed: {
    swiperList() {
      return this.$store.state.user.swiperList;
    },
    recommendArticle() {
      return this.$store.state.user.articleList;
    }
  },
  methods: {
    //查看推荐文章详情
    showRecommendDetail(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    //轮播图点赞
    async kudosTheSwiper(val) {
      if (this.canKudosSwiper != val) {
        await this.$API.user.kudosTheSwiper(val);
        this.canKudosSwiper = val;
        setTimeout(() => {
          this.canKudosSwiper = null;
        }, 60000);
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
    async getArticleList() {
      if (this.targetType === null) {
        this.targetType = this.$store.state.user.typeList[0]._id;
      }
      const ret = await this.$API.article.getArticleList(null, this.targetType);
      if (ret.code === 200) {
        for (const key in ret.data) {
          ret.data[key].body = ret.data[key].body.replaceAll(
            "http://localhost:3000/",
            this.$myBaseUrl
          )
        }
        this.articleList = ret.data;
        this.articlesCount = ret.articlesCount;
        this.totalCount = ret.totalCount;
        if (ret.totalCount === this.articleList.length) {
          this.canGetNewArticle = false;
        }
      }
    },
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
            const ret = await this.$API.article.getArticleList(
              this.offset,
              this.targetType
            );
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
    },
    async searchByType(index, typeId) {
      if (this.oldTypeIndex === index) return;
      this.targetType = typeId;
      this.getArticleList();
      if (this.oldTypeIndex != null) {
        this.$refs.typeItem[this.oldTypeIndex].classList.remove(
          "active-title-item"
        );
      }
      this.$refs.typeItem[index].classList.add("active-title-item");
      this.oldTypeIndex = index;
      this.canGetNewArticle = true;
      this.noMore = false;
      this.offset = 1;
    },
    async getArticleType() {
      await this.$store.dispatch("getArticleType");
      this.articleType = this.$store.state.user.typeList;
      this.getArticleList();
    }
  },
  mounted() {
    this.getArticleType();
    window.addEventListener("scroll", this.windowScroll); //监听页面滚动
    let img = document.querySelector(".el-carousel__container");
    //点击特效
    !(function (e, t, a) {
      function r() {
        for (var e = 0; e < s.length; e++)
          s[e].alpha <= 0
            ? (t.body.removeChild(s[e].el), s.splice(e, 1))
            : (s[e].y--,
              (s[e].scale += 0.004),
              (s[e].alpha -= 0.013),
              (s[e].el.style.cssText =
                "left:" +
                s[e].x +
                "px;top:" +
                s[e].y +
                "px;opacity:" +
                s[e].alpha +
                ";transform:scale(" +
                s[e].scale +
                "," +
                s[e].scale +
                ") rotate(45deg);background:" +
                s[e].color +
                ";z-index:99999"));
        requestAnimationFrame(r);
      }

      function n() {
        var t = "function" == typeof e.onclick && e.onclick;
        e.onclick = function (e) {
          t && t(), o(e);
        };
      }

      function o(e) {
        var a = t.createElement("div");
        (a.className = "heart"),
          s.push({
            el: a,
            x: e.clientX - 5,
            y: e.clientY - 5,
            scale: 1,
            alpha: 1,
            color: c()
          }),
          t.body.appendChild(a);
      }

      function i(e) {
        var a = t.createElement("style");
        a.type = "text/css";
        try {
          a.appendChild(t.createTextNode(e));
        } catch (t) {
          a.styleSheet.cssText = e;
        }
        t.getElementsByTagName("head")[0].appendChild(a);
      }

      function c() {
        return (
          "rgb(" +
          ~~(255 * Math.random()) +
          "," +
          ~~(255 * Math.random()) +
          "," +
          ~~(255 * Math.random()) +
          ")"
        );
      }
      var s = [];
      (e.requestAnimationFrame =
        e.requestAnimationFrame ||
        e.webkitRequestAnimationFrame ||
        e.mozRequestAnimationFrame ||
        e.oRequestAnimationFrame ||
        e.msRequestAnimationFrame ||
        function (e) {
          setTimeout(e, 1e3 / 60);
        }),
        i(
          ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
        ),
        n(),
        r();
    })(img, document);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
  }
};
</script>
<style lang="less" scoped >
//主体
.main {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  background-color: var(--theme_outer_bg_color);
  transition: all 0.5s;
  padding-top: 85px;

  // padding-bottom: 30px;
  .my-container {
    transition: all 0.5s;
    margin-right: 40px;
    background-color: var(--theme_inner_bg_color);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);

    .container-row {
      width: 900px;
      padding: 0 30px 0 30px;

      .container-title {
        font-weight: 800;
        margin: 20px 30px;
        font-size: 20px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .title-item {
          margin-right: 20px;
          cursor: pointer;
          margin-left: 20px;
          opacity: 1;
          animation: titleMove 1.3s;
          transition: color 0.3s;

          &:hover {
            color: var(--theme_search_input_blue_color);
          }
        }

        .active-title-item {
          color: var(--theme_search_input_blue_color);
        }

        @keyframes titleMove {
          0% {
            margin-left: -10px;
            opacity: 0;
          }

          100% {
            margin-left: 20px;
            opacity: 1;
          }
        }
      }

      .no-article-list {
        .title-line {
          width: 95%;
          height: 1px;
          margin-left: auto;
          margin-right: auto;
          transform: scaleY(0.6);
          background-color: rgb(131, 130, 130);
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

        .bottom-message {
          text-align: center;
        }

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
          top: 13px;
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
          display: none !important;

          & {
            height: 0px !important;
          }
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

        .article-description :deep(p:has(img)) {
          display: none !important;
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
  }

  .right-container {
    width: 270px;

    .right-top-container {
      transition: all 0.5s;
      width: 260px;
      overflow: hidden;
      height: 250px;
      background-color: var(--theme_inner_bg_color);
      border-radius: 0.5rem;
      box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);

      &:deep(.el-carousel__container) {
        height: 220px;
        // img {
        //   width: 100%;
        //   position: relative;
        //   top: -15px;
        // }
      }
    }

    .right-bottom-container {
      margin-top: 20px;
      width: 260px;
      height: 370px;
      position: sticky;
      top: 55px;
      transition: all 0.5s;
      overflow: hidden;
      background-color: var(--theme_inner_bg_color);
      border-radius: 0.5rem;
      box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);

      .right-bottom-container-title {
        margin-top: 8px;
        cursor: default;

        i {
          margin-left: 80px;
          font-size: 18px;
          margin-right: 5px;
        }
      }

      .right-bottom-container-content {
        height: 335px;
        padding-top: 10px;
        padding-left: 13px;
        padding-right: 10px;

        .content-item {
          max-height: 50px;
          margin-bottom: 20px;
          transition: color 0.2s;
          cursor: pointer;
          word-wrap: break-word;
          white-space: normal;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          display: -webkit-box;

          i {
            margin-right: 5px;
            font-size: 18px;
          }

          &:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
  }
}
</style>