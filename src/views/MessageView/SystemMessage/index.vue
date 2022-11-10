<template>
  <div class="right">
    <div class="right-top">系统消息</div>
    <div class="right-main"></div>
  </div>
</template>

<script>
export default {
    name:'SystemMessage'
};
</script>

<style lang='less' scoped>
.right {
  width: 910px;
  height: 100%;
  float: right;
  transition: all 0.3s;
  .right-top {
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
    background-color: var(--theme_inner_bg_color);
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
    transition: all 0.3s;
  }
  .right-main {
    width: 100%;
    height: 615px;
    overflow-y: auto;
    background-color: var(--theme_inner_bg_color);
    border-radius: 5px;
    transition: all 0.3s;
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
  }
  .right-main::-webkit-scrollbar {
    width: 3px;
  }
}
</style>