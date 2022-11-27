<template>
  <div class="login-view">
    <div class="login-container">
      <div class="form-container">
        <div class="title">{{ isLogin === true ? "Login" : "register" }}</div>
        <el-form
          :model="userInfo"
          status-icon
          :rules="rules"
          ref="userInfo"
          label-width="100px"
          class="demo-ruleForm login-form"
        >
          <el-form-item v-if="!isLogin" label="用户名" prop="username">
            <el-input v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="isShowCaptcha&&isLogin===false" label="验证码" prop="captcha">
            <el-input class="captcha-input" v-model="userInfo.captcha" autocomplete="off"></el-input>
            <div class="button-container">
              <i class="my-plane el-icon-s-promotion"></i>
              <div @click="sendTheCaptcha" class="captcha-button">发送验证码</div>
            </div>
          </el-form-item>
          <el-form-item v-if="isShowCaptcha&&isLogin" label="验证码" prop="captcha">
            <el-input class="captcha-input" v-model="userInfo.captcha" autocomplete="off"></el-input>
            <div class="button-container">
              <i class="my-plane el-icon-s-promotion"></i>
              <div @click="sendTheCaptcha" class="captcha-button">发送验证码</div>
            </div>
          </el-form-item>
          <el-form-item v-if="isShowPassInput" class="my-pass-item" label="密码" prop="password">
            <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="my-button-item">
            <el-button
              style="width: 80%"
              type="primary"
              @click="submitForm('userInfo')"
            >{{ isLogin === true ? "登录" : "注册" }}</el-button>
          </el-form-item>
        </el-form>
        <div
          v-if="isLogin"
          @click="emailLogin"
          class="email-login"
        >{{isShowCaptcha&&isLogin?'密码登录':'邮箱验证码登录'}}</div>
        <div class="turnTo">
          {{ isLogin === true ? "没有账号？" : "已有账号?" }}&nbsp;
          <!-- <router-link class="toRegister" v-if="isLogin" to="/register"
            >去注册</router-link
          >-->
          <span class="toRegister" v-if="isLogin" @click="toRegister">去注册</span>
          <!-- <router-link class="toLogin" v-if="!isLogin" to="/login"
            >去登录</router-link
          >-->
          <span class="toLogin" v-if="!isLogin" @click="toLogin">去登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        if (value.length < 2) {
          callback(new Error("用户名字符长度为2-20位"));
        } else {
          if (value.length > 20) {
            callback(new Error("用户名字符长度为2-20位"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var reg = /^([A-z0-9]{6,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else {
        if (reg.test(value)) {
          if (!this.isLogin) {
            this.isShowCaptcha = true;
          }
          callback();
        } else {
          callback(new Error("邮箱格式不正确"));
        }
      }
    };
    var validateCaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (/^\d{4}$/.test(value)) {
          callback();
        } else {
          callback(new Error("验证码格式不正确"));
        }
      }
    };
    return {
      userInfo: {
        username: "",
        email: "",
        password: "",
        captcha: ""
      },
      rules: {
        username: [{ validator: checkName, trigger: "change" }],
        email: [{ validator: validateEmail, trigger: "change" }],
        password: [{ validator: validatePass, trigger: "change" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }]
      },
      isShowCaptcha: false,
      checked: false,
      isShowPassInput: true,
      canSendCaptcha: true
    };
  },
  methods: {
    //注册or登录
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.isLogin === true) {
            try {
              let res;
              if (this.isShowPassInput) {
                res = await this.$API.user.userLogin({
                  email: this.userInfo.email,
                  password: this.userInfo.password
                });
              } else if (this.isShowCaptcha) {
                res = await this.$API.user.emailLogin({
                  email: this.userInfo.email,
                  captcha: this.userInfo.captcha
                });
              }
              if (res.code === 200) {
                localStorage.setItem("kumicho_access_token", res.access_token);
                localStorage.setItem(
                  "kumicho_refresh_token",
                  res.refresh_token
                );
                this.$bus.$emit("login");
                this.$router.push("/");
              } else if (res.code === 202) {
                this.$message({
                  type: "error",
                  message: res.message
                });
              }
            } catch (error) {
              this.$message({
                message: error[0].msg,
                type: "error"
              });
            }
          } else {
            try {
              let res = await this.$API.user.userRegister(this.userInfo);
              if (res.code === 200) {
                this.userInfo.password = "";
                this.isShowPassInput = true;
                this.isShowCaptcha = false;
                this.$router.push("/login");
                // this.isLogin=true
                let userCollection = {};
                userCollection.user = res.data._id;
                await this.$API.collection.createDefault(userCollection);
              } else if (res.code === 201) {
                this.$message({
                  type: "error",
                  message: "验证码无效"
                });
              }
            } catch (error) {
              this.$message({
                message: error[0].msg,
                type: "error"
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toRegister() {
      this.$refs.userInfo.clearValidate();
      this.isShowPassInput = true;
      this.userInfo.email = "";
      this.isShowCaptcha = false;
      this.$router.push("/register");
    },
    toLogin() {
      this.$refs.userInfo.clearValidate();
      this.isShowPassInput = true;
      this.isShowCaptcha = false;
      this.$router.push("/login");
    },
    emailLogin() {
      if (this.isShowCaptcha && this.isLogin) {
        this.isShowCaptcha = false;
        this.isShowPassInput = true;
      } else {
        this.isShowCaptcha = true;
        this.isShowPassInput = false;
      }
    },
    async sendTheCaptcha() {
      if (this.canSendCaptcha) {
        var reg = /^([A-z0-9]{6,18})(\w|\-)+@[A-z0-9]+\.([A-z]{2,3})$/;
        if (!reg.test(this.userInfo.email))
          return this.$message({ type: "error", message: "邮箱格式错误" });
        if (this.userInfo.email != "") {
          const ret = await this.$API.user.getCaptcha(
            this.userInfo.email.trim()
          );
          this.canSendCaptcha = false;
          setTimeout(() => {
            this.canSendCaptcha = true;
          }, 60000);
        } else {
          this.$message({
            type: "warning",
            message: "请输入你的邮箱~"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "你的操作太频繁了哦，亲~"
        });
      }
    }
  },
  computed: {
    isLogin() {
      return this.$route.meta.isLogin;
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.login-view {
  transition: all 0.5s;
  width: 100%;
  min-height: 100vh;
  background-color: var(--theme_outer_bg_color);
  .login-container {
    transition: inherit;
    width: 495px;
    min-height: 295px;
    background-color: var(--theme_inner_bg_color);
    position: absolute;
    top: 50%;
    left: 50%;
    padding-bottom: 10px;
    transform: translate(-50%, -50%);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);

    .form-container {
      width: 100%;
      .title {
        font-size: 30px;
        text-align: center;
      }
      .login-form {
        margin-top: 10px;

        :deep(.my-pass-item) {
          margin-bottom: 0px;
        }

        :deep(.my-button-item) {
          margin-top: 20px;
        }

        :deep(.el-form-item__label) {
          color: var(--theme_font_color);
        }
        :deep(.el-input__inner) {
          width: 80%;
        }
        :deep(.captcha-input) {
          width: 50%;
          margin-right: 0;
        }
        .button-container {
          width: 120px;
          display: inline-block;
          transition: color 0.4s;
          &:hover {
            color: var(--theme_search_input_blue_color);
          }
          .my-plane {
            font-size: 20px;
          }
          .captcha-button {
            width: 98px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            text-align: right;
            cursor: pointer;
          }
        }
      }
      .email-login {
        display: inline-block;
        width: 150px;
        margin-left: 100px;
        text-align: left;
        font-size: 14px;
        cursor: pointer;
      }
      .turnTo {
        width: 150px;
        text-align: right;
        float: right;
        margin-right: 80px;
        cursor: default;
        .toRegister {
          font-weight: 600;
          transition: 0.2s;
          cursor: pointer;
        }
        .toRegister:hover {
          color: var(--theme_search_input_blue_color);
        }
        .toLogin {
          font-weight: 600;
          transition: 0.2s;
          cursor: pointer;
        }
        .toLogin:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }
  }
  @media screen and (max-height: 520px) {
    .login-container {
      position: fixed;
      top: 260px;
    }
  }
}
</style>