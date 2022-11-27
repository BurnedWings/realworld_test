<template>
  <div class="article-view">
    <div class="article-container">
      <div class="title">{{detailNotice.title}}</div>
      <div class="article-message">
        <span>{{$dayjs(detailNotice.createdAt).format("YYYY/MM/DD HH:mm")}}</span>·
        <span>{{detailNotice.message}}</span>
      </div>
      <div v-if="detailNotice.user" class="author-info">
        <img class="author-image" :src="$myBaseUrl+detailNotice.user.image" />
        <div class="author-message">
          <span class="author-name">{{detailNotice.user.username}}</span>
        </div>
      </div>
      <div class="title-line"></div>
      <!-- 公告插入处 -->
      <div class="articleBody" v-html="detailNotice.body"></div>
      <div class="article-tag">
        <!-- <span v-for="(tag,index) in detailArticle.tagList">#{{tag}}</span> -->
      </div>
      <div class="bottom-line"></div>
      <div class="share-box">
        <ul class="box-container">
          分享到:
          <li class="share-box-item">
            <i class="iconfont icon-dongtai"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-weibo"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-weixin"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-qqkongjian"></i>
          </li>
          <li class="share-box-item">
            <i class="iconfont icon-QQ"></i>
          </li>
        </ul>
      </div>
      <div class="article-advice">#空美町小镇授权</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailNotice",
  data() {
    return {
      detailNotice: {}
    };
  },
  methods: {
    async getDetailNotice() {
      const ret = await this.$API.message.getDetailNotice(
        this.$route.params.noticeId
      );
      if (ret.code === 200) {
        if(!ret.notice.isChecked){
          this.$store.dispatch("getTotalCount");
        }
        this.detailNotice = ret.notice;
      }
    }
  },
  mounted() {
    this.getDetailNotice();
  }
};
</script>

<style lang="less" scoped >
.article-view {
  transition: all 0.5s;
  min-width: 1531px;
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 100px;
  background-color: var(--theme_outer_bg_color);
  .article-container {
    transition: all 0.5s;
    width: 918px;
    min-height: 200px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    .title {
      font-size: 25px;
      font-weight: 550;
      text-align: left;
      padding-top: 20px;
      padding-left: 90px;
      padding-right: 90px;
    }
    .article-message {
      margin-top: 15px;
      padding: 0 90px;
      span {
        margin-right: 18px;
      }
    }
    .author-info {
      padding: 0 90px;
      margin-top: 25px;
      margin-bottom: 20px;
      
      .author-image {
        float: left;
        width: 44px;
        border-radius: 50%;
        margin-right: 10px;
        cursor: default;
      }
      .author-message {
        float: left;
        width: 300px;
        font-size: 14px;
        cursor: default;
        .author-fans {
          margin-right: 20px;
        }
        .author-name {
          font-weight: 600;
          display: block;
          line-height: 44px;
          font-size: 17px;
        }
      }
      .concern-btn {
        float: right;
        margin-top: 15px;
        .concern-button {
          color: white;
          background-color: var(--theme_search_input_blue_color);
          box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%),
            0 5px 15px 0 rgb(0 0 0 / 19%);
          border-radius: 6px;
          width: 160px;
          text-align: center;
          cursor: pointer;
          transition: all 0.5s;
        }
        .concern-button:hover {
          background-color: rgb(35, 109, 227);
          box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%),
            0 2px 10px 0 rgb(0 0 0 / 12%);
        }
      }
    }
    .author-info:after {
      /*伪元素是行内元素 正常浏览器清除浮动方法*/
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }

    .title-line {
      width: 90%;
      background-color: rgb(131, 130, 130);
      height: 1px;
      margin: 0 auto;
      transform: scaleY(0.7);
      margin-bottom: 15px;
    }
    .articleBody {
      width: 83%;
      margin: 0 auto;
      font-size: 17px;
      padding: 20px 13px;

      // transform: scale(0.7, 0.7);
    }

    .bottom-line {
      width: 90%;
      background-color: rgb(131, 130, 130);
      height: 1px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 20px;

      transform: scaleY(0.7);
      margin-bottom: 30px;
    }

    .share-box {
      width: 190px;
      text-align: center;
      margin-left: 85px;
      float: left;
      .box-container {
        text-align: center;
        padding: 0;
        font-size: 15px;
        .share-box-item {
          display: inline;
          margin-left: 7px;
          transition: color 0.2s;
          cursor: pointer;
          i {
            font-size: 18px;
          }
        }
        .share-box-item:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }

    .article-advice {
      width: 150px;
      text-align: center;
      float: right;
      margin-right: 25px;
      cursor: default;
      font-size: 14px;
    }

    .articleBody :deep(img) {
      margin-left: 50%;
      transform: translateX(-50%);
      max-width: 90%;
    }
  }
  .article-container:after {
    /*伪元素是行内元素 正常浏览器清除浮动方法*/
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .comments-container {
    position: relative;
    transition: all 0.3s;
    width: 918px;
    min-height: 600px;
    background-color: var(--theme_inner_bg_color);
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
    .num {
      padding-left: 5%;
      padding-top: 20px;
      font-size: 18px;
    }
    .search-type {
      font-size: 14px;
      margin-bottom: 5px;
      ul {
        margin-top: 30px;
        margin-bottom: 0px;
        padding-left: 5%;
        li {
          display: inline-block;
          margin-right: 20px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.5s;
        }
        .active {
          text-decoration: none;
          color: var(--theme_search_input_blue_color);
        }
        li:hover {
          color: var(--theme_search_input_blue_color);
        }
      }
    }

    .active-line-one {
      width: 72px;
      height: 2px;
      background-color: var(--theme_search_input_blue_color);
      position: absolute;
      left: 5%;
      z-index: 1;
      display: inline-block;
    }

    .active-line-two {
      width: 72px;
      height: 2px;
      background-color: var(--theme_search_input_blue_color);
      position: absolute;
      left: 135px;
      z-index: 1;
      display: inline-block;
    }

    .line {
      width: 90%;
      margin-left: auto;
      margin-right: auto;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .comment-input-container {
      padding-left: 45px;
    }

    .no-comment-box {
      width: 200px;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      margin-top: 80px;
    }

    .comments-body {
      margin-left: auto;
      margin-right: auto;
      width: 90%;
      margin-top: 30px;
      padding-bottom: 20px;
      .comment-item {
        overflow: hidden;
        margin-bottom: 5px;
        .user-avatar {
          margin-top: 10px;
          margin-right: 3%;
          float: left;
          img {
            width: 48px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .comment-content {
          float: left;
          width: 750px;
          .user-name {
            margin-bottom: 8px;
          }
          .comment-body {
            font-size: 18px;
            margin-bottom: 5px;
          }
          .comment-bottom {
            width: 100%;
            overflow: hidden;
            margin-bottom: 10px;

            .comment-date {
              float: left;
            }
            .reply {
              float: left;
              margin-left: 20px;
              cursor: pointer;
              transition: all 0.5s;
            }
            .reply:hover {
              color: var(--theme_search_input_blue_color);
            }
            .kudos {
              float: left;
              margin-left: 20px;
              cursor: pointer;
              i {
                transition: all 0.5s;
              }
              .my-dianzan-icon {
                color: var(--theme_search_input_blue_color);
              }
            }
            i:hover {
              color: var(--theme_search_input_blue_color);
            }
            .comment-edit {
              right: 50px;
              position: absolute;
              cursor: pointer;
              i {
                transition: color 0.5s;
              }
              i:hover {
                color: var(--theme_search_input_blue_color);
              }
              .to-edit-comment {
                display: none;
                z-index: 100;
                position: absolute;
                border-radius: 6px;
                right: -1px;
                top: 20px;
                width: 80px;
                height: 32px;
                color: #222;
                padding-left: 11px;
                background-color: white;
                box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%),
                  0 2px 5px 0 rgb(0 0 0 / 19%);
                padding-top: 4px;
                span {
                  font-size: 14px;
                  font-weight: 600;
                  width: 80px;
                  display: inline-block;
                  padding-left: 14px;
                  color: #000000c3;
                }
                span:hover {
                  // background-color: whitesmoke;
                  color: var(--theme_search_input_blue_color);
                }
              }
            }
          }
          .reply-item {
            max-width: 750px;
            margin-bottom: 15px;
            .reply-left {
              float: left;
              margin-right: 10px;
              img {
                width: 33px;
                border-radius: 50%;
                cursor: pointer;
              }
            }
            .reply-right {
              .reply-user-name {
                margin-right: 0.7rem;
              }
              .reply-to {
                cursor: pointer;
                margin-right: 1rem;
                color: var(--theme_search_input_blue_color);
              }
              .reply-item-bottom {
                width: 100%;
                overflow: hidden;
                margin-top: 5px;
                padding-left: 42px;
                .reply-date {
                  float: left;
                }
                .reply {
                  float: left;
                  margin-left: 20px;
                  cursor: pointer;
                  transition: all 0.5s;
                }
                .reply:hover {
                  color: var(--theme_search_input_blue_color);
                }
                .kudos {
                  float: left;
                  margin-left: 20px;
                  cursor: pointer;
                  i {
                    transition: all 0.5s;
                  }
                  .my-dianzan-icon {
                    color: var(--theme_search_input_blue_color);
                  }
                }
                .kudos:hover > i {
                  color: var(--theme_search_input_blue_color);
                }
                .reply-edit {
                  right: 50px;
                  position: absolute;
                  cursor: pointer;
                  i {
                    opacity: 0;
                    transition: all 0.5s;
                  }
                  i:hover {
                    color: var(--theme_search_input_blue_color);
                  }
                  .to-edit-reply {
                    display: none;
                    z-index: 100;
                    position: absolute;
                    border-radius: 6px;
                    right: -1px;
                    top: 20px;
                    width: 80px;
                    height: 30px;
                    color: #222;
                    background-color: white;
                    box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%),
                      0 2px 5px 0 rgb(0 0 0 / 19%);
                    padding-top: 4px;
                    padding-left: 11px;
                    span {
                      font-size: 14px;
                      width: 80px;
                      display: inline-block;
                      padding-left: 14px;
                      color: #000000c3;
                      font-weight: 600;
                    }
                    span:hover {
                      color: var(--theme_search_input_blue_color);
                    }
                  }
                }
              }
            }
          }
          // .reply-item:hover
          //   > .reply-right
          //   > .reply-item-bottom
          //   > .reply-edit
          //   > .my-edit-icon {
          //   opacity: 1;
          // }
          .reply-item:hover :deep(.my-edit-icon) {
            opacity: 1 !important;
          }

          #reply-input-container {
            width: 793px;
          }
        }
        .item-line {
          height: 1px;
          transform: scaleY(0.5);
          background-color: rgb(131, 130, 130);
          float: right;
          width: 91.3%;
          margin-top: 10px;
          margin-bottom: 20px;
        }
      }
    }
  }
  .side-toolbar {
    width: 50px;
    height: 280px;
    position: fixed;
    top: 490px;
    right: 15%;
    transition: linear 0.5s;
    transition-property: top;
    .side-toolbar-directory {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      text-align: center;
      background-color: var(--theme_inner_bg_color);
      margin-bottom: 10px;
      height: 50px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;
      i {
        margin-top: 50%;
        transform: translateY(-50%);
        font-size: 22px;
      }
    }
    .side-toolbar-directory:hover {
      color: var(--theme_search_input_blue_color);
    }
    .side-toolbar-container {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      padding: 0;
      width: 100%;
      border-radius: 5px;
      overflow: hidden;

      .side-toolbar-item {
        width: 100%;
        height: 60px;
        background-color: var(--theme_inner_bg_color);
        text-align: center;
        padding-top: 15px;
        cursor: pointer;
        transition: all 0.3s;
        i {
          font-size: 22px;
          margin-top: 4px;
        }
        .my-star {
          font-size: 28px;
        }
        .my-kudos {
          color: var(--theme_search_input_blue_color);
        }
      }
      .side-toolbar-item:hover {
        color: var(--theme_search_input_blue_color);
      }
    }
    .side-toolbar-toTop {
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      opacity: 0;
      text-align: center;
      height: 50px;
      background-color: var(--theme_inner_bg_color);
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
      transition-property: opacity top;
      i {
        font-size: 22px;
        margin-top: 50%;
        transform: translateY(-50%);
      }
    }
    .side-toolbar-toTop:hover {
      color: var(--theme_search_input_blue_color);
    }
  }
  .my-dialog {
    .line {
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .inner-collection-container {
      overflow-y: auto;
      max-height: 490px;
      padding-right: 20px;
      .collection-item {
        margin-top: 10px;
        .data-title {
          transition: all 0.5s;
          height: 50px;
          font-weight: 600;
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
            margin-left: 10px;
          }
          .myIcon {
            font-size: 18px;
            display: block;
            margin-top: 17px;
            float: left;
            margin-left: 10px;
          }
          .collection-status {
            margin-top: 17px;
            float: right;
            margin-left: 10px;
            cursor: pointer;
            transition: color 0.3s;
          }
          .collection-status:hover {
            color: var(--theme_search_input_blue_color);
          }
        }
      }
    }
    .inner-collection-container::-webkit-scrollbar {
      width: 3px;
    }
  }
}

.article-view :deep(.el-dialog) {
  width: 540px;
  position: absolute;
  left: 550px;
}
.article-view :deep(.el-dialog__body) {
  padding-top: 3px;
}
</style>