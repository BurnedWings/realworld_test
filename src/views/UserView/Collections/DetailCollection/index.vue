<template>
  <div class="detail-collection-view">
    <div class="title">
      <span @click="toCollectionList">我的合集和文章列表</span>
      <i class="el-icon-arrow-right"></i>
      {{detailCollection.title}}
    </div>
    <div class="message">
      <el-popconfirm v-if="isLoginUser" @confirm="deleteTheCollection()" title="你确定要删除该合集吗？">
        <i slot="reference" class="myIcon el-icon-delete"></i>
      </el-popconfirm>
      {{detailCollection.articleList?detailCollection.articleList.length:''}}篇文章&nbsp;|&nbsp;{{$dayjs(detailCollection.updatedAt).format("YYYY/MM/DD HH:mm")}}&nbsp;更新
      <el-button
      v-if="isLoginUser"
        @click="toUpdateTheCollection"
        style="float:right;margin-right:15px;"
        icon="el-icon-edit"
        class="collection-btn"
        size="mini"
        type="primary"
      >编辑</el-button>
      <el-button
        v-if="isLoginUser"
        style="float:right;margin-right:15px;"
        icon="el-icon-plus"
        class="collection-btn"
        size="mini"
        @click="addArticleToCollection"
        type="primary"
      >添加</el-button>
    </div>
    <div class="title-line"></div>
    <div class="article-view">
      <div
        v-if="detailCollection.articleList&&detailCollection.articleList.length===0"
        class="no-article-message"
      >当前合集还没有文章~</div>
      <div
        v-for="(article,index) in detailCollection.articleList"
        :key="article._id"
        class="data-item"
      >
        <div @click="toDetailArticle(article._id)" class="data-title">
          <div class="side-bar"></div>
          <div class="title-content">{{article.title}}</div>
          <el-popconfirm v-if="isLoginUser" @confirm="deleteTheArticle(article._id)" title="你确定要删除该文章吗？">
            <i slot="reference" class="myDeleteIcon el-icon-delete"></i>
          </el-popconfirm>
        </div>
        <div class="data-description">{{article.description}}</div>
      </div>
    </div>
    <el-dialog class="my-dialog" title="加入该合集" center :visible.sync="dialogTableVisible">
      <div class="line"></div>
      <div class="inner-collection-container">
        <div v-for="(article,index) in articleList" :key="article._id" class="collection-item">
          <div class="data-title">
            <div class="side-bar"></div>
            <i class="myIcon el-icon-tickets"></i>
            <div class="title-content">{{article.title}}</div>
            <span @click="addArticle(article._id)" class="collection-status">添加</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="新建合集" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>合集标题</span>
      <el-input style="margin-bottom:15px;margin-top:5px;" v-model="titleInput" placeholder="请输入内容"></el-input>
      <span>关键词</span>
      <el-input style="margin-top:5px;" v-model="keyWord" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateTheCollection">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DetailCollection",
  data() {
    return {
      detailCollection: {},
      dialogTableVisible: false,
      articleList: [],
      dialogVisible: false,
      titleInput: "",
      keyWord: ""
    };
  },
  computed: {
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    }
  },
  methods: {
    toDetailArticle(articleId){
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    async updateTheCollection() {
      const ret = await this.$API.user.updateTheCollection(
        this.$route.params.collectionId,
        this.titleInput,
        this.keyWord
      );
      if (ret.code === 200) {
        this.getOneArticleCollection();
        this.dialogVisible = false;
        this.titleInput = "";
        this.keyWord = "";
        this.$message({
          type: "success",
          message: "更新成功"
        });
      }
    },
    toUpdateTheCollection() {
      this.dialogVisible = true;
      this.titleInput = this.detailCollection.title;
      this.keyWord = this.detailCollection.keyWord;
    },
    handleClose() {
      this.dialogVisible = false;
      this.titleInput = "";
      this.keyWord = "";
    },
    async deleteTheArticle(articleId) {
      const ret = await this.$API.user.deleteArticleOfCollection(
        articleId,
        this.$route.params.collectionId
      );
      if (ret.code === 200) {
        this.getOneArticleCollection();
        this.$message({
          type: "success",
          message: "删除成功"
        });
      }
    },
    async addArticle(articleId) {
      const ret = await this.$API.user.addArticleToCollection(
        articleId,
        this.$route.params.collectionId
      );
      if (ret.code === 200) {
        this.dialogTableVisible = false;
        this.getOneArticleCollection();
        this.$message({
          type: "success",
          message: "添加成功~"
        });
      }
    },
    addArticleToCollection() {
      this.getCollectionArticleList();
      this.dialogTableVisible = true;
    },
    toCollectionList() {
      this.$router.push({
        name: "collectionList"
      });
    },
    async deleteTheCollection() {
      const ret = await this.$API.user.deleteTheCollection(
        this.$route.params.collectionId
      );
      if (ret.code === 200) {
        this.$router.push({
          name: "collectionList"
        });
        this.$message({
          type: "success",
          message: "删除成功~"
        });
      }
    },
    async getOneArticleCollection() {
      const ret = await this.$API.user.getOneArticleCollection(
        this.$route.params.collectionId
      );
      if (ret.code === 200) {
        this.detailCollection = ret.collection;
      }
    },
    async getCollectionArticleList() {
      const ret = await this.$API.user.getCollectionArticleList(
        this.$route.params.collectionId
      );
      if (ret.code === 200) {
        this.articleList = ret.articleList;
      }
    }
  },
  mounted() {
    this.getOneArticleCollection();
  }
};
</script>

<style lang="less" scoped>
.detail-collection-view {
  .title {
    margin-top: 15px;
    font-size: 18px;
    margin-bottom: 10px;
    margin-left: 1px;
    cursor: pointer;
    .collection-btn {
      background-color: var(--theme_search_input_blue_color);
      border-color: var(--theme_search_input_blue_color);
    }
    .collection-btn:hover {
      background-color: var(--theme_search_input_blue_color);
      border-color: var(--theme_search_input_blue_color);
    }
  }
  .message {
    position: relative;
    .collection-btn {
      background-color: var(--theme_search_input_blue_color);
      border-color: var(--theme_search_input_blue_color);
    }
    .collection-btn:hover {
      background-color: var(--theme_search_input_blue_color);
      border-color: var(--theme_search_input_blue_color);
    }
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
  }
  .title-line {
    height: 1px;
    transform: scaleY(0.5);
    background-color: rgb(131, 130, 130);
    margin-top: 10px;
  }
  .article-view {
    .no-article-message {
      margin-top: 10px;
      text-align: center;
    }
    .data-item {
      margin-top: 10px;
      margin-bottom: 10px;
      .data-title {
        transition: all 0.5s;
        height: 50px;
        font-weight: 600;
        &:hover .myDeleteIcon {
          opacity: 1;
        }
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
        .myDeleteIcon {
          opacity: 0;
          float: right;
          margin-right: 3px;
          margin-top: 18px;
          transition: opacity 0.3s;
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
        max-height: 42px;
        word-wrap: break-word;
        white-space: normal;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        display: -webkit-box;
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
      }
    }
  }
  .my-dialog {
    overflow-y: hidden;
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
            cursor: default;
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
</style>