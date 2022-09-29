<template>
  <div class="email-view">
    <div class="title">我的邮箱</div>
    <div class="line"></div>
    <div>绑定邮箱</div>
    <div>解绑邮箱</div>
  </div>
</template>
  
  <script>
export default {
  name: "EmailView",
};
</script>
  
  <style lang="less">
.email-view {
  .title {
    font-size: 20px;
  }
  .line {
    width: 72%;
    height: 1px;
    transform: scaleY(0.5);
    background-color: rgb(131, 130, 130);
    margin-top: 10px;
  }
}
</style>