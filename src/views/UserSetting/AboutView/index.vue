<template>
  <div class="about-view">
    <div class="title">关于本站</div>
    <div class="line"></div>
  </div>
</template>
  
  <script>
export default {
  name: "AboutView",
};
</script>
  
<style lang="less">
.about-view {
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