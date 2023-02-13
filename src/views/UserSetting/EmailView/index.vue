<template>
  <div class="email-view">
    <div class="title">我的邮箱</div>
    <div class="line"></div>
    <div class="email-message">
      默认接受通知邮箱
      <br />
      <span>{{mainEmail}}</span>
    </div>
    <div class="add-email">
      <div>添加邮箱</div>
      <br />
      <div class="left-part">
        <div class="info-item">
          <span>邮箱</span>
          <input v-model="email" type="text" />
          <div class="input-line"></div>
        </div>
        <div class="info-item">
          <span>验证码</span>
          <input v-model="captcha" type="text" />
          <div class="input-line"></div>
        </div>
      </div>
      <div class="right-part">
        <div @click="sendUpdatePasswordCaptcha" class="captcha-container">
          <i class="my-plane el-icon-s-promotion"></i>
          <div class="captcha-button">发送验证码</div>
        </div>
        <div class="button">
          <el-button @click="addEmail" type="primary" size="small">添加邮箱</el-button>
        </div>
      </div>
    </div>
    <div class="select-email">
      <div class="select-item-two">
        <span>备用邮箱</span>
        <el-select v-model="spareEmail" placeholder="请选择">
          <el-option
            v-for="(item,index) in emailList"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-button @click="updateSpareEmail" type="primary" size="small">保存</el-button>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "EmailView",
  data() {
    return {
      email: null,
      captcha: null,
      canSendCaptcha: true,
      emailList:null,
      spareEmail:null,
      targetSpareEmail:null
    };
  },
  computed: {
    mainEmail() {
      return this.$store.state.user.userInfo.email;
    }
  },
  methods: {
    //添加邮箱
    async addEmail() {
      if (!this.email) {
        return this.$message({
          type: "warning",
          message: "你还没有输入邮箱"
        });
      }
      if (!this.captcha) {
        return this.$message({
          type: "warning",
          message: "你还没有输入验证码"
        });
      }
      const ret = await this.$API.user.addEmail(this.email, this.captcha);
      if (ret.code === 200) {
        this.email = null;
        this.captcha = null;
        this.$message({
          type: "success",
          message: "添加成功"
        });
      } else {
        this.$message({
          type: "error",
          message: ret.message
        });
      }
    },
    //发送验证码
    async sendUpdatePasswordCaptcha() {
      if (this.canSendCaptcha) {
        const ret = await this.$API.user.sendUpdatePasswordCaptcha();
        if (ret.code === 200) {
          this.$message({
            type: "success",
            message: "验证码发送成功"
          });
          this.canSendCaptcha = false;
          setTimeout(() => {
            this.canSendCaptcha = true;
          }, 60000);
        }
      } else {
        this.$message({
          type: "warning",
          message: "操作太频繁了哦亲"
        });
      }
    },
    //获取邮箱列表
    async getEmailList(){
      const ret = await this.$API.user.getEmailList()
      if(ret.code===200){
        if(ret.email){
          this.emailList = ret.email.emailList
        this.spareEmail = ret.email.spareEmail
        this.targetSpareEmail = ret.email.spareEmail
        }
        
      }
    },
    //更新备用邮箱
    async updateSpareEmail(){
      if(this.spareEmail===null){
        return this.$message({
          type:'warning',
          message:'你还没有选择备用邮箱哦~'
        })
      }
      if(this.spareEmail===this.targetSpareEmail){
        return this.$message({
          type:'warning',
          message:'当前邮箱已处于备用状态~'
        })
      }
      const ret = await this.$API.user.updateSpareEmail(this.spareEmail)
      if(ret.code===200){
        this.getEmailList()
        this.$message({
          type:'success',
          message:'更新成功'
        })
      }
    }
  },
  mounted(){
    this.getEmailList()
  }
};
</script>
  
<style lang="less" scoped>
.email-view {
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
  .email-message {
    margin-top: 20px;
    margin-bottom: 20px;
    span {
      display: block;
      margin-top: 10px;
      color: var(--theme_search_input_blue_color);
      cursor: default;
    }
  }
  .add-email {
    margin-bottom: 10px;
    &:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    .left-part {
      float: left;
      width: 450px;
      .info-item {
        margin-bottom: 40px;
        height: 40px;
        line-height: 40px;
        margin-right: 0;
        input {
          color: var(--theme_font_color);
          width: 300px;
          margin-right: 80px;
          outline-style: none;
          float: right;
          height: 35px;
          border: none;
          caret-color: var(--theme_search_input_blue_color);
          background-color: transparent;
        }
        .input-line {
          margin-top: -10px;
          margin-left: 70px;
          transition: background-color 0.3s;
          width: 300px;
          float: right;
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
    .right-part {
      width: 500px;
      height: 160px;
      float: left;
      .captcha-container {
        width: 110px;
        transition: color 0.3s;
        cursor: pointer;
        &:hover {
          color: var(--theme_search_input_blue_color);
        }
        .my-plane {
          margin-right: 5px;
        }
        .captcha-button {
          font-weight: 600;
          display: inline;
        }
      }
      .button {
        :deep(.el-button--primary) {
          height: 30px;
          width: 100px;
          margin-top: 60px;
          line-height: 10px;
          margin-left: 2px;
          font-size: 14px;
          background-color: var(--theme_search_input_blue_color);
          border-color: var(--theme_search_input_blue_color);
        }
        :deep(.el-button--primary:hover) {
          font-size: 14px;
          background-color: var(--theme_search_input_blue_color);
          border-color: var(--theme_search_input_blue_color);
        }
      }
    }
  }
  .select-email {
    .select-item-two {
      span {
        display: inline-block;
        margin-right: 30px;
      }
      :deep(.el-select) {
        width: 276px;
        height: 40px;
        .el-input__inner {
          height: 40px;
        }
      }
      :deep(.el-button--primary) {
        height: 30px;
        width: 100px;
        line-height: 10px;
        margin-left: 82px;
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      :deep(.el-button--primary:hover) {
        font-size: 14px;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
    }
  }
}
</style>