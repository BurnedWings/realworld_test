import request from "../request";

//获取评论列表
export const getCommentsList = (articleId) => request({url:'/comments/getComments',method:'post',data:{articleId}})

//创建评论
export const createComment = (comment) => request({url:'/comments/createComment',method:'post',data:{comment}})

//创建回复
export const createReply = (reply) => request({url:'/replies/createReply',method:'post',data:{reply}})

//评论点赞
export const commentKudos = (commentKudos) => request({url:'/commentKudos/kudos',method:'post',data:{commentKudos}})

//回复点赞
export const replyKudos = (replyKudos) => request({url:'/replyKudos/kudos',method:'post',data:{replyKudos}})