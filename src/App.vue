<template>
  <div class="outer">
    <Header></Header>
    <transition name="fade-transform" mode="out-in">
      <router-view key="key"></router-view>
    </transition>
    <Footer></Footer>
  </div>
</template>
<script>
  const Header = () => import("./components/Header");
  const Footer = () => import("./components/Footer");
  export default {
    name: "App",
    data() {
      return {};
    },
    components: {
      Header,
      Footer
    },
    computed: {},
    methods: {},
    mounted() { }
  };
</script>
<style >
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
<style lang="less">
:root {
  // //外背景
  // --theme_outer_bg_color: rgb(246, 246, 246);
  // //内背景
  // --theme_inner_bg_color: white;
  // //文字颜色
  // --theme_font_color:rgba(0, 0, 0, 0.763);
  // --theme_navbar_btn_color:black;
  // --theme_headerScroll:rgba(255, 255, 255, 0.874);
  // --theme_search_line_color:#dee2e6;
  // --theme_search_data_title_hover_bg:rgb(54,65,81);
  --theme_search_input_blue_color: rgb(66, 133, 244);
}

body {
  background-color: var(--theme_outer_bg_color) !important;
  // overflow-x: hidden;
}



/* 滚动条整体部分 */
::-webkit-scrollbar {
  width: 5px;
  height: 0px;
}

/* 外层轨道 */
::-webkit-scrollbar-track {
  background: var(--theme_inner_bg_color);
}

/* 滚动条可以拖动的那部分 */
::-webkit-scrollbar-thumb {
  background: #787878;
  border-radius: 5px;
}

/* 点击滚动条的时候改变背景颜色 */
::-webkit-scrollbar-thumb:active {
  background: #5a5959;
}

/* 边角 */
::-webkit-scrollbar-corner {
  background: #787878;
}

.outer {
  clear: both;
  color: var(--theme_font_color);

  a {
    text-decoration: none;
    color: inherit; //设置为继承父元素颜色
  }

  a:link {
    text-decoration: none;
  }

  a:visited {
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
    color: var(--theme_search_input_blue_color) !important;
  }

  a:active {
    text-decoration: none;
  }

  a:focus {
    text-decoration: none;
  }
}

.outer::after,
.outer::before {
  content: "";
  display: table;
}

.outer::after {
  clear: both;
}
</style>
