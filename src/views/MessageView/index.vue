<template>
  <div class="message-view">
    <div class="message-container">
      <div class="left">
        <div class="left-top">
          <i class="el-icon-s-promotion"></i> 消息中心
        </div>
        <ul class="change-nav">
          <li class="change-nav-item">
            <router-link to="/messageView/reply">
              <span>回复我的</span>
            </router-link>
          </li>
          <li class="change-nav-item">
            <router-link to="/messageView/kudos">
              <el-badge :max="99" :hidden="kudos===0" :value="kudos" class="item">
                <span>收到的赞</span>
              </el-badge>
            </router-link>
          </li>
          <li class="change-nav-item">
            <router-link to="/messageView/aboutArticle">
              <el-badge
                :max="99"
                :hidden="articleCommentCount===0"
                :value="articleCommentCount"
                class="item"
              >
                <span>文章评论</span>
              </el-badge>
            </router-link>
          </li>
          <li class="change-nav-item">
            <router-link to="/messageView/aboutTrend">
              <el-badge
                :max="99"
                :hidden="trendCommentCount===0"
                :value="trendCommentCount"
                class="item"
              >
                <span>动态评论</span>
              </el-badge>
            </router-link>
          </li>
          <li class="change-nav-item">
            <router-link to="/messageView/systemMessage">
              <el-badge :max="99" :hidden="systemCount===0" :value="systemCount" class="item">
                <span>系统通知</span>
              </el-badge>
            </router-link>
          </li>
        </ul>
      </div>
      <transition name="fade-transform" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageView",
  computed: {
    kudos() {
      return this.$store.state.user.kudos;
    },
    trendCommentCount() {
      return this.$store.state.user.trendCommentCount;
    },
    articleCommentCount() {
      return this.$store.state.user.articleCommentCount;
    },
    systemCount() {
      return this.$store.state.user.systemCount;
    }
  }
};
</script>

<style lang="less" scoped>
:deep(.el-badge .el-badge__content) {
  border: 0px;
  top: 5px;
}
.message-view {
  padding-top: 65px;
  min-width: 100vh;
  background-color: var(--theme_outer_bg_color);
  transition: all 0.3s;
  .message-container {
    width: 1080px;
    height: 680px;
    margin: 0 0 0 200px;
    .left {
      width: 160px;
      height: 100%;
      background-color: var(--theme_inner_bg_color);
      float: left;
      border-radius: 5px;
      box-shadow: 0 1px 8px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
      transition: background-color 0.3s;
      .left-top {
        font-weight: 600;
        text-align: center;
        margin-top: 10px;
        cursor: default;
      }
      .change-nav {
        margin-top: 28px;
        margin-left: 15px;
        .change-nav-item {
          line-height: 40px;
          font-weight: 600;
          span {
            cursor: pointer;
            // transition: all 0.3s;
            &:hover {
              color: var(--theme_search_input_blue_color);
            }
          }
          a:hover {
            color: var(--theme_search_input_blue_color) !important;
          }
        }
        .router-link-active {
          color: var(--theme_search_input_blue_color);
        }
      }
    }
    .right {
      width: 910px;
      height: 100%;
      float: right;

      .right-top {
        width: 100%;
        height: 50px;
        background-color: var(--theme_inner_bg_color);
        margin-top: 5px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
      }
      .right-main {
        width: 100%;
        min-height: 615px;
        overflow-y: auto;
        background-color: var(--theme_inner_bg_color);
        border-radius: 5px;

        box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
      }
    }
  }
}
</style>