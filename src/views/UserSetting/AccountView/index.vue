<template>
  <div class="account-view">
    <div class="title">账号设置</div>
    <div class="line"></div>
    <div class="account-view-container">
      <div class="edit-password">修改密码</div>
      <div class="delete-account">注销账号</div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "AccountView",
};
</script>
  
<style lang="less">
.account-view {
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
  .account-view-container {
    width: 72%;
    height: 500px;
    
  }
}
</style>