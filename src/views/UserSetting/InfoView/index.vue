<template>
  <div class="info-view">
    <div class="title">个人信息</div>
    <div class="line"></div>
    <div class="info-view-container">
      <div class="info-container">
        <div class="info-item">
          <span>昵称</span>
          <input type="text" v-model="userInfo.username" />
          <div class="input-line"></div>
        </div>
        <div class="info-item">
          <span>个性签名</span>
          <input type="text" v-model="userInfo.bio" />
          <div class="input-line"></div>
        </div>
        <div class="info-item">
          <span>性别</span>
          <el-radio-group class="gender-radio" v-model="userInfo.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="3">保密</el-radio>
          </el-radio-group>
        </div>
        <div class="info-item">
          <span>出生日期</span>
          <el-date-picker
            class="date-choose"
            v-model="userInfo.birthday"
            value-format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </div>
        <div class="info-item">
          <span>注册日期</span>
          <input type="text" v-model="userInfo.createdAt" disabled="true" />
          <div class="input-line"></div>
        </div>
        <el-button type="primary" size="small" @click="updateProfile"
          >更新个人信息</el-button
        >
      </div>
      <div class="user-avatar">
        <div class="avatar-title">我的头像</div>
        <div class="img-container">
          <input
            class="update-input"
            type="file"
            accept="image/*"
            id="imgReader"
            enctype="multipart/form-data"
            @change="loadingImg"
          />
          <img v-if="userInfo.image" :src="$myBaseUrl+userInfo.image" alt="" />
          <div class="edit-button" @click="showEditView">
            <i class="el-icon-edit"></i>
            Edit
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default {
  name: "InfoView",
  data() {
    return {};
  },
  computed: {
    userInfo() {
      const info = this.$store.state.user.userInfo;
      info.birthday = new Date(info.birthday)
      info.createdAt = dayjs(info.createdAt).format("YYYY-MM-DD");
      if (info.bio === null) {
        info.bio = "这个人很神秘，什么都没有留下。";
      }
      return info;
    },
  },
  methods: {
    //更新个人信息
    async updateProfile() {
      const ret = await this.$API.user.updateUserInfo({
        username: this.userInfo.username.trim(),
        bio: this.userInfo.bio.trim(),
        gender: this.userInfo.gender,
        birthday: this.userInfo.birthday,
      });
      if (ret.code === 200) {
        this.$store.dispatch("getUserInfo");
        this.$message({
          type: "success",
          message: "修改成功",
        });
      }
    },
    showEditView() {
      document.querySelector('.update-input').click()
    },
    //文件上传成功的回调
    loadingImg(event){
      let reader = new FileReader()
      if(event.target.files[0]){
        const imgName = event.target.files[0].name
        reader.readAsDataURL(event.target.files[0])
        reader.onload = (e) => {
          let dataURL = reader.result
          this.$bus.$emit("showEdit",dataURL,imgName);
        }
      }
    }
  },
};
</script>

<style lang="less" scoped>
//修改ele样式

/* 选中后的字体颜色 */
:deep(.el-radio__input.is-checked + .el-radio__label){
  color: rgb(66, 133, 244) !important;
}
/* 选中后小圆点的颜色 */
:deep(.el-radio__input.is-checked .el-radio__inner){
  background: rgb(66, 133, 244) !important;
  border-color: rgb(66, 133, 244) !important;
}
:deep(.el-input__inner){
  background-color: transparent;
  border: none;
}
:deep(.el-button--primary){
  height: 30px;
  line-height: 10px;
  font-size: 14px;
  background-color: rgb(66, 133, 244);
  border-color: rgb(66, 133, 244);
}
:deep(.el-button--primary:hover){
  font-size: 14px;
  background-color: rgb(63, 126, 228);
  border-color: rgb(63, 126, 228);
}


.info-view {
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
  .info-view-container {
    width: 72%;
    height: 500px;
    margin-top: 30px;
    .info-container {
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
    .user-avatar {
      width: 30%;
      height: 100%;
      float: left;
      .avatar-title {
        font-size: 16px;
        margin-bottom: 10px;
      }
      .img-container {
        position: relative;
        .update-input {
          display: none;
        }
        img {
          width: 200px;
          border-radius: 50%;
          border: 1px solid rgba(131, 130, 130, 0.388);
          cursor: pointer;
        }
        .edit-button {
          text-align: center;
          width: 60px;
          height: 30px;
          line-height: 27px;
          border-radius: 4px;
          background-color: var(--theme_outer_bg_color);
          border: 1px solid rgba(131, 130, 130, 0.388);
          position: absolute;
          bottom: 10px;
          left: 3px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>