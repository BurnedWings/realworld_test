<template>
  <div class="right">
    <div class="right-top">收到的赞</div>
    <div class="right-main">
      <div v-for="(kudos,index) in kudosList" :key="kudos._id" class="main-item">
        <div class="data-item">
          <div class="data-container">
            <div class="side-bar"></div>
            <img class="user-img" :src="$myBaseUrl+kudos.user.image" />
            <div class="item-message-container">
              <span class="user-name">{{kudos.user.username}}</span>
              <span class="item-title" v-if="kudos.article||kudos.article===null">点赞了你的文章</span>
              <span class="item-title" v-if="kudos.trend||kudos.trend===null">点赞了你的动态</span>
              <span class="item-title" v-if="kudos.comment||kudos.comment===null">点赞了你的评论</span>
              <span class="item-title" v-if="kudos.reply||kudos.reply===null">点赞了你的评论</span>
              <span class="item-title" v-if="kudos.trendComment||kudos.trendComment===null">点赞了你的评论</span>
              <span class="item-title" v-if="kudos.trendReply||kudos.trendReply===null">点赞了你的评论</span>
              <br />
              <span class="user-bio">{{$dayjs(kudos.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
            </div>
            <div class="own-message">
              <span v-if="kudos.article||kudos.article===null">{{kudos.article?kudos.article.title:'该文章已被删除'}}</span>
              <span v-if="kudos.trend||kudos.trend===null">{{kudos.trend?kudos.trend.body:'该动态已被删除'}}</span>
              <span v-if="kudos.comment||kudos.comment===null">{{kudos.comment?kudos.comment.body:'该评论已被删除'}}</span>
              <span v-if="kudos.reply||kudos.reply===null">{{kudos.reply?kudos.reply.body:'该评论已被删除'}}</span>
              <span v-if="kudos.trendComment||kudos.trendComment===null">{{kudos.trendComment?kudos.trendComment.body:'该评论已被删除'}}</span>
              <span v-if="kudos.trendReply||kudos.trendReply===null">{{kudos.trendReply?kudos.trendReply.body:'该评论已被删除'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Kudos",
  data() {
    return {
      kudosList: null
    };
  },
  computed: {},
  methods: {
    async getKudos() {
      const ret = await this.$API.message.getKudos();
      if (ret.code === 200) {
        this.kudosList = ret.kudosArr;
      }
    },
    async changeUnCheckedKudos(){
      const ret = await this.$API.message.changeUnCheckedKudos()
      if(ret.code===200){
        this.$store.dispatch("getTotalCount");
      }
    }
  },
  mounted() {
    this.getKudos();
    if(this.$store.state.user.kudos>0){
      this.changeUnCheckedKudos()
    }  
  }
};
</script>

<style lang='less' scoped>
.right {
  width: 910px;
  height: 100%;
  float: right;
  transition: all 0.3s;
  .right-top {
    width: 100%;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
    height: 50px;
    background-color: var(--theme_inner_bg_color);
    margin-top: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 24%), 0 3px 5px 0 rgb(0 0 0 / 19%);
    transition: background-color 0.3s;
  }
  .right-main {
    width: 100%;
    height: 615px;
    overflow-y: auto;
    background-color: var(--theme_inner_bg_color);
    border-radius: 5px;
    transition: background-color 0.3s;
    box-shadow: 0 3px 5px 0 rgb(0 0 0 / 24%), 0 5px 5px 0 rgb(0 0 0 / 19%);
    .main-item {
      margin-top: 20px;
      &:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      .data-item {
        margin-bottom: 0px;
        // transition: all 0.4s;
        .data-container {
          // transition: all 0.5s;
          font-weight: 600;
          position: relative;
          height: 70px;
          .own-message {
            position: absolute;
            right: 0;
            top: 5px;
            width: 65px;
            height: 66px;
            line-height: 13px;
            font-weight: 300;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            cursor: default;
          }
          &:after {
            /*伪元素是行内元素 正常浏览器清除浮动方法*/
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
          }
          .side-bar {
            width: 3px;
            height: 70px;
            float: left;
            background-color: rgb(13, 71, 161);
          }
          .user-img {
            float: left;
            width: 50px;
            border-radius: 50%;
            line-height: 50px;
            margin-left: 20px;
            margin-top: 35px;
            transform: translateY(-50%);
            cursor: pointer;
          }
          .item-message-container {
            float: left;
            margin-top: 35px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 14px;
            line-height: 24px;
            max-height: 70px;
            transform: translateY(-50%);
            margin-left: 8px;
            width: 820px;
            &:after {
              /*伪元素是行内元素 正常浏览器清除浮动方法*/
              content: "";
              display: block;
              height: 0;
              clear: both;
              visibility: hidden;
            }
            .user-name {
              font-weight: 600;
              cursor: pointer;
              // transition: color 0.4s;
              margin-left: 2px;
              &:hover {
                color: var(--theme_search_input_blue_color);
              }
            }
            .item-title {
              margin-left: 10px;
              cursor: pointer;
            }
            .user-bio {
              font-weight: 500;
              cursor: default;
            }
          }
        }
      }
      .data-item:hover {
        background-color: var(--theme_search_data_title_hover_bg);
      }
    }
  }
  .right-main::-webkit-scrollbar {
    width: 3px;
  }
}
</style>