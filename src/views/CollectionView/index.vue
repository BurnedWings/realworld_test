<template>
  <div class="collection-view">
    <div class="collection-container">
      <div class="left-part">
        <div @click="toCreateCollection" class="create-collection">
          <i class="my-icon el-icon-circle-plus-outline"></i>
          新建收藏夹
        </div>
        <div class="line"></div>
        <el-menu
          default-active="0"
          class="setting-nav"
          background-color="transparent"
          active-text-color="rgb(48,169,222)"
        >
          <el-menu-item
            v-for="(collection,index) in collectionList"
            :key="collection._id"
            :index="index.toString()"
            @click="showArticle(collection._id)"
          >
            <i class="el-icon-wallet"></i>
            <span slot="title">{{collection.collectionName}}</span>
            <span class="articleCount">{{collection.articleCount}}</span>
            <i
              @click.stop="editCollectionName(collection.collectionName,collection._id)"
              class="my-more el-icon-edit"
            ></i>
            <i @click.stop="toDeleteCollection(collection._id)" class="my-more el-icon-delete"></i>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="right-part">
        <div class="article-container">
          <div v-for="(article,index) in articleList" :key="article._id" class="article-item">
            <div class="data-item">
              <div @click="toDetailArticle(article.article)" class="data-title">
                <div class="side-bar"></div>
                <div v-if="article.article" class="title-content">{{article.article.title}}</div>
                <div v-else class="title-content">该文章已被作者删除</div>
              </div>
              <div v-if="article.article" class="data-description">
                {{article.article.description}}
                <i
                  @click="toEditCollectionArticle(index)"
                  class="myIcon el-icon-more"
                ></i>
                <div ref="editBox" @mouseleave="closeEditBox(index)" class="to-edit-reply">
                  <span @click="openToRemoveToDialog(article.article._id)">移动到</span>
                  <br />
                  <span @click="openToRemoveDialog(article.article._id)">移除</span>
                </div>
              </div>
              <div v-else class="data-description">
                该文章已被作者删除
                <i @click="toEditCollectionArticle(index)" class="myIcon el-icon-more"></i>
                <div ref="editBox" @mouseleave="closeEditBox(index)" class="to-edit-reply">
                  <span @click="openToRemoveDialog(null,article._id)">移除</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hasNotArticle" class="message">该收藏夹还没有内容哦，快去收藏吧！</div>
        </div>
        <el-pagination
          class="myPagination"
          background
          :hide-on-single-page="true"
          layout="prev, pager, next"
          :page-size="5"
          :total="totalArticle"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      class="my-rm-dialog"
      title="你正在移动一个收藏到"
      @closed="closeTheRemoveToDialog"
      center
      :visible.sync="removeToDialog"
    >
      <div
        class="collection-name"
      >{{removeTargetCollection?removeTargetCollection.collectionName:'请选择'}}</div>
      <div class="line"></div>
      <div class="inner-collection-container">
        <div
          @click="getTheTargetCollectionMessage(collection)"
          v-for="(collection,index) in collectionList"
          :key="collection._id"
          v-if="selectedCollectionId!=collection._id"
          class="collection-item"
        >
          <div class="data-title">
            <div class="side-bar"></div>
            <i class="myIcon el-icon-wallet"></i>
            <div class="title-content">{{collection.collectionName}}</div>
            <span class="collection-status">{{collection.articleCount}}</span>
          </div>
        </div>
      </div>
      <el-button
        v-if="isShowDialogButton"
        class="my-submit"
        type="primary"
        size="small"
        @click="removeTheArticleTo"
      >确定</el-button>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :show-close="false"
      class="my-delete-dialog"
      :visible.sync="toDeleteDialog"
      width="30%"
      :before-close="handleClose"
    >
      <span>你确定要删除嘛?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toDeleteDialog = false">取 消</el-button>
        <el-button type="danger" @click="deleteTheCollection()">删 除</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="温馨提示"
      :show-close="false"
      class="my-delete-dialog"
      :visible.sync="toRemoveDialog"
      width="30%"
      :before-close="removeDialogClose"
    >
      <span>你确定要将收藏移除嘛?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toRemoveDialog = false">取 消</el-button>
        <el-button type="danger" @click="removeTheArticle()">移 除</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="my-dialog"
      title="收藏夹信息"
      @close="closeDialog"
      @closed="closedDialog"
      center
      :visible.sync="dialogTableVisible"
    >
      <div class="search-input">
        <div class="search-input-title">收藏夹名称</div>
        <input
          ref="searchInput"
          type="text"
          @focus="changeInputTitleColor"
          @blur="removeInputTitleColor"
          v-model="inputInfo"
        />
        <div class="input-line"></div>
        <el-button
          class="my-submit"
          type="primary"
          size="small"
          @click="createCollection"
        >{{isCreate?'创建':'修改'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
export default {
  name: "CollectionView",
  data() {
    return {
      collectionList: [],
      dialogTableVisible: false,
      inputInfo: "",
      userCollectionId: null,
      articleList: null,
      hasNotArticle: null,
      isCreate: null,
      toUpdateCollectionId: null,
      toDeleteDialog: false,
      toDeleteCollectionId: null,
      selectedCollectionId: null,
      preEditBox: null,
      toRemoveDialog: false,
      toOperateArticle: null,
      totalArticle: 0,
      currentPage: 1,
      removeToDialog: false,
      removeTargetCollection: null,
      isShowDialogButton: false,
      toOperateCollectionItem: null
    };
  },
  methods: {
    //获取收藏夹列表
    async getCollectionList() {
      const ret = await this.$API.collection.getCollectionList();
      if (ret.code === 200) {
        this.collectionList = ret.collectionList;
        this.userCollectionId = ret.userCollectionId;
        if (this.selectedCollectionId) {
          let res;
          if (this.articleList.length === 1 && this.currentPage != 1) {
            res = await this.$API.collection.getArticle(
              this.selectedCollectionId,
              this.currentPage - 1
            );
          } else {
            res = await this.$API.collection.getArticle(
              this.selectedCollectionId,
              this.currentPage
            );
          }

          if (res.code === 200) {
            if (res.articleList.length === 0) {
              this.hasNotArticle = true;
            }
            this.articleList = res.articleList;
            this.totalArticle = res.total;
          }
        } else {
          this.selectedCollectionId = ret.collectionList[0]._id;
          const res = await this.$API.collection.getArticle(
            ret.collectionList[0]._id
          );
          if (res.code === 200) {
            if (res.articleList.length === 0) {
              this.hasNotArticle = true;
            }
            this.articleList = res.articleList;
            this.totalArticle = res.total;
          }
        }
      }
    },
    changeInputTitleColor() {
      document.querySelector(".search-input-title").style.color =
        "rgb(66,133,244)";
    },
    removeInputTitleColor() {
      document.querySelector(".search-input-title").style.color = "#757575";
    },
    toCreateCollection() {
      if (this.collectionList.length > 19) {
        this.$message({
          type: "error",
          message: "饱意思，你创建的收藏夹太多了~"
        });
      } else {
        this.isCreate = true;
        this.dialogTableVisible = true;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      }
    },
    async createCollection() {
      if (this.isCreate) {
        //创建收藏夹
        if (this.inputInfo.trim() === "") {
          this.$message({
            type: "warning",
            message: "文件夹名称不能为空!"
          });
          this.inputInfo = "";
        } else {
          const collection = {};
          this.inputInfo = this.inputInfo.trim();
          collection.collectionName = this.inputInfo;
          collection.userCollection = this.userCollectionId;
          const ret = await this.$API.collection.createCollection(collection);
          if (ret.code === 200) {
            this.dialogTableVisible = false;
            this.getCollectionList();
          } else if (ret.code === 202) {
            this.dialogTableVisible = false;
            this.$message({
              type: "warning",
              message: ret.message
            });
          }
        }
      } else {
        //修改收藏夹名称
        const collection = {};
        collection.collectionName = this.inputInfo;
        collection.collectionId = this.toUpdateCollectionId;
        const ret = await this.$API.collection.updateCollectionName(collection);
        if (ret.code === 200) {
          this.hasNotArticle = null;
          this.getCollectionList();
          this.dialogTableVisible = false;
        }
      }
    },
    editCollectionName(name, collectionId) {
      this.dialogTableVisible = true;
      this.inputInfo = name;
      this.toUpdateCollectionId = collectionId;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    closeDialog() {
      this.inputInfo = "";
      this.toUpdateCollectionId = null;
    },
    //关闭动画结束的回调
    closedDialog() {
      this.isCreate = null;
    },
    //切换收藏夹
    async showArticle(collectionId) {
      this.selectedCollectionId = collectionId;
      this.hasNotArticle = null;
      const ret = await this.$API.collection.getArticle(collectionId);
      if (ret.code === 200) {
        if (ret.articleList.length === 0) {
          this.hasNotArticle = true;
        }
        this.articleList = ret.articleList;
        this.totalArticle = ret.total;
      }
    },
    toDetailArticle(article) {
      if(article){
        this.$router.push({
        name: "detailArticle",
        params: {
          articleId:article._id
        }
      });
      }
    },
    //打开删除提示界面
    toDeleteCollection(collectionId) {
      this.toDeleteDialog = true;
      this.toDeleteCollectionId = collectionId;
    },
    //关闭删除界面回调
    handleClose() {
      this.toDeleteDialog = false;
    },
    //删除收藏夹
    async deleteTheCollection() {
      const ret = await this.$API.collection.deleteCollection(
        this.toDeleteCollectionId
      );
      if (ret.code === 200) {
        this.toDeleteDialog = false;
        this.getCollectionList();
        this.$message({
          type: "success",
          message: "删除成功"
        });
      }
    },
    //打开操作框
    toEditCollectionArticle(index) {
      if (this.preEditBox != null) {
        this.$refs.editBox[this.preEditBox].style.display = "none";
      }
      this.$refs.editBox[index].style.display = "block";
      this.preEditBox = index;
    },
    //关闭操作框
    closeEditBox(index) {
      this.$refs.editBox[index].style.display = "none";
    },
    removeDialogClose() {
      this.toOperateCollectionItem = null
      this.toRemoveDialog = false;
      this.preEditBox = null;
    },
    //移除文章
    async removeTheArticle() {
      if (!this.toOperateCollectionItem) {
        const collection = {};
        collection.article = this.toOperateArticle;
        collection.ofCollection = this.selectedCollectionId;
        const ret = await this.$API.collection.removeArticle(collection);
        if (ret.code === 200) {
          this.toRemoveDialog = false;
          this.getCollectionList();
          this.$message({
            type:'success',
            message:'移除成功~'
          })
        }
      }else{
        const ret = await this.$API.collection.removeArticleWitchDeleted(this.toOperateCollectionItem)
        if(ret.code===200){
          this.toRemoveDialog = false;
          this.getCollectionList();
          this.toOperateCollectionItem = null
          this.$message({
            type:'success',
            message:'移除成功~'
          })
        }
      }
    },
    //打开移动对话框
    openToRemoveToDialog(articleId) {
      this.toOperateArticle = articleId;
      this.removeToDialog = true;
      this.$nextTick(() => {
        this.isShowDialogButton = true;
      });
    },
    //打开移除对话框
    openToRemoveDialog(articleId, collectionItemId) {
      this.toRemoveDialog = true;
      this.toOperateArticle = articleId;
      this.toOperateCollectionItem = collectionItemId;
    },
    async handleCurrentChange(val) {
      this.currentPage = val;
      const ret = await this.$API.collection.getArticle(
        this.selectedCollectionId,
        val
      );
      if (ret.code === 200) {
        this.articleList = ret.articleList;
      }
    },
    //移动文章到指定收藏夹
    async removeTheArticleTo() {
      const collection = {};
      collection.article = this.toOperateArticle;
      collection.ofCollection = this.selectedCollectionId;
      if (this.removeTargetCollection) {
        collection.targetCollection = this.removeTargetCollection._id;
      } else {
        return this.$message({
          type: "warning",
          message: "你还没有选择要移动的收藏夹哦"
        });
      }
      const ret = await this.$API.collection.removeArticleTo(collection);
      if (ret.code === 200) {
        this.removeToDialog = false;

        this.getCollectionList();
        this.$message({
          type: "success",
          message: "操作成功"
        });
      }
    },
    //获取目标收藏夹
    getTheTargetCollectionMessage(collection) {
      this.removeTargetCollection = collection;
    },
    //关闭移动到收藏夹的回调
    closeTheRemoveToDialog() {
      this.isShowDialogButton = true;
      this.removeTargetCollection = null;
      this.preEditBox = null;
    }
  },
  created() {
    this.getCollectionList();
  }
};
</script>
  
<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
}
.collection-view {
  min-width: 1531px;
  min-height: 100vh;
  padding-top: 100px;
  transition: all 0.3s;
  background-color: var(--theme_outer_bg_color);
  .collection-container {
    width: 1200px;
    height: 620px;
    margin: 0 auto;
    transition: all 0.3s;
    border-radius: 0.5rem;
    box-shadow: 0 12px 15px 0 rgb(0 0 0 / 24%), 0 17px 50px 0 rgb(0 0 0 / 19%);
    background-color: var(--theme_inner_bg_color);
    .left-part {
      width: 250px;
      height: 100%;
      padding-left: 15px;
      padding-top: 15px;
      float: left;
      .create-collection {
        width: 200px;
        height: 30px;
        padding-left: 23px;
        padding-top: 3px;
        cursor: pointer;
        .my-icon {
          font-size: 18px;
        }
      }
      .line {
        margin-top: 5px;
        margin-left: 1px;
        margin-bottom: 5px;
        width: 218px;
        height: 1px;
        transform: scaleY(0.8);
        background-color: rgb(131, 130, 130);
      }
      .setting-nav {
        width: 220px;
        border-right: none;
        max-height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-left: 5px;
        padding-right: 5px;

        li {
          width: 210px;
          font-size: 16px;
          height: 32px;
          line-height: 32px;
          border-radius: 5px;
          color: var(--theme_font_color);
          transition: all 0.3s;
          margin: 10px 0;
          padding-right: 13px;
        }
        li :deep(.my-more) {
          display: none;
          float: right;
          margin-top: 9px;
          margin-left: 8px;
        }
        li:hover > :deep(.my-more) {
          display: block;
        }
        li :deep(.articleCount) {
          float: right;
          margin-top: 3px;
        }
        li:hover :deep(.articleCount) {
          display: none;
        }

        li:hover {
          background-color: var(--theme_userView_btn_bg_hover) !important;
          box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%),
            0 2px 10px 0 rgb(0 0 0 / 12%);
          // background-color: rgb(35, 109, 227);
        }
        .is-active {
          color: rgb(63, 126, 228) !important;
          background-color: var(--theme_userView_btn_bg_hover) !important;
          box-shadow: 0 2px 2px 0 rgb(0 0 0 / 16%),
            0 2px 10px 0 rgb(0 0 0 / 12%);
          // box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%),
          //   0 5px 15px 0 rgb(0 0 0 / 19%);
        }
      }
      .setting-nav::-webkit-scrollbar {
        width: 0px;
      }
      .setting-nav:hover::-webkit-scrollbar {
        width: 3px;
      }
    }
    .right-part {
      float: right;
      position: relative;
      width: 950px;
      height: 100%;
      .article-container {
        padding-top: 41px;
        .message {
          width: 350px;
          font-size: 18px;
          margin: 0 auto;
        }
        .article-item {
          width: 95%;
          margin-left: 20px;
          margin-bottom: 25px;
          .data-item {
            margin-top: 10px;
            margin-bottom: 10px;
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
              color: var(--theme_search_input_blue_color);
            }

            .data-description {
              position: relative;
              font-size: 14px;
              margin-left: 22px;
              .myIcon {
                float: right;
                cursor: pointer;
                margin-top: 5px;
                margin-right: 3px;
              }
              i {
                transition: color 0.5s;
              }
              i:hover {
                color: var(--theme_search_input_blue_color);
              }
              .to-edit-reply {
                padding-bottom: 8px;
                display: none;
                z-index: 100;
                position: absolute;
                border-radius: 6px;
                top: 20px;
                right: 10px;
                width: 85px;
                min-height: 30px;
                background-color: white;
                box-shadow: 0 2px 3px 0 rgb(0 0 0 / 24%),
                  0 2px 5px 0 rgb(0 0 0 / 19%);
                padding-top: 9px;
                span {
                  font-size: 14px;
                  width: 100%;
                  display: inline-block;
                  padding-left: 14px;
                  cursor: pointer;
                  font-weight: 600;
                  color: #000000c3;
                }
                span:hover {
                  background-color: whitesmoke;
                  color: var(--theme_search_input_blue_color);
                }
              }
            }
          }
        }
      }
      .myPagination {
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
      }
    }
  }
  .my-delete-dialog {
    min-height: 180px !important;
    span {
      color: var(--theme_font_color);
    }
  }
  .my-delete-dialog :deep(.el-dialog) {
    min-height: 150px;
  }
  .my-rm-dialog {
    .my-submit {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    .collection-name {
      display: block;
      text-align: center;
      margin-bottom: 8px;
      color: var(--theme_font_color);
    }
    .line {
      width: 100%;
      height: 1px;
      transform: scaleY(0.5);
      background-color: rgb(131, 130, 130);
    }
    .inner-collection-container {
      width: 102%;
      overflow-y: auto;
      max-height: 420px;
      padding-right: 13px;
      margin-bottom: 20px;
      color: var(--theme_font_color);
      .collection-item {
        margin-top: 10px;
        cursor: pointer;
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
            margin-right: 10px;
          }
          // .collection-status:hover {
          //   color: var(--theme_search_input_blue_color);
          // }
        }
        .data-title:hover {
          background-color: var(--theme_search_data_title_hover_bg);
          color: rgb(48, 169, 222);
        }
      }
    }
    .inner-collection-container::-webkit-scrollbar {
      width: 3px;
    }
  }

  .my-rm-dialog :deep(.el-button--primary) {
    background-color: rgb(35, 109, 227);
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
    transition: background 0.3s;
    border-color: transparent;
  }
  .my-rm-dialog :deep(.el-button--primary):hover {
    background-color: var(--theme_search_input_blue_color);
    box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
    border-color: transparent;
  }
  .my-rm-dialog :deep(.el-button--primary) span {
    font-size: 14px;
  }

  .my-dialog {
    .title {
      font-size: 20px;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 10px;
      .search-container-icon {
        position: absolute;
        right: 10px;
        top: 23px;
        cursor: pointer;
      }
      .search-container-icon:hover {
        transition: color 0.5s;
        color: rgb(48, 169, 222);
      }
    }
    .title-line {
      width: 100%;
      height: 1px;
      background-color: var(--theme_search_line_color);
      margin-bottom: 20px;
    }
    .search-input {
      width: 90%;
      height: 90px;
      position: relative;
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
      .my-submit {
        margin-top: 15px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .search-input :deep(.el-button--primary) {
      background-color: rgb(35, 109, 227);
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 24%), 0 5px 15px 0 rgb(0 0 0 / 19%);
      transition: background 0.3s;
      border-color: transparent;
    }
    .search-input :deep(.el-button--primary):hover {
      background-color: var(--theme_search_input_blue_color);
      box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
      border-color: transparent;
    }
    .search-input :deep(.el-button--primary) span {
      font-size: 14px;
    }
  }
}
.collection-view :deep(.el-dialog) {
  background-color: var(--theme_search_view_bg_color);
  min-height: 200px;
}
.collection-view :deep(.el-dialog__title) {
  color: var(--theme_font_color);
}
.collection-view :deep(.el-dialog__body) {
  padding-top: 0px;
}
</style>