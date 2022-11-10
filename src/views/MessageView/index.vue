<template>
  <div class="message-view">
    <div class="message-container">
      <div class="left">
        <div class="left-top">
          <i class="el-icon-s-promotion"></i> 消息中心
        </div>
        <ul class="change-nav" >
          <li class="change-nav-item" ><router-link to="/messageView/reply" ><span>回复我的</span></router-link></li>
          <li class="change-nav-item" ><router-link to="/messageView/kudos" ><span>收到的赞</span></router-link></li>
          <li class="change-nav-item" ><router-link to="/messageView/aboutArticle" ><span>文章评论</span></router-link></li>
          <li class="change-nav-item" ><router-link to="/messageView/aboutTrend" ><span>动态评论</span></router-link></li>
          <li class="change-nav-item" ><router-link to="/messageView/systemMessage" ><span>系统通知</span></router-link></li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageView"
};
</script>

<style lang="less">
.message-view {
  width: 100%;
  min-height: 745px;
  padding-top: 65px;
  background-color: var(--theme_outer_bg_color);
  transition: all 0.3s;
  .message-container {
    width: 1080px;
    height: 680px;
    margin: 0 0 0 200px;
    transition: all 0.3s;
    .left {
      width: 160px;
      height: 100%;
      background-color: var(--theme_inner_bg_color);
      float: left;
      border-radius: 5px;
      box-shadow: 0 1px 8px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
      transition: all 0.3s;
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
            transition: all 0.3s;
            &:hover {
            color: var(--theme_search_input_blue_color);
          }
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
      transition: all 0.3s;
      .right-top {
        width: 100%;
        height: 50px;
        background-color: var(--theme_inner_bg_color);
        margin-top: 5px;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
        transition: all 0.3s;
      }
      .right-main {
        width: 100%;
        min-height: 615px;
        overflow-y: auto;
        background-color: var(--theme_inner_bg_color);
        border-radius: 5px;
        transition: all 0.3s;
        box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
      }
    }
  }
}
</style>