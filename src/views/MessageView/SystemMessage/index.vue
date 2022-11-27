<template>
  <div class="right">
    <div class="right-top">系统消息</div>
    <div class="right-main">
      <div v-for="(item,index) in systemMessageList" :key="item._id" class="main-item">
        <div class="data-item">
          <div class="data-container">
            <div class="side-bar"></div>
            <div class="item-message-container">
              <span class="user-name">系统通知</span>
              <span style="cursor: default;">{{$dayjs(item.createdAt).format("YYYY/MM/DD HH:mm")}}</span>
              <br />
              <span
                v-if="item.comment"
                class="user-bio"
              >您举报的评论&nbsp;"{{item.comment}}"&nbsp;已被移除，感谢您对社区秩序的维护</span>
              <span
                v-if="item.reply"
                class="user-bio"
              >您举报的评论&nbsp;"{{item.reply}}"&nbsp;已被移除，感谢您对社区秩序的维护</span>
              <span v-if="item.article" class="user-bio">
                你的文章&nbsp;"{{item.article}}"&nbsp;{{item.type===1?'已经通过审核':'已被退回，请在七天内修改，否则将被系统自动删除'}}&nbsp;
                <el-popover placement="right" width="300" trigger="hover" :content="item.message">
                  <span slot="reference">{{item.type===2?'(问题描述：'+item.message+')':''}}</span>
                </el-popover>
              </span>
              <span v-if="item.trend" class="user-bio">
                您的动态&nbsp;"{{item.trend}}"&nbsp;{{item.type===1?'已经通过审核':'已被锁定，被锁定动态无法修改，系统将在七天后自动删除'}}&nbsp;
                <el-popover placement="right" width="300" trigger="hover" :content="item.message">
                  <span slot="reference">{{item.type===2?'(问题描述：'+item.message+')':''}}</span>
                </el-popover>
              </span>
              <span v-if="item.title" class="user-bio">
                <span
                  style="color: var(--theme_search_input_blue_color);font-weight: 600;margin-right:10px;"
                >[公告]&nbsp;{{item.isChecked?'':'[待查看]'}}</span>
                {{item.title}}
                <span
                  @click="showDetailNotice(item._id)"
                  style="margin-left:10px;font-weight: 600;color: var(--theme_search_input_blue_color);cursor: pointer;"
                >>>>点击传送链接查看详情</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemMessage",
  data() {
    return {
      systemMessageList: null
    };
  },
  methods: {
    showDetailNotice(noticeId) {
      this.$router.push({
        name: "detailNotice",
        params: {
          noticeId
        }
      });
    },
    async getSystemMessage() {
      const ret = await this.$API.message.getSystemMessage();
      if (ret.code === 200) {
        this.systemMessageList = ret.systemArr;
        this.$store.dispatch("getTotalCount");
      }
    }
  },
  mounted() {
    this.getSystemMessage();
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
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 600;
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
      margin-top: 10px;
      #my-message-comment-container {
        width: 100%;
        padding-left: 23px;
      }
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
          max-height: 90px;
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
            margin-top: 10px;
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
            margin-top: 45px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            font-size: 14px;
            line-height: 24px;
            max-height: 80px;
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
              margin-right: 20px;
              cursor: default;
              // transition: color 0.4s;
              margin-left: 0px;
              margin-bottom: 8px;
              display: inline-block;
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
      .bottom-box {
        min-height: 23px;
        float: right;
        width: 95%;
        margin-top: -18px;
        margin-right: 20px;
        .messageDate {
          margin-left: 55px;
          font-size: 14px;
          float: left;
        }
        .my-toReply {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
        }
        .my-kudos {
          float: left;
          font-size: 14px;
          margin-left: 15px;
          cursor: pointer;
          .my-kudos-i {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
  }
  .right-main::-webkit-scrollbar {
    width: 3px;
  }
}
</style>