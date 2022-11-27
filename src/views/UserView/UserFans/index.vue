<template>
  <div class="user-fans">
    <div class="title">
      <div class="inner-title">{{isLoginUser?'我':'Ta'}}的粉丝</div>
      <div class="title-message">有{{fansCount}}位用户正在关注{{isLoginUser?'你':'Ta'}}</div>
    </div>
    <div class="line"></div>
    <div class="fans-container">
      <div v-for="(item,index) in fansList" :key="item._id" class="data-item">
        <div class="data-container">
          <div class="side-bar"></div>
          <img @click="toUserView(item._id)" class="user-img" :src="$myBaseUrl+item.image"></img>
          <div class="message-container" >
            <span @click="toUserView(item._id)" class="user-name" >{{item.username}}</span>
            <div  class="user-bio" >{{item.bio}}</div>
          </div>
          <i @click="toEdit(index)" class="myIcon el-icon-more"></i>
          <div @mouseleave="closeEditBox(index)" ref="editBox" class="to-edit-fans">
            <span>发消息</span>
          </div>
        </div>
      </div>
    </div>
    <div class="hasNoConcern-message" v-if="fansCount===0">还没有人关注{{isLoginUser?'你':'Ta'}}哦~</div>
  </div>
</template>
  
  <script>
export default {
  name: "UserFans",
  data() {
    return {
      fansList:[],
      preIndex:null,
      fansCount:null
    };
  },
  computed: {
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    }
  },
  methods: {
    async getFansList(){
      let ret 
      if(this.isLoginUser){
        ret = await this.$API.user.getFansList(this.$store.state.user.userInfo._id)
      }else{
        ret = await this.$API.user.getFansList(this.$route.params.userId)
      }
      if(ret.code===200){
        this.fansList = ret.fansList
        this.fansCount = ret.fansCount
      }
    },
    toEdit(index){
      if(this.preIndex!=null){
        this.$refs.editBox[this.preIndex].style.display = 'none'
      }
      this.$refs.editBox[index].style.display = 'block'
      this.preIndex = index
    },
    closeEditBox(index){
      this.$refs.editBox[index].style.display = 'none'
    },
    //跳转关注用户主页
    toUserView(userId) {
      this.$router.push({
        name: "userView",
        params: {
          userId
        }
      });
    }
  },
  mounted(){
    this.getFansList()
  }
};
</script>
  
<style lang="less">
.user-fans {
  min-height: 580px;
  .title {
    font-size: 18px;
    margin-top: 15px;
    margin-bottom: 15px;
    cursor: default;
    .inner-title {
      float: left;
    }
    .title-message {
      float: right;
      margin-right: 6px;
      font-size: 16px;
      margin-top: 3px;
    }
    &:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  }
  .line {
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
    background-color: rgb(131, 130, 130);
  }
  .fans-container {
    width: 100%;
    margin-bottom: 25px;
    .data-item {
      margin-top: 20px;
      margin-bottom: 20px;
      transition: all 0.4s;
      .data-container {
        transition: all 0.5s;
        height: 80px;
        font-weight: 600;
        position: relative;
        .side-bar {
          width: 3px;
          height: 80px;
          float: left;
          background-color: rgb(13, 71, 161);
        }
        .user-img {
          float: left;
          width: 50px;
          border-radius: 50%;
          line-height: 50px;
          margin-left: 20px;
          margin-top: 40px;
          transform: translateY(-50%);
          cursor: pointer;
        }
        .message-container {
          float: left;
          margin-top: 40px;
          transform: translateY(-50%);
          margin-left: 8px;
          .user-name {
            font-weight: 600;
            cursor: pointer;
            transition: color 0.4s;
            &:hover {
              color: var(--theme_search_input_blue_color);
            }
          }
          .user-bio {
            font-weight: 500;
            cursor: default;
          }
        }
        .myIcon {
          float: right;
          margin-top: 45px;
          margin-right: 5px;
          cursor: pointer;
          transition: color 0.4s;
          &:hover{
            color: var(--theme_search_input_blue_color);
          }
        }
        .to-edit-fans {
          display: none;
          z-index: 100;
          position: absolute;
          border-radius: 6px;
          top: 62px;
          right: 5px;
          width: 80px;
          color: rgba(34, 34, 34, 0.785);
          background-color: white;
          box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%), 0 2px 5px 0 rgb(0 0 0 / 19%);
          text-align: center;
          line-height: 27px;
          span {
            font-size: 14px;
            width: 100%;
            font-weight: 550;
            height: 27px;
            border-radius: 6px;
            display: inline-block;
            cursor: pointer;
          }
          span:hover {
            background-color: whitesmoke;
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
    .data-item:hover {
      background-color: var(--theme_search_data_title_hover_bg);
    }
  }
}
.hasNoConcern-message {
  font-size: 18px;
}
</style>