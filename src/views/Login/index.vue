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
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="userInfo.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              style="width: 80%"
              type="primary"
              @click="submitForm('userInfo')"
              >{{ isLogin === true ? "登录" : "注册" }}</el-button
            >
          </el-form-item>
        </el-form>
        <div class="turnTo">
          {{ isLogin === true ? "没有账号？" : "已有账号?" }}&nbsp;
          <!-- <router-link class="toRegister" v-if="isLogin" to="/register"
            >去注册</router-link
          > -->
          <span class="toRegister" v-if="isLogin" @click="toRegister" >去注册</span>
          <!-- <router-link class="toLogin" v-if="!isLogin" to="/login"
            >去登录</router-link
          > -->
          <span class="toLogin" v-if="!isLogin" @click="toLogin" >去登录</span>
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
          callback();
        } else {
          callback(new Error("邮箱格式不正确"));
        }
      }
    };
    return {
      userInfo: {
        username: "",
        email: "",
        password: "",
      },
      rules: {
        username: [{ validator: checkName, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      
    };
  },
  methods: {
    //注册or登录
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.isLogin === true) {
            try {
              let res = await this.$API.user.userLogin({
              email: this.userInfo.email,
              password: this.userInfo.password,
            });
            if (res.code === 200) {
              localStorage.setItem("kumicho_access_token", res.access_token);
              localStorage.setItem("kumicho_refresh_token", res.refresh_token);
              this.$bus.$emit("login");
              this.$router.push("/");
            }
            } catch (error) {
              this.$message({
                message:error[0].msg,
                type: "error",
              });
            }

          } else {
            try {
              let res = await this.$API.user.userRegister(this.userInfo);
              if (res.code === 200) {
                this.userInfo.password=''
                this.$router.push('/login');
                // this.isLogin=true
                let userCollection = {}
                userCollection.user=res.data._id
                await this.$API.collection.createDefault(userCollection)
              }
            } catch (error) {
              this.$message({
                message:error[0].msg,
                type: "error",
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    toRegister(){
      this.$router.push('/register')
    },
    toLogin(){
      this.$router.push('/login')
    }
  },
  computed:{
    isLogin(){
      return this.$route.meta.isLogin
    }
  },
  mounted() {
    
  },
};
</script>

<style lang="less">
.login-view {
  transition: all 0.5s;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--theme_outer_bg_color);
  .login-container {
    transition: inherit;
    width: 495px;
    height: 350px;
    background-color: var(--theme_inner_bg_color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);

    .form-container {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      .title {
        font-size: 30px;
        text-align: center;
      }
      .login-form {
        margin-top: 10px;

        input {
          width: 80%;
        }
      }
      .turnTo {
        width: 84%;
        text-align: right;
        
        .toRegister {
          font-weight: 600;
          transition: 0.2s;
          cursor: pointer;
        }
        .toRegister:hover {
          color: rgb(48, 169, 222);
        }
        .toLogin {
          font-weight: 600;
          transition: 0.2s;
          cursor: pointer;
        }
        .toLogin:hover {
          color: rgb(48, 169, 222);
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