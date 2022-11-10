<template>
  <div class="trends-view">
    <div class="trends-container">
      <div class="left">
        <div class="top">
          <img src="./images/a.jpg" alt />
        </div>
        <div class="left-main">
          <img :src="userInfo.image" alt />
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
              <router-link to="/trendsView/concernTrend" exact>个人动态</router-link>
            </div>
          </div>
          <router-view></router-view>
        </div>
      </div>
      <div class="right">
        <div class="notice">公告栏</div>
        <div class="topic">话题</div>
      </div>
    </div>
  </div>
</template>
  
<script>
import TrendInput from "@/components/TrendInput";

import Comment from "@/components/Comment";

export default {
  name: "TrendsView",
  components: {
    TrendInput,
    Comment
  },
  data() {
    return {
      hasNoArticle: null
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  methods: {
  },
  mounted() {
    this.$store.dispatch("getUserInfo");
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
  min-height: 745px;
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
      width: 238px;
      .notice {
        width: 100%;
        height: 200px;
        background-color: var(--theme_inner_bg_color);
        border-radius: 0.5rem;
        box-shadow: 0 5px 8px 0 rgb(0 0 0 / 24%), 0 17px 15px 0 rgb(0 0 0 / 19%);
        margin-bottom: 30px;
        transition: all 0.3s;
      }
      .topic {
        width: 100%;
        height: 300px;
        background-color: var(--theme_inner_bg_color);
        border-radius: 0.5rem;
        box-shadow: 0 5px 8px 0 rgb(0 0 0 / 24%), 0 17px 20px 0 rgb(0 0 0 / 19%);
        transition: all 0.3s;
      }
    }
  }
}
</style>