<template>
  <div class="trends-view">
    <div class="trends-container">
      <div class="left">
        <div class="top">
          <img src="./images/a.jpg" alt />
        </div>
        <div class="left-main">
          <img v-if="userInfo.image" :src="$myBaseUrl+userInfo.image" alt />
          <div class="username">{{userInfo.username}}</div>
          <div class="message">
            <div class="message-item">
              <div class="content">{{userInfo.concernsCount}}</div>
              <div class="title">关注</div>
            </div>
            <div class="message-item">
              <div class="content">{{userInfo.fansCount}}</div>
              <div class="title">粉丝</div>
            </div>
            <div class="message-item">
              <div class="content">{{userInfo.trendsCount}}</div>
              <div class="title">动态</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="main-top">
          <TrendInput></TrendInput>
        </div>
        <div class="main-bottom">
          <div class="trend-nav">
            <div ref="showArticle" class="nav-item">
              <router-link to="/trendsView/trendArticle" exact>文章投稿</router-link>
            </div>
            <div ref="showTrend" class="nav-item">
              <router-link to="/trendsView/concernTrend" exact>动态投稿</router-link>
            </div>
          </div>
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
      <div class="right">
        <div class="notice">
          <el-carousel :interval="3000" indicator-position="outside">
            <el-carousel-item v-for="(item,index) in swiperList" :key="item._id">
              <el-popover
                placement="right-start"
                width="160"
                trigger="hover"
                :content="item.description?'该封面是'+item.description+',喜欢就为Ta点赞吧':'该封面暂时还没有详细信息,喜欢就为Ta点赞吧'"
              >
                <el-image
                  slot="reference"
                  @click="kudosTheSwiper(item._id)"
                  style="width:100%;height:100%;"
                  :src="$myBaseUrl+item.image"
                  fit="cover"
                ></el-image>
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
            <div
              @click="showRecommendDetail(item._id)"
              v-for="(item,index) in recommendArticle"
              :key="item._id"
              class="content-item"
            >
              <i class="el-icon-edit-outline"></i>
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
const TrendInput = () => import("@/components/TrendInput");

const Comment = () => import("@/components/Comment");

export default {
  name: "TrendsView",
  components: {
    TrendInput,
    Comment
  },
  data() {
    return {
      hasNoArticle: null,
      canKudosSwiper: null
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
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
      if (this.canKudosSwiper != val ) {
        await this.$API.user.kudosTheSwiper(val);
        this.canKudosSwiper = val;
        setTimeout(() => {
          this.canKudosSwiper = null;
        }, 60000);
      }
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo");
    let img = document.querySelector(".el-carousel__container");
    //点击特效
    !(function(e, t, a) {
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
        e.onclick = function(e) {
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
        function(e) {
          setTimeout(e, 1e3 / 60);
        }),
        i(
          ".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
        ),
        n(),
        r();
    })(img, document);
  }
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
.trends-view {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: var(--theme_outer_bg_color);
  padding-top: 80px;
  transition: all 0.5s;
  .trends-container {
    display: flex;
    justify-content: center;
    margin: 0 auto;
    min-height: 10vh;
    .left {
      border-radius: 0.5rem;
      width: 250px;
      .top {
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
        width: 100%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .left-main {
        width: 100%;
        height: 120px;
        border-bottom-left-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
        transition: all 0.3s;
        background-color: var(--theme_inner_bg_color);
        box-shadow: 0 5px 15px 0 rgb(0 0 0 / 24%),
          0 17px 50px 0 rgb(0 0 0 / 19%);
        img {
          width: 52px;
          border-radius: 50%;
          position: relative;
          top: -15px;
          left: 20px;
        }
        .username {
          display: inline-block;
          margin-left: 33px;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          transition: color 0.3s;
          &:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
        .message {
          display: flex;
          justify-content: center;
          .message-item {
            margin: 0 17px;
            text-align: center;
            cursor: pointer;
            .title {
              margin-bottom: 3px;
            }
            .content {
              transition: color 0.3s;
              &:hover {
                color: var(--theme_search_input_blue_color);
              }
            }
          }
        }
      }
    }
    .main {
      width: 702px;
      margin: 0 10px;

      .main-top {
        transition: all 0.3s;
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 5px 3px 0 rgb(0 0 0 / 8%), 0 2px 3px 0 rgb(0 0 0 / 19%);
      }
      .main-bottom {
        transition: all 0.3s;
        width: 100%;
        min-height: 500px;
        border-radius: 0.5rem;
        box-shadow: 0 3px 8px 0 rgb(0 0 0 / 24%), 0 3px 10px 0 rgb(0 0 0 / 19%);
        background-color: var(--theme_inner_bg_color);
        padding-top: 5px;
        padding-bottom: 25px;
        .trend-nav {
          display: flex;
          width: 190px;
          height: 40px;
          line-height: 40px;
          justify-content: center;
          .nav-item {
            margin-right: 15px;
            font-weight: 600;
            color: var(--theme_font_color);
            cursor: pointer;
            transition: color 0.3s;
            &:hover :deep(a) {
              color: var(--theme_search_input_blue_color) !important;
            }
          }
          .router-link-active {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
    .right {
      width: 240px;
      .notice {
        width: 100%;
        height: 220px;
        overflow: hidden;
        background-color: var(--theme_inner_bg_color);
        border-radius: 0.5rem;
        box-shadow: 0 5px 8px 0 rgb(0 0 0 / 24%), 0 17px 15px 0 rgb(0 0 0 / 19%);
        margin-bottom: 30px;
        transition: all 0.3s;
        &:deep(.el-carousel__container) {
          height: 195px;
          img {
            width: 100%;
          }
        }
      }
      // .topic {
      //   width: 100%;
      //   height: 300px;
      //   background-color: var(--theme_inner_bg_color);
      //   border-radius: 0.5rem;
      //   box-shadow: 0 5px 8px 0 rgb(0 0 0 / 24%), 0 17px 20px 0 rgb(0 0 0 / 19%);
      //   transition: all 0.3s;
      //   position: sticky;
      //   top: 56px;
      // }
      .right-bottom-container {
        margin-top: 30px;
        width: 100%;
        height: 370px;
        position: sticky;
        top: 55px;
        transition: all 0.5s;
        overflow: hidden;
        background-color: var(--theme_inner_bg_color);
        border-radius: 0.5rem;
        box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%),
          0 17px 50px 0 rgb(0 0 0 / 19%);
        .right-bottom-container-title {
          margin-top: 8px;
          cursor: default;
          i {
            margin-left: 70px;
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
            margin-bottom: 16px;
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
}
</style>