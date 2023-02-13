<template>
  <div class="user-view">
    <div class="userHeader"></div>
    <div class="user-container">
      <div class="navbar-container">
        <div class="navbar-bottom">
          <transition name="infoTransition">
            <div v-if="isShowUserInfoNav" class="userInfo-container">
              <img v-if="oneUserInfo.image" @click="toTop" :src="$myBaseUrl+oneUserInfo.image" alt />
              <span @click="toTop">{{ oneUserInfo.username }}</span>
            </div>
          </transition>
          <ul class="router-nav">
            <li>
              <router-link :to="{name:'userArticle'}" exact>文章</router-link>
            </li>
            <li v-if="isLoginUser">
              <router-link :to="{name:'auditIng'}" exact>待审核</router-link>
            </li>
            <li>
              <router-link :to="{name:'articleCollections'}">合集</router-link>
            </li>
            <li>
              <router-link :to="{name:'userTrends'}" exact>动态</router-link>
            </li>
            <li>
              <router-link :to="{name:'userConcern'}" exact>关注</router-link>
            </li>
            <li>
              <router-link :to="{name:'userFans'}" exact>粉丝</router-link>
            </li>
            <li>
              <router-link :to="{name:'userInfo',params:{oneUserInfo} }" exact>个人资料</router-link>
            </li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="main-container">
        <div class="left-part">
          <div class="img-container">
            <img v-if="oneUserInfo.image" :src="$myBaseUrl+oneUserInfo.image" alt />
          </div>
          <div class="easyMessageBox">
            <div
              v-loading="!oneUserInfo.username"
              element-loading-background="rgba(0, 0, 0, 0)"
              class="userName"
            >{{ oneUserInfo.username }}</div>
            <input
              @click="concernOneUser"
              v-if="!isLoginUser&&isConcern===false"
              class="btn btn-block"
              type="submit"
              value="关注"
            />
            <input
              @click="concernOneUser"
              v-if="!isLoginUser&&isConcern"
              class="btn btn-block"
              type="submit"
              value="已关注"
            />
            <input
              v-if="isLoginUser"
              class="btn btn-block"
              type="submit"
              value="个人设置"
              @click="toSettingView"
            />
          </div>
        </div>
        <div class="right-part">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const headerNav = document.querySelector(".header");
export default {
  name: "UserView",
  data() {
    return {
      isShowUserInfoNav: false,
      oneUserInfo: {},
      isConcern: false
    };
  },

  methods: {
    updateHeaderStyle() {
      headerNav.style.position = "absolute";
    },
    clearHeaderStyle() {
      headerNav.style.position = "fixed";
    },
    changeNav() {
      const osTop =
        document.documentElement.scrollTop || document.body.srcollTop;
      if (osTop >= 400) {
        this.isShowUserInfoNav = true;
      } else {
        this.isShowUserInfoNav = false;
      }
    },
    async getUserViewInfo() {
      try {
        await this.$store.dispatch("getOneUserInfo", this.userId);
        this.oneUserInfo = this.$store.state.user.oneUserInfo;
      } catch (error) {}
    },
    toSettingView() {
      this.$router.push("/userSetting");
    },
    //关注
    async concernOneUser() {
      if(!this.myId) return this.$router.push("/login")
      const fans = {};
      fans.ofUser = this.userId;
      const ret = await this.$API.user.concernOneUser(fans);
      if (ret.code === 200) {
        this.$message({
          type: "success",
          message: "关注成功"
        });
        this.getConcernStatus();
      } else if (ret.code === 202) {
        this.$message({
          type: "success",
          message: "取消关注成功"
        });
        this.getConcernStatus();
      }
    },
    //获取关注状态
    async getConcernStatus() {
      if (this.$store.state.user.userInfo._id) {
        const ret = await this.$API.user.getConcernStatus(this.userId);
        if (ret.code === 200) {
          this.isConcern = ret.isConcern;
        }
      }
    },
    toTop() {
      window.scrollTo(0, 0);
    }
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    },
    myId() {
      return this.$store.state.user.userInfo._id;
    },
  },
  watch: {
    isLoginUser() {
      this.getUserViewInfo();
    },
    $route(to, from) {
      if (this.$route.params.userId) {
        this.getUserViewInfo();
        if (this.$store.state.user.userInfo._id) {
          this.getConcernStatus();
        }
      }
    }
  },
  mounted() {
    this.updateHeaderStyle();
    window.addEventListener("scroll", this.changeNav);
    this.getUserViewInfo();
    if (this.$store.state.user.userInfo._id) {
      this.getConcernStatus();
    }
  },
  beforeDestroy() {
    this.clearHeaderStyle();
    this.$store.state.user.oneUserInfo = {};
    window.removeEventListener("scroll", this.changeNav);
  }
};
</script>

<style lang="less" scoped>
.user-view {
  min-width: 1531px;
  min-height: 100vh;
  background-color: var(--theme_userView);
  position: relative;
  .userHeader {
    transition: all 0.5s;
    width: 100%;
    height: 64px;
    background-color: var(--theme_userView);
  }
  .user-container {
    transition: all 0.5s;
    background-color: var(--theme_userView);
    .navbar-container {
      z-index: 1;
      background-color: var(--theme_userView);
      transition: all 0.5s;
      width: 100%;
      height: 72px;
      position: sticky !important;
      top: -24px;
      .navbar-bottom {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 31px;
        padding-left: 300px;
        .router-nav {
          font-weight: 600;
          .router-link-active {
            color: var(--theme_search_input_blue_color);
          }
          a {
            transition: all 0.3s;
          }
          a:hover {
            color: var(--theme_search_input_blue_color);
          }
        }

        .infoTransition-enter-active,
        .infoTransition-leave-active {
          transition: opacity 0.3s;
        }

        .infoTransition-enter, .infoTransition-leave-to /* .infoTransition-leave-active below version 2.1.8 */ {
          opacity: 0;
        }

        .userInfo-container {
          width: 150px;
          position: relative;
          left: -70px;
          top: -5px;
          display: inline-block;
          img {
            border-radius: 50%;
            width: 32px;
            margin-right: 10px;
            cursor: pointer;
          }
          span {
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
          }
        }
        ul {
          // width: 70%;
          // position: absolute;
          // top: -5px;
          // margin: 0 auto;
          width: 919px;
          float: right;
          line-height: 24px;
          li {
            display: inline-block;
            margin-left: 10px;
            margin-right: 50px;
            cursor: pointer;
          }
        }
        padding-right: 150px;
      }
      .line {
        position: absolute;
        bottom: 0px;
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        background-color: rgb(131, 130, 130);
      }
    }
    .main-container {
      width: 1225px;
      margin: 20px auto;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .left-part {
        width: 281px;
        height: 100%;
        float: left;
        margin-right: 10px;
        .img-container {
          width: 100%;
          cursor: pointer;
          z-index: 1;
          position: relative;
          top: -50px;
          img {
            width: 97%;
            border-radius: 50%;
            border: 1px solid rgba(131, 130, 130, 0.388);
          }
        }
        .easyMessageBox {
          position: relative;
          top: -30px;
          .userName {
            font-size: 20px;
            font-style: normal;
            font-weight: 300;
            line-height: 24px;
          }
          .btn {
            transition: all 0.5s;
            font-size: 14px;
            background-color: var(--theme_userView_btn_bg);
            color: var(--theme_userView_btn_text);
            border: var(--theme_userView_btn_border);
          }
          .btn-block {
            height: 30px;
            width: 100%;
            font-weight: 600;
            line-height: 15px;
            display: block;
            margin-top: 15px;
            box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%),
              0 2px 10px 0 rgb(0 0 0 / 12%);
          }
          .btn:hover {
            background-color: var(--theme_userView_btn_bg_hover);
          }
        }
      }
      .right-part {
        width: 918px;
        min-height: 609px;
        float: right;
        padding-left: 10px;
        margin-top: -20px;
      }
    }
  }
  .user-container::after,
  .user-container::before {
    content: "";
    display: table;
  }

  .user-container::after {
    clear: both;
  }
}
</style>