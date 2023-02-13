<template>
  <div>
    <header class="header container-fluid">
      <a class="header_logo" @click="toTop">
        <strong>Kumicho Forum</strong>
      </a>
      <ul class="navbar">
        <li class="nav_item" @click="toHome">
          <a>首页</a>
        </li>
        <li class="nav_item" @click="toMessageView">
          <el-badge :hidden="unCheckedCount===0" :value="unCheckedCount" class="item">
            <a>消息</a>
          </el-badge>
        </li>
        <li class="nav_item" @click="toTrendsView">
          <a>动态</a>
        </li>
        <li class="nav_item" @click="toCollectionView">
          <a>收藏</a>
        </li>
        <li class="nav_item" @click="toCreateArticle">
          <a>创作中心</a>
        </li>
        <li class="nav_item" @click="showSearchView">
          <a>
            <i class="el-icon-search"></i>
          </a>
        </li>
        <li class="nav_item" @click="changeTheme">
          <a @mouseenter="mouseIn" @mouseleave="mouseOut">
            <i v-if="lightTheme" ref="themeSunIcon" class="el-icon-sunny"></i>
            <i v-if="darkTheme" ref="themeMoonIcon" class="el-icon-moon"></i>
          </a>
        </li>
        <li v-if="!userInfo" class="nav_item" @click="toLogin">
          <a>登录/注册</a>
        </li>
        <li v-else class="nav_item" @click="showSelect">
          <a>
            <img v-if="userInfo" :src="$myBaseUrl+userInfo.image" alt />
            <div class="select-button"></div>
          </a>
        </li>
      </ul>
      <button class="my-navbar-btn" @click="changeVertical">
        <div class="my-animated-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div class="my-navbar-container">
        <ul class="my-vertical-navbar">
          <li class="nav_item">
            <a>首页</a>
          </li>
          <li class="nav_item">
            <a>消息</a>
          </li>
          <li class="nav_item">
            <a>动态</a>
          </li>
          <li class="nav_item">
            <a>收藏</a>
          </li>
          <li class="nav_item">
            <a>创作中心</a>
          </li>
          <li class="nav_item">
            <a>搜索</a>
          </li>
          <li class="nav_item" @click="changeTheme">
            <a>切换</a>
          </li>
          <li v-if="!userInfo" @click="toLogin" class="nav_item">
            <a>登录/注册</a>
          </li>
          <li v-else class="nav_item" @click="showSelect">
            <a>
              <img v-if="userInfo" :src="$myBaseUrl+userInfo.image" alt />
            </a>
          </li>
        </ul>
      </div>
    </header>
    <div class="select-background" @click="closeSelect"></div>
    <div v-if="isShowSelect" class="select-container">
      <div class="top-one"></div>
      <div class="top-two"></div>
      <div class="bottom">
        <div @click="toUserView">
          <div class="bottom-title">当前登录用户</div>
          <div v-if="userInfo" class="bottom-title">{{ userInfo.username }}</div>
        </div>
        <div class="line-one"></div>
        <ul class="bottom-ul-one">
          <li @click="toUserView">
            <span>我的主页</span>
          </li>
          <li @click="toUserTrendsView">
            <span>我的动态</span>
          </li>
          <li @click="toUserConcernView">
            <span>我的关注</span>
          </li>
          <li @click="toUserFansView">
            <span>我的粉丝</span>
          </li>
          <li @click="toUserInfoView">
            <span>个人资料</span>
          </li>
          <li @click="toSettingView">
            <span>账号设置</span>
          </li>
        </ul>
        <div class="line-two"></div>
        <ul class="bottom-ul-two">
          <li @click="logout">
            <span>退出登录</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- <div class="search-view">
      <div class="background-container" @click="closeSearchView"></div>
      <div v-if="isSearchContainerShow" class="search-container">
        <div class="title">
          Search
          <i class="search-container-icon el-icon-close" @click="closeSearchView"></i>
        </div>
        <div class="title-line"></div>
        <div class="search-input">
          <div class="search-input-title">keyword</div>
          <input
            ref="searchInput"
            type="text"
            @focus="changeInputTitleColor"
            @blur="removeInputTitleColor"
            @input="inputValueChange"
            v-model="inputInfo"
          />
          <div class="input-line"></div>
        </div>
        <div class="search-data-view">
          <div class="data-item" v-for="(article, index) in searchArticleArr" :key="article._id">
            <div class="data-title" @click="toDetailArticleView(article._id)">
              <div class="side-bar"></div>
              <div class="title-content">{{ article.title }}</div>
            </div>
            <div class="data-description">{{ article.description }}</div>
          </div>
        </div>
      </div>
    </div>-->
    <el-dialog class="my-dialog" title="Search" center :visible.sync="dialogTableVisible">
      <!-- <div class="search-container">
        
      </div>-->
      <!-- <div class="title">
          Search
          <i class="search-container-icon el-icon-close" @click="closeSearchView"></i>
      </div>-->
      <div class="title-line"></div>
      <div class="search-input">
        <div class="search-input-title">keyword</div>
        <input
          ref="searchInput"
          type="text"
          @focus="changeInputTitleColor"
          @blur="removeInputTitleColor"
          @input="inputValueChange"
          v-model="inputInfo"
        />
        <div class="input-line"></div>
      </div>
      <div class="search-data-view">
        <div class="data-item" v-for="(article, index) in searchArticleArr" :key="article._id">
          <div class="data-title" @click="toDetailArticleView(article._id)">
            <div class="side-bar"></div>
            <div class="title-content">{{ article.title }}</div>
          </div>
          <div class="data-description">{{ article.description }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Header",
  data() {
    return {
      // modeChangeCount: 0,
      navChangeCount: 0,
      darkTheme: null,
      lightTheme: null,
      inputInfo: "",
      searchArticleArr: [],
      isShowSelect: false,
      dialogTableVisible: false
    };
  },
  computed: {
    userInfo() {
      if (this.$store.state.user.userInfo._id) {
        return this.$store.state.user.userInfo;
      } else {
        return null;
      }
    },
    unCheckedCount() {
      return this.$store.state.user.totalCount;
    }
  },
  methods: {
    toTop() {
      window.scrollTo(0, 0);
    },
    //ok
    changeNavbar() {
      const headerNav = document.querySelector(".header");
      const osTop =
        document.documentElement.scrollTop || document.body.srcollTop;
      if (osTop) {
        headerNav.classList.add("headerScroll");
      } else {
        headerNav.classList.remove("headerScroll");
      }
    },
    //ok
    screenResize() {
      if (window.innerWidth >= 756) {
        document
          .querySelector(".header")
          .classList.remove("my-vertical-header");
      } else if (window.innerWidth < 756 && this.navChangeCount % 2 != 0) {
        document.querySelector(".header").classList.add("my-vertical-header");
      }
    },
    //ok
    changeVertical() {
      this.navChangeCount++;
      const navSpan = document.querySelectorAll(".my-animated-icon > span");
      if (this.navChangeCount % 2 != 0) {
        //侧边栏按钮动画
        navSpan[0].classList.add("first-span");
        navSpan[1].classList.add("second-span");
        navSpan[2].classList.add("third-span");
        document
          .querySelector(".my-animated-icon")
          .classList.add("icon-change");
        document.querySelector(".my-navbar-container").style.opacity = 1;
        document.querySelector(".header").classList.add("my-vertical-header");
      } else {
        navSpan[0].classList.remove("first-span");
        navSpan[1].classList.remove("second-span");
        navSpan[2].classList.remove("third-span");
        document
          .querySelector(".my-animated-icon")
          .classList.remove("icon-change");
        document.querySelector(".my-navbar-container").style.opacity = 0;
        document
          .querySelector(".header")
          .classList.remove("my-vertical-header");
      }
    },
    //更换主题()
    changeTheme() {
      const theme = {
        dark: {
          "--theme_outer_bg_color": "rgb(24,28,39)",
          "--theme_inner_bg_color": "rgb(37,45,56)",
          "--theme_font_color": "#c9d1d9",
          "--theme_navbar_btn_color": "rgb(196, 198, 201)",
          "--theme_vertical_header": "rgba(47, 65, 84, 0.7)",
          "--theme_headerScroll": "rgba(24,28,39, 0.5)",
          "--theme_userHeader": "rgb(24,28,39)",
          "--theme_userView": "rgb(24,28,39)",
          "--theme_userView_btn_bg": "#21262d",
          "--theme_userView_btn_text": "#c9d1d9",
          "--theme_userView_btn_bg_hover": "rgb(48,54,61)",
          "--theme_search_line_color": "#838282",
          "--theme_search_data_title_hover_bg": "rgb(54,65,81)",
          "--theme_search_view_bg_color": "rgb(37,45,56)"
        },
        light: {
          "--theme_outer_bg_color": "rgb(246, 246, 246)",
          "--theme_inner_bg_color": "white",
          "--theme_font_color": "rgba(0, 0, 0, 0.763)",
          "--theme_navbar_btn_color": "rgba(0, 0, 0, 0.763)",
          "--theme_vertical_header": "rgba(255, 255, 255, 0.874)",
          "--theme_headerScroll": "rgba(255, 255, 255, 0.874)",
          "--theme_userHeader": "rgb(246, 246, 246)",
          "--theme_userView": "rgb(246, 246, 246)",
          "--theme_userView_btn_bg": "rgb(252, 252, 252)",
          "--theme_userView_btn_text": "#24292f",
          "--theme_userView_btn_border": "none",
          "--theme_userView_btn_bg_hover": "rgb(255, 255, 255)",
          "--theme_search_line_color": "#dee2e6",
          "--theme_search_data_title_hover_bg": "rgb(248,249,250)",
          "--theme_search_view_bg_color": "white"
        }
      };
      if (this.lightTheme) {
        for (const item in theme.dark) {
          document.documentElement.style.setProperty(item, theme.dark[item]);
        }
        this.lightTheme = null;
        this.darkTheme = true;
        localStorage.setItem("darkTheme", JSON.stringify(theme.dark));
        localStorage.removeItem("lightTheme");
      } else if (this.darkTheme) {
        for (const item in theme.light) {
          document.documentElement.style.setProperty(item, theme.light[item]);
        }
        this.darkTheme = null;
        this.lightTheme = true;
        localStorage.setItem("lightTheme", JSON.stringify(theme.light));
        localStorage.removeItem("darkTheme");
      }
    },
    //初始化主题()
    defaultTheme() {
      const darkTheme = JSON.parse(localStorage.getItem("darkTheme"));
      const lightTheme = JSON.parse(localStorage.getItem("lightTheme"));
      if (darkTheme) {
        this.darkTheme = true;
        for (const item in darkTheme) {
          document.documentElement.style.setProperty(item, darkTheme[item]);
        }
      } else if (lightTheme) {
        this.lightTheme = true;
        for (const item in lightTheme) {
          document.documentElement.style.setProperty(item, lightTheme[item]);
        }
      } else if (!darkTheme && !lightTheme) {
        const defaultTheme = {
          "--theme_outer_bg_color": "rgb(246, 246, 246)",
          "--theme_inner_bg_color": "white",
          "--theme_font_color": "rgba(0, 0, 0, 0.763)",
          "--theme_navbar_btn_color": "black",
          "--theme_vertical_header": "rgba(255, 255, 255, 0.874)",
          "--theme_headerScroll": "rgba(255, 255, 255, 0.874)",
          "--theme_userHeader": "rgb(246, 246, 246)",
          "--theme_userView": "rgb(246, 246, 246)",
          "--theme_userView_btn_bg": "rgb(252, 252, 252)",
          "--theme_userView_btn_text": "#24292f",
          "--theme_userView_btn_border": "none",
          "--theme_userView_btn_bg_hover": "rgb(255, 255, 255)",
          "--theme_search_line_color": "#dee2e6",
          "--theme_search_data_title_hover_bg": "rgb(248,249,250)",
          "--theme_search_view_bg_color": "white"
        };
        for (const item in defaultTheme) {
          document.documentElement.style.setProperty(item, defaultTheme[item]);
        }
        localStorage.setItem("lightTheme", JSON.stringify(defaultTheme));
        this.lightTheme = true;
      }
    },
    //ok
    toLogin() {
      this.$router.push("/login");
    },
    //ok
    toHome() {
      this.$router.push("/");
    },
    //跳转文章页面
    toCreateArticle() {
      this.$router.push("/createArticle");
    },
    //跳转userView相关页面
    myToView(routerName) {
      this.$router.push({
        name: routerName,
        params: {
          userId: this.userInfo._id
        }
      });
    },
    //跳转用户信息页面
    async toUserView() {
      this.closeSelect();
      this.myToView("userView");
    },
    //跳转用户动态页面
    toUserTrendsView() {
      this.closeSelect();
      this.myToView("userTrends");
    },
    //跳转用户关注页面
    toUserConcernView() {
      this.closeSelect();
      this.myToView("userConcern");
    },
    toUserInfoView() {
      this.closeSelect();
      this.myToView("userInfo");
    },
    toUserFansView() {
      this.closeSelect();
      this.myToView("userFans");
    },
    //调转用户设置页面
    toSettingView() {
      this.closeSelect();
      this.$router.push({
        name: "userSetting"
      });
    },
    //退出登录
    logout() {
      localStorage.removeItem("kumicho_refresh_token");
      localStorage.removeItem("kumicho_access_token");
      this.closeSelect();
      this.$router.push("/");
      this.$store.dispatch("clearUserInfo");
    },
    //显示下拉框
    showSelect() {
      const hei = document.body.clientHeight;
      const searchBackground = document.querySelector(".select-background");
      searchBackground.style.height = "100vh";
      searchBackground.classList.add("select-background-change");
      this.isShowSelect = true;
    },
    //关闭下拉框
    closeSelect() {
      const searchBackground = document.querySelector(".select-background");
      searchBackground.classList.remove("select-background-change");
      const searchContainer = document.querySelector(".select-container");
      searchContainer.style.animation = "closeSelectContainer 0.5s forwards";
      setTimeout(() => {
        searchBackground.style.height = 0 + "px";
        this.isShowSelect = false;
      }, 500);
    },
    toMessageView() {
      this.$router.push("/messageView");
    },
    toTrendsView() {
      this.$router.push("/trendsView");
    },
    toCollectionView() {
      this.$router.push("/collectionView");
    },
    showSearchView() {
      this.searchArticleArr = [];
      this.inputInfo = "";
      this.dialogTableVisible = true;
      // const hei = document.body.clientHeight;
      // const searchBackground = document.querySelector(".background-container");
      // searchBackground.style.height = hei + "px";
      // searchBackground.classList.add("background-container-change");
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    closeSearchView() {
      this.dialogTableVisible = false;
      
      // const searchBackground = document.querySelector(".background-container");
      // searchBackground.classList.remove("background-container-change");
      // const searchContainer = document.querySelector(".search-container");
      // searchContainer.style.animation = "closeSearchContainer 0.5s forwards";
      // setTimeout(() => {
      //   searchBackground.style.height = 0 + "px";
      //   this.isSearchContainerShow = false;
      //   this.searchArticleArr = [];
      //   this.inputInfo = "";
      // }, 500);
    },
    //输入框获取焦点时改变标题颜色
    changeInputTitleColor() {
      document.querySelector(".search-input-title").style.color =
        "rgb(66,133,244)";
    },
    removeInputTitleColor() {
      document.querySelector(".search-input-title").style.color = "#757575";
    },
    //输入框添加防抖函数（以下是函数的不简写方式）
    inputValueChange: _.debounce(
      //注意箭头函数this指向问题
      async function() {
        if (this.inputInfo.trim() !== "") {
          const ret = await this.$API.article.searchArticle(
            this.inputInfo.trim()
          );
          if (ret.code === 200) {
            this.searchArticleArr = ret.articles;
          }
        }
      },
      1500
    ),
    mouseIn() {
      if (this.darkTheme) {
        this.$refs.themeMoonIcon.classList.remove("el-icon-moon");
        this.$refs.themeMoonIcon.classList.add("el-icon-sunny");
      } else {
        this.$refs.themeSunIcon.classList.remove("el-icon-sunny");
        this.$refs.themeSunIcon.classList.add("el-icon-moon");
      }
    },
    mouseOut() {
      if (this.darkTheme) {
        this.$refs.themeMoonIcon.classList.add("el-icon-moon");
        this.$refs.themeMoonIcon.classList.remove("el-icon-sunny");
      } else {
        this.$refs.themeSunIcon.classList.add("el-icon-sunny");
        this.$refs.themeSunIcon.classList.remove("el-icon-moon");
      }
    },
    toDetailArticleView(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
      this.closeSearchView();
    }
  },
  mounted() {
    //添加防抖函数
    window.addEventListener(
      "scroll",
      _.debounce(this.changeNavbar, 100, { leading: true })
    );
    // window.addEventListener("scroll", this.changeNavbar);
    window.addEventListener("resize", _.debounce(this.screenResize, 100));
    // window.addEventListener("resize", this.screenResize);

    this.defaultTheme();
    this.$store.dispatch("getSwiper");
    this.$store.dispatch("getRecommendArticle");
    if (localStorage.kumicho_access_token) {
      this.$store.dispatch("getUserInfo");
      this.$store.dispatch("getTotalCount");
      this.$store.dispatch("getReportType");
    }
    this.$bus.$on("login", () => {
      this.$store.dispatch("getUserInfo");
      this.$store.dispatch("getTotalCount");
      this.$store.dispatch("getReportType");
    });
  }
};
</script>
<style scoped>
:deep(.el-badge .el-badge__content) {
  border: 0px;
}
</style>
<style lang="less"  >
.my-dialog {
  // .search-container {
  //   width: 50%;
  //   min-height: 270px;
  //   background-color: var(--theme_search_view_bg_color);
  //   position: fixed;
  //   z-index: 1032;
  //   border: 0;
  //   border-radius: 0.125rem;
  //   -webkit-box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%),
  //     0 4px 15px 0 rgb(0 0 0 / 15%);
  //   box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  //   left: 50%;
  //   transform: translateX(-50%);
  //   transition: all 0.5s;
  //   animation-name: showSearchContainer;
  //   animation-duration: 0.5s;
  //   animation-fill-mode: forwards;
  //   .title {
  //     font-size: 20px;
  //     text-align: center;
  //     margin-top: 20px;
  //     margin-bottom: 10px;
  //     .search-container-icon {
  //       position: absolute;
  //       right: 10px;
  //       top: 23px;
  //       cursor: pointer;
  //     }
  //     .search-container-icon:hover {
  //       transition: color 0.5s;
  //       color: rgb(48, 169, 222);
  //     }
  //   }
  //   .title-line {
  //     width: 100%;
  //     height: 1px;
  //     background-color: var(--theme_search_line_color);
  //     margin-bottom: 20px;
  //   }

  // }
  .el-dialog__header {
    background-color: var(--theme_search_view_bg_color);
    .el-dialog__title {
      color: var(--theme_font_color);
    }
  }
  .el-dialog__body {
    background-color: var(--theme_search_view_bg_color);
    color: var(--theme_font_color);
  }
  .search-input {
    width: 90%;
    height: 90px;

    margin: 0 auto;
    .search-input-title {
      font-size: 14px;
      margin-bottom: 10px;
      color: #757575;
    }
    input {
      color: var(--theme_font_color);
      width: 100%;
      outline-style: none;
      height: 40px;
      border: none;
      caret-color: var(--theme_search_input_blue_color);
      background-color: transparent;
    }
    .input-line {
      transition: background-color 0.3s;
      width: 100%;
      height: 1px;
      background-color: var(--theme_search_line_color);
    }
    input:focus + .input-line {
      height: 1.5px;
      background-color: var(--theme_search_input_blue_color);
    }
  }
  .search-data-view {
    width: 90%;
    max-height: 450px;
    overflow-y: auto;
    margin: 0 auto 20px auto;
    .data-item {
      margin-top: 20px;

      .data-title {
        transition: all 0.5s;
        height: 50px;
        font-weight: 600;
        cursor: pointer;
        .side-bar {
          width: 3px;
          height: 50px;
          float: left;
          background-color: rgb(13, 71, 161);
        }
        .title-content {
          float: left;
          height: 50px;
          line-height: 50px;
          margin-left: 20px;
        }
      }
      .data-title:hover {
        background-color: var(--theme_search_data_title_hover_bg);
        color: rgb(48, 169, 222);
      }

      .data-description {
        font-size: 14px;
        margin-left: 22px;
      }
    }
  }
}
.header {
  width: 100%;
  height: 64px;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
  background-color: transparent;
  transition: all 0.3s;
  overflow: hidden;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);

  .header_logo {
    position: absolute;
    float: left;
    left: 20px;
    font-size: 20px;
    left: 8%;
    top: 16px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .navbar {
    padding: 0px;
    width: 450px;
    font-size: 14px;
    position: absolute;
    right: 20px;
    top: 35%;

    .nav_item {
      cursor: pointer;
      a {
        font-weight: 600;
        transition: color 0.3s;

        img {
          width: 30px;
          border-radius: 50%;
        }
        i {
          font-size: 16px;
          font-weight: 600;
        }
        .select-button {
          width: 0px;
          height: 0px;
          border: solid 5px;
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
          float: right;
          margin-top: 15px;
          margin-left: 3px;
        }
      }
    }
  }

  .my-navbar-btn {
    width: 54px;
    height: 35px;
    border: 0px;
    outline: none; //处理刷新诡异边框
    position: absolute;
    right: 10%;
    top: 8px;
    background-color: transparent;

    .my-animated-icon {
      border: none;
      // transition: background-color 0.3s;

      span {
        display: block;
        width: 30.5px;
        height: 4px;
        background-color: var(--theme_navbar_btn_color);
        margin-left: 12px;
        margin-top: 7px;
        border-radius: 12px;
        // transition: background-color 0.3s;
      }

      //四个动画
      .first-span {
        transform-origin: 0 50%;
        transform: rotate(45deg);
      }

      .second-span {
        margin-left: -40px;
        opacity: 0;
      }

      .third-span {
        transform-origin: 0 50%;
        transform: rotate(-45deg);
      }
    }

    .icon-change {
      transform: rotateY(-180deg);
      transform-style: preserve-3d;
      -webkit-transform: rotateY(-180deg);
      /* Safari and Chrome */
      -webkit-transform-style: preserve-3d;
      /* Safari and Chrome */
    }
  }

  //下拉栏
  .my-navbar-container {
    opacity: 0;
    width: 100%;
    height: 430px;
    margin-top: 64px;
    transition: all 1s;
    .my-vertical-navbar {
      text-align: center;

      .nav_item {
        height: 50px;
        cursor: pointer;
        a {
          display: block;
          width: 100%;
          height: 100%;
          font-weight: 600;
          transition: 0.5s;
          img {
            width: 30px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  //导航媒体查询
  @media screen and (max-width: 755.5px) {
    .navbar {
      display: none;
    }
  }

  @media screen and (min-width: 755.5px) {
    //导航按钮媒体查询
    .my-navbar-btn {
      display: none;
    }
    //下拉导航
    .my-navbar-container {
      display: none;
    }
  }
}

@keyframes showSelectContainer {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes closeSelectContainer {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.select-background {
  opacity: 0;
  width: 100%;
  background-color: transparent;
  position: absolute;
  z-index: 1031;
  transition: opacity 0.5s;
}
.select-background-change {
  opacity: 1;
}
.select-container {
  width: 150px;
  height: 280px;
  position: fixed;
  right: 22px;
  top: 54px;
  z-index: 1031;
  animation-name: showSelectContainer;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  //  和top-two叠加产生三角形边框边框
  // .top-one {
  //   transition: all 0.5s;
  //   width: 0px;
  //   height: 0px;
  //   border: 7px solid;
  //   border-bottom-color: rgba(131, 130, 130, 0.388);
  //   border-top-color: transparent;
  //   border-left-color: transparent;
  //   border-right-color: transparent;
  //   top: -9px;
  //   right: 13px;
  //   position: absolute;
  //   z-index: 1033;
  // }
  .top-two {
    transition: all 0.5s;
    width: 0px;
    height: 0px;
    border: 7px solid;
    border-bottom-color: var(--theme_inner_bg_color);
    border-top-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    top: -7.5px;
    right: 13px;
    position: absolute;
    z-index: 1034;
  }
  .bottom {
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    transition: all 0.5s;
    width: 100%;
    height: 100%;
    top: 5px;
    border-radius: 4px;
    position: absolute;
    background-color: var(--theme_inner_bg_color);
    //边框
    // border: 1px solid rgba(131, 130, 130, 0.388);
    z-index: 1032;
    .bottom-title {
      margin-top: 5px;
      margin-bottom: 2.5px;
      margin-left: 10px;
      font-size: 14px;
      cursor: pointer;
    }
    .line-one {
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
      margin-top: 8px;
    }
    .bottom-ul-one {
      position: relative;
      width: 100%;
      font-size: 14px;
      padding: 0;
      li {
        width: 100%;
        margin: 8px 0;
        cursor: pointer;
        span {
          margin-left: 10px;
        }
      }
      li:hover {
        background-color: rgb(66, 133, 244);
      }
    }
    .line-two {
      position: absolute;
      bottom: 35px;
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
      margin-top: 5px;
    }
    .bottom-ul-two {
      position: absolute;
      bottom: -18px;
      width: 100%;
      font-size: 14px;
      padding: 0;
      li {
        width: 100%;
        margin: 8px 0;
        cursor: pointer;
        span {
          margin-left: 10px;
        }
      }
      li:hover {
        background-color: rgb(66, 133, 244);
      }
    }
  }
}

.search-view {
  .background-container {
    opacity: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 1031;
    transition: opacity 0.5s;
  }

  .background-container-change {
    opacity: 1;
  }

  // .search-container {
  //   width: 50%;
  //   min-height: 270px;
  //   background-color: var(--theme_search_view_bg_color);
  //   position: fixed;
  //   z-index: 1032;
  //   border: 0;
  //   border-radius: 0.125rem;
  //   -webkit-box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%),
  //     0 4px 15px 0 rgb(0 0 0 / 15%);
  //   box-shadow: 0 5px 11px 0 rgb(0 0 0 / 18%), 0 4px 15px 0 rgb(0 0 0 / 15%);
  //   left: 50%;
  //   transform: translateX(-50%);
  //   transition: all 0.5s;
  //   animation-name: showSearchContainer;
  //   animation-duration: 0.5s;
  //   animation-fill-mode: forwards;
  //   .title {
  //     font-size: 20px;
  //     text-align: center;
  //     margin-top: 20px;
  //     margin-bottom: 10px;
  //     .search-container-icon {
  //       position: absolute;
  //       right: 10px;
  //       top: 23px;
  //       cursor: pointer;
  //     }
  //     .search-container-icon:hover {
  //       transition: color 0.5s;
  //       color: rgb(48, 169, 222);
  //     }
  //   }
  //   .title-line {
  //     width: 100%;
  //     height: 1px;
  //     background-color: var(--theme_search_line_color);
  //     margin-bottom: 20px;
  //   }
  //   .search-input {
  //     width: 90%;
  //     height: 90px;

  //     margin: 0 auto;
  //     .search-input-title {
  //       font-size: 14px;
  //       margin-bottom: 10px;
  //       color: #757575;
  //     }
  //     input {
  //       color: var(--theme_font_color);
  //       width: 100%;
  //       outline-style: none;
  //       height: 40px;
  //       border: none;
  //       caret-color: var(--theme_search_input_blue_color);
  //       background-color: transparent;
  //     }
  //     .input-line {
  //       transition: background-color 0.3s;
  //       width: 100%;
  //       height: 1px;
  //       background-color: var(--theme_search_line_color);
  //     }
  //     input:focus + .input-line {
  //       height: 1.5px;
  //       background-color: var(--theme_search_input_blue_color);
  //     }
  //   }
  //   .search-data-view {
  //     width: 90%;
  //     max-height: 450px;
  //     overflow-y: auto;
  //     margin: 0 auto 20px auto;
  //     .data-item {
  //       margin-top: 20px;

  //       .data-title {
  //         transition: all 0.5s;
  //         height: 50px;
  //         font-weight: 600;
  //         cursor: pointer;
  //         .side-bar {
  //           width: 3px;
  //           height: 50px;
  //           float: left;
  //           background-color: rgb(13, 71, 161);
  //         }
  //         .title-content {
  //           float: left;
  //           height: 50px;
  //           line-height: 50px;
  //           margin-left: 20px;
  //         }
  //       }
  //       .data-title:hover {
  //         background-color: var(--theme_search_data_title_hover_bg);
  //         color: rgb(48, 169, 222);
  //       }

  //       .data-description {
  //         font-size: 14px;
  //         margin-left: 22px;
  //       }
  //     }
  //   }
  // }
  .search-container-change {
    top: 28px;
  }
  @keyframes showSearchContainer {
    from {
      top: 30px;
      opacity: 0;
    }
    to {
      top: 70px;
      opacity: 1;
    }
  }
  @keyframes closeSearchContainer {
    from {
      top: 70px;
      opacity: 1;
    }
    to {
      top: 30px;
      opacity: 0;
    }
  }
}

//模式切换类(滚动)
.headerScroll {
  background-color: var(--theme_headerScroll);
  height: 50px;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

//导航下拉切换样式
.my-vertical-header {
  background-color: var(--theme_vertical_header);
  height: 464px;
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}
</style>