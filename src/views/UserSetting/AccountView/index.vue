<template>
  <div class="account-view">
    <div class="title">账号设置</div>
    <div class="line"></div>
    <div class="account-view-container">
      <div class="edit-password">
        <div class="container-title">修改密码</div>
        <div class="container-body">
          <div class="info-item">
            <span>原密码</span>
            <input v-model="prePassword" type="password" />
            <div class="input-line"></div>
          </div>
          <div class="info-item">
            <span>新密码</span>
            <input v-model="newPassword" type="password" />
            <div class="input-line"></div>
          </div>
          <div class="info-item">
            <span>确认密码</span>
            <input v-model="confirmPassword" type="password" />
            <div class="input-line"></div>
          </div>
        </div>
        <el-popconfirm @confirm="updateThePassword" title="你确定要修改密码？">
          <el-button slot="reference" type="primary" size="small">修改密码</el-button>
        </el-popconfirm>
      </div>
      <div class="delete-account">
        <div class="container-title">忘记密码</div>
        <div class="container-body">
          <div class="info-item">
            <span>新密码</span>
            <input v-model="emailNewPassword" type="password" />
            <div class="input-line"></div>
          </div>
          <div class="info-item">
            <span>验证码</span>
            <input v-model="captcha" type="text" />
            <div class="input-line"></div>
          </div>
        </div>
        <span @click="sendUpdatePasswordCaptcha" class="captcha-container">
          <i class="my-plane el-icon-s-promotion"></i>
          <div class="captcha-button">发送验证码</div>
        </span>
        <el-button @click="updatePasswordByEmail" type="primary" size="small">修改密码</el-button>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "AccountView",
  data() {
    return {
      prePassword: null,
      newPassword: null,
      confirmPassword: null,
      emailNewPassword: null,
      captcha: null
    };
  },
  methods: {
    async updateThePassword() {
      if (!this.prePassword) {
        return this.$message({
          type: "warning",
          message: "你还没有输入原密码"
        });
      }
      if (!this.newPassword) {
        return this.$message({
          type: "warning",
          message: "你还没有输入新密码"
        });
      }
      if (!this.confirmPassword) {
        return this.$message({
          type: "warning",
          message: "你还没有输入确认密码"
        });
      }
      if (this.confirmPassword != this.newPassword) {
        return this.$message({
          type: "warning",
          message: "确认密码和新密码不一致"
        });
      }
      const ret = await this.$API.user.updatePassword(
        this.prePassword,
        this.newPassword
      );
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功请重新登陆"
        });
        localStorage.removeItem("kumicho_refresh_token");
        localStorage.removeItem("kumicho_access_token");
        this.$router.push("/login");
        this.$store.dispatch("clearUserInfo");
      } else {
        this.$message({
          type: "error",
          message: ret.message
        });
      }
    },
    async updatePasswordByEmail() {
      if (!this.emailNewPassword) {
        return this.$message({
          type: "warning",
          message: "你还没有输入新密码"
        });
      }
      if (!this.captcha) {
        return this.$message({
          type: "warning",
          message: "你还没有输入验证码"
        });
      }
      const ret = await this.$API.user.updatePasswordByEmail(
        this.emailNewPassword,
        this.captcha
      );
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "修改成功请重新登陆"
        });
        localStorage.removeItem("kumicho_refresh_token");
        localStorage.removeItem("kumicho_access_token");
        this.$router.push("/login");
        this.$store.dispatch("clearUserInfo");
      } else {
        this.$message({
          type: "error",
          message: ret.message
        });
      }
    },
    async sendUpdatePasswordCaptcha() {
      const ret = await this.$API.user.sendUpdatePasswordCaptcha();
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "验证码发送成功"
        });
      }
    }
  }
};
</script>
  
<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
}
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
    padding-top: 20px;
    .edit-password {
      margin-bottom: 20px;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .container-title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .container-body {
        margin-top: 10px;
        width: 70%;
        height: 100%;
        float: left;
        .info-item {
          margin-bottom: 40px;
          height: 40px;
          line-height: 40px;
          input {
            float: right;
            color: var(--theme_font_color);
            width: 70%;
            margin-right: 80px;
            outline-style: none;
            height: 35px;
            border: none;
            caret-color: var(--theme_search_input_blue_color);
            background-color: transparent;
          }
          .input-line {
            margin-top: -10px;
            float: right;
            transition: background-color 0.3s;
            width: 70%;
            margin-right: 80px;
            height: 1px;
            background-color: var(--theme_search_line_color);
          }
          input:focus + .input-line {
            background-color: var(--theme_search_input_blue_color);
          }
          .gender-radio {
            margin-left: 57px;
          }
          .date-choose {
            margin-left: 14px;
          }
        }
      }

      .el-button--primary {
        position: relative;
        left: 40px;
        top: 170px;
        height: 30px;
        width: 100px;
        line-height: 10px;
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      .el-button--primary:hover {
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
    }
    .delete-account {
      :deep(.el-button--primary) {
        height: 30px;
        width: 100px;
        margin-left: 40px;
        margin-top: 30px;
        line-height: 10px;
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      :deep(.el-button--primary:hover) {
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .container-title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .container-body {
        margin-top: 10px;
        width: 70%;
        height: 100%;
        float: left;
        .info-item {
          margin-bottom: 40px;
          height: 40px;
          line-height: 40px;
          input {
            float: right;
            color: var(--theme_font_color);
            width: 70%;
            margin-right: 80px;
            outline-style: none;
            height: 35px;
            border: none;
            caret-color: var(--theme_search_input_blue_color);
            background-color: transparent;
          }
          .input-line {
            margin-top: -10px;
            float: right;
            transition: background-color 0.3s;
            width: 70%;
            margin-right: 80px;
            height: 1px;
            background-color: var(--theme_search_line_color);
          }
          input:focus + .input-line {
            background-color: var(--theme_search_input_blue_color);
          }
          .gender-radio {
            margin-left: 57px;
          }
          .date-choose {
            margin-left: 14px;
          }
        }
      }
      .captcha-container {
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          color: var(--theme_search_input_blue_color);
        }
        .my-plane {
          font-size: 20px;
          margin-top: 40px;
          margin-left: 35px;
        }
        .captcha-button {
          width: 98px;
          display: inline-block;
          font-weight: 600;
          font-size: 16px;
          margin-left: 5px;
          margin-top: 40px;
        }
      }
    }
  }
}
</style>