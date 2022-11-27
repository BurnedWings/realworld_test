<template>
  <div class="left-part">
    <el-menu class="setting-nav" background-color="transparent">
      <router-link to="/userSetting/infoView" exact>
        <el-menu-item index="1">
          <i class="el-icon-user-solid"></i>
          <span slot="title">个人信息</span>
        </el-menu-item>
      </router-link>
      <router-link to="/userSetting/accountView" exact>
        <el-menu-item index="2">
          <i class="el-icon-s-tools"></i>
          <span slot="title">账号</span>
        </el-menu-item>
      </router-link>
      <router-link to="/userSetting/emailView" exact>
        <el-menu-item index="3">
          <i class="el-icon-message"></i>
          <span slot="title">邮箱</span>
        </el-menu-item>
      </router-link>
      <router-link to="/userSetting/aboutView" exact>
        <el-menu-item index="4">
        <i class="el-icon-info"></i>
        <span slot="title">关于</span>
      </el-menu-item>
      </router-link>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "LeftPart",
  methods: {}
};
</script>

<style lang="less" scoped>
.left-part {
  width: 27%;
  height: 600px;
  position: absolute;
  .setting-nav {
    position: absolute;
    right: 70px;
    top: 30px;
    width: 200px;
    border-right: none;
    li {
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      border-radius: 5px;
      color: var(--theme_font_color);
      transition: all 0.3s;
      margin: 10px 0;
    }
    li:hover {
      background-color: var(--theme_userView_btn_bg_hover) !important;
      box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
    }
    .router-link-active {
      li {
        color: rgb(63, 126, 228) !important;
        background-color: var(--theme_userView_btn_bg_hover) !important;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      }
      i {
        color: rgb(63, 126, 228) !important;
      }
    }
  }
}
</style>