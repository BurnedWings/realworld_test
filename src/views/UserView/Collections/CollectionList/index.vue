<template>
  <div class="collections-container">
    <div class="title">
      {{isLoginUser?'我的合集和文章列表':'Ta的合集和文章列表'}}
      <el-button
        v-if="isLoginUser"
        @click="toCreateTheCollection"
        icon="el-icon-plus"
        class="collection-btn"
        style="width:55px;height:25px;padding:0;position: relative;top:-1.5px;margin-left:5px;"
        size="mini"
        type="primary"
      >新建</el-button>
    </div>
    <div class="title-line"></div>
    <div class="container">
      <div
        v-for="(collection,index) in collectionList"
        :key="collection._id"
        class="collection-item"
      >
        <span>{{collection.title}}</span>
        <span v-if="collection.articleList.length>0" class="count">{{collection.articleCount}}</span>
        <div v-if="collection.articleList.length===0" class="no-article-message">
          该合集中还没有文章哦~&nbsp;&nbsp;
          <span @click="toAddArticle(collection._id)">立即添加</span>
        </div>
        <el-button
          v-if="collection.articleList.length>0"
          class="to-more-btn"
          style="width:55px;height:25px;padding:0;padding-left:5px;"
          size="mini"
          type="primary"
          @click="toAddArticle(collection._id)"
        >
          更多
          <i class="el-icon-arrow-right"></i>
        </el-button>
        <div v-for="(article,index) in collection.articleList" :key="article._id" class="data-item">
          <div @click="toDetailArticle(article._id)" class="data-title">
            <div class="side-bar"></div>
            <div class="title-content">{{article.title}}</div>
          </div>
          <div class="data-description">{{article.description}}</div>
        </div>
        <div class="collection-line"></div>
      </div>
      <div v-if="collectionList&&collectionList.length===0" class="no-collection-message">{{isLoginUser?'你还没有创建合集哦~':'Ta还没有创建合集哦~'}}</div>
    </div>
    <el-dialog title="新建合集" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>合集标题</span>
      <el-input style="margin-bottom:15px;margin-top:5px;" v-model="titleInput" placeholder="请输入内容"></el-input>
      <span>关键词</span>
      <el-input style="margin-top:5px;" v-model="keyWord" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTheCollection">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ArticleCollections",
  data() {
    return {
      dialogVisible: false,
      titleInput: "",
      keyWord: "",
      collectionList: null
    };
  },
  computed: {
    isLoginUser() {
      return this.$route.params.userId === this.$store.state.user.userInfo._id;
    }
  },
  methods: {
    toDetailArticle(articleId) {
      this.$router.push({
        name: "detailArticle",
        params: {
          articleId
        }
      });
    },
    toAddArticle(collectionId) {
      this.$router.push({
        name: "detailCollection",
        params: {
          collectionId
        }
      });
    },
    async createTheCollection() {
      if (this.titleInput.trim() === "") {
        return this.$message({
          type: "warning",
          message: "请输入合集标题"
        });
      }
      if (this.keyWord.trim() === "") {
        return this.$message({
          type: "warning",
          message: "请输入合集关键词"
        });
      }
      const ret = await this.$API.user.createTheArticleCollection({
        title: this.titleInput,
        keyWord: this.keyWord
      });
      if (ret.code === 200) {
        this.dialogVisible = false;
        this.titleInput = "";
        this.keyWord = "";
        this.getArticleCollection();
        this.$message({
          type: "success",
          message: "创建成功"
        });
      }
    },
    //关闭回调
    handleClose() {
      this.dialogVisible = false;
      this.titleInput = "";
      this.keyWord = "";
    },
    toCreateTheCollection() {
      this.dialogVisible = true;
    },
    //获取合集
    async getArticleCollection() {
      const ret = await this.$API.user.getArticleCollection();
      if (ret.code === 200) {
        ret.collectionList.forEach(item => {
          item.articleCount = item.articleList.length;
          item.articleList = item.articleList.slice(0, 4);
        });
        this.collectionList = ret.collectionList;
      }
    }
  },
  mounted() {
    this.getArticleCollection();
  }
};
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  overflow-y: hidden;
  &:deep(.el-dialog__body) {
    padding-top: 10px;
    padding-bottom: 15px;
  }
}
.collections-container {
  .title {
    margin-top: 15px;
    font-size: 18px;
    margin-bottom: 15px;
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
  .title-line {
    height: 1px;
    transform: scaleY(0.5);
    background-color: rgb(131, 130, 130);
  }
  .container {
    .collection-item {
      margin-top: 15px;
      .to-more-btn {
        float: right;
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      .to-more-btn:hover {
        background-color: var(--theme_search_input_blue_color);
        border-color: var(--theme_search_input_blue_color);
      }
      .no-article-message {
        display: inline-block;
        margin-left: 40%;
        transform: translateX(-40%);
        font-size: 13px;
        cursor: default;
        span {
          cursor: pointer;
          color: var(--theme_search_input_blue_color);
        }
      }
      .count {
        background: #f6fafb;
        border: 1px solid #ddd;
        border-radius: 3px;
        color: #777;
        font-weight: 600;
        display: inline-block;
        font-size: 13px;
        line-height: 19px;
        height: 19px;
        margin-left: 11px;
        padding: 0 4px;
        position: relative;
        vertical-align: middle;
      }
      .count:before {
        background-image: url(//s1.hdslb.com/bfs/static/jinkela/space/assets/icons.png);
        position: absolute;
        background-position: -215px -340px;
        content: "";
        display: block;
        left: -6.9px;
        top: -2.8px;
        height: 20px;
        width: 11px;
      }
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
      .collection-line {
        height: 1px;
        transform: scaleY(0.5);
        background-color: rgb(131, 130, 130);
        margin-top: 15px;
      }
    }
    .no-collection-message {
      margin-top: 15px;
      text-align: center;
    }
  }
}
</style>