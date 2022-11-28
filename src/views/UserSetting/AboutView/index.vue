<template>
  <div class="about-view">
    <div class="title">关于本站</div>
    <div class="line"></div>
    <div class="about">
      声明
      <br>
      网站中涉及到的部分文章，摘自哔哩哔哩专栏，知乎等，均用于充当测试数据，并无盈利目的，如果侵犯到你的利
      <br>
      益,请联系我的邮箱1497689258@qq.com,再此深感抱歉，我会在收到邮件后立即删除。
    </div>
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
  .about{
    margin-top: 10px;
    font-weight: 600;
  }
}
</style>