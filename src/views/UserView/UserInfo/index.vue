<template>
  <div class="user-info">
    <div class="user-info-title">基本资料</div>
    <div class="my-line"></div>
    <div class="user-info-content">
      <div class="user-info-name">
        <span>用户昵称</span>
        &nbsp;&nbsp;
        <span>{{oneUserInfo.username}}</span>
      </div>
      <div class="user-info-bio">
        <span>个性签名</span>
        &nbsp;&nbsp;
        <span>{{oneUserInfo.bio||'这个人很神秘，什么都没有留下。'}}</span>
      </div>
      <div class="user-birthday">
        <span>出生日期</span>
        &nbsp;&nbsp;
        <span>{{oneUserInfo.birthday||'未设置'}}</span>
      </div>
      <div class="user-gender">
        <span>性别</span>
        &nbsp;&nbsp;
        <span>{{oneUserInfo.gender||'未设置'}}</span>
      </div>
    </div>
  </div>
</template>
  
<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
export default {
  name: "UserInfo",
  data() {
    return {
      
    };
  },
  computed:{
    oneUserInfo(){
      const info = this.$store.state.user.oneUserInfo 
      if(info.birthday){
        info.birthday = dayjs(info.birthday).format("YYYY/MM/DD");
      }
      if(info.gender===1){
        info.gender='男'
      }else if(info.gender===2){
        info.gender='女'
      }else if(info.gender===3){
        info.gender='保密'
      }
      return info 
    }
  },
  methods: {
   
  },
  mounted(){
   
  }
};
</script>
  
<style lang="less">
.user-info-title {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 21px;
  font-weight: 600;
}
.my-line {
  width: 80%;
  height: 1px;
  transform: scaleY(0.5);
  background-color: rgb(131, 130, 130);
}
.user-info-content {
  height: 536px;
  margin-top: 20px;
  .user-info-name {
    margin-bottom: 20px;
  }
  .user-info-bio {
    margin-bottom: 20px;
  }
  .user-birthday {
    margin-bottom: 20px;
  }
  .user-gender {
    span {
      margin-right: 2rem;
    }
  }
}
</style>