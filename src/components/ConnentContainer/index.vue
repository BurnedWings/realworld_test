<template>
  <div class="comments-body">
        <div v-for="(comment,myIndex) in commentsList" :key="comment._id" class="comment-item">
          <div class="item-line"></div>
          <div class="user-avatar">
            <img :src="comment.user.image" alt />
          </div>
          <div class="comment-content">
            <div class="user-name">{{comment.user.username}}</div>
            <div class="comment-body">{{comment.body}}</div>
            <div class="comment-bottom">
              <div
                class="comment-date"
              >{{$dayjs(comment.createdAt).format("YYYY/MM/DD")}}&nbsp;&nbsp;{{$dayjs(comment.createdAt).format("HH:mm")}}</div>
              <div @click="kudosTheComment(comment._id,comment.user._id)" class="kudos">
                <i
                  v-if="commentStatusArr===null||commentStatusArr[myIndex].status===0"
                  class="iconfont icon-dianzan"
                ></i>
                <i
                  v-if="commentStatusArr!=null&&commentStatusArr[myIndex].status===1"
                  class="my-dianzan-icon iconfont icon-dianzan"
                ></i>&nbsp;
                <span>{{comment.favoritesCount>0?comment.favoritesCount:''}}</span>
              </div>
              <div class="reply" @click="showReplyInput(myIndex,comment.user,null,comment._id)">回复</div>
              <div class="comment-edit">
                <el-popconfirm
                  v-if="userId===comment.user._id"
                  title="你确定要删除评论嘛?"
                  @confirm="deleteOwnComment(comment._id)"
                >
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
                <i v-else @click="toEditComment(myIndex)" class="el-icon-more"></i>
                <div @mouseleave="closeBox(myIndex)" ref="editBox" class="to-edit-comment">
                  <span>加入黑名单</span>
                  <br />
                  <span>举报</span>
                </div>
              </div>
            </div>
            <div class="reply-item" v-for="(reply,index) in comment.replyList" :key="reply._id">
              <div class="reply-left">
                <img :src="reply.user.image" alt />
              </div>
              <div class="reply-right">
                <span class="reply-user-name">{{reply.user.username}}</span>
                <span v-if="reply.toReply" class="reply-to">@{{reply.toReply.username}}</span>
                <span>{{reply.body}}</span>
                <div class="reply-item-bottom">
                  <div
                    class="reply-date"
                  >{{$dayjs(reply.createdAt).format("YYYY/MM/DD")}}&nbsp;&nbsp;{{$dayjs(reply.createdAt).format("HH:mm")}}</div>
                  <div @click="kudosTheReply(reply._id,reply.user._id)" class="kudos">
                    <i
                      v-if="commentStatusArr===null||commentStatusArr[myIndex].reply[index]===0"
                      class="iconfont icon-dianzan"
                    ></i>
                    <i
                      v-if="commentStatusArr!=null&&commentStatusArr[myIndex].reply[index]===1"
                      class="my-dianzan-icon iconfont icon-dianzan"
                    ></i>&nbsp;
                    <span>{{reply.favoritesCount>0?reply.favoritesCount:''}}</span>
                  </div>
                  <div
                    @click="showReplyInput(myIndex,reply.user,reply.user._id,comment._id)"
                    class="reply"
                  >回复</div>
                  <div class="reply-edit">
                    <el-popconfirm
                      title="你确定要删除评论嘛?"
                      class="edit-container"
                      @confirm="deleteOwnReply(reply._id)"
                    >
                      <i
                        slot="reference"
                        v-if="userId===reply.user._id"
                        class="my-edit-icon el-icon-delete"
                      ></i>
                    </el-popconfirm>
                    <i
                      v-if="userId!=reply.user._id"
                      @click="toEditReply(myIndex,index)"
                      class="my-edit-icon el-icon-more"
                    ></i>
                    <div
                      @mouseleave="closeReplyBox(myIndex,index)"
                      :ref="'replyEditBox'+myIndex+index"
                      class="to-edit-reply"
                    >
                      <span>加入黑名单</span>
                      <br />
                      <span>举报</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="reply-input-container" :class="'reply-input-container'+myIndex"></div>
          </div>
        </div>
        <!-- <ReplyInput v-if="isReplyInputShow" ref="ReplyInput" :toUser="toUser" :articleId="detailArticle._id" @refComments="getComments" ></ReplyInput> -->
      </div>
</template>

<script>
export default {

}
</script>

<style>

</style>