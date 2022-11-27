import request from "../request";

//获取关注文章列表
export const getTrendArticle = () => request({url:'/trend/getTrendArticle',method:'get'})

//创建动态
export const createTrend = (trend) => request({url:'/trend/createTrend',method:'post',data:{trend}})

//处理动态图片
export const handleTrendImg = (formData,trendId) => request({url:`/trend/handleTrendImg/${trendId}`,method:'post',data:formData})

//获取关注列表动态
export const getConcernTrend = () => request({url:'/trend/getConcernTrend',method:'get'})

//查询动态详情
export const getDetailTrend = (trendId) => request({url:`/trend/getDetailTrend/${trendId}`,method:'get'})

//动态点赞
export const kudos = (trendKudos) => request({url:'/trendKudos/createTrendKudos',method:'post',data:{trendKudos}})

//获取动态点赞状态
export const getTrendKudosStatus = (trendKudos) => request({url:'/trendKudos/getTrendKudosStatus',method:'post',data:{trendKudos}})

//获取评论列表
export const getCommentList = (trendId) => request({url:'/trendComments/getComments',method:'post',data:{trendId}})

//获取评论列表(date)
export const getCommentsListByDate = (trendId) => request({url:'/trendComments/getCommentsByDate',method:'post',data:{trendId}})

//创建动态评论
export const createTrendComment = (trendComment) => request({url:'/trendComments/createComment',method:'post',data:{trendComment}})

//创建动态回复
export const createTrendReply = (reply) => request({url:'/trendReply/createReply',method:'post',data:{reply}})

//评论点赞
export const commentKudos = (trendCommentKudos) => request({url:'/trendCommentsKudos/kudos',method:'post',data:{trendCommentKudos}})

//回复点赞
export const replyKudos = (trendReplyKudos) => request({url:'/trendReplyKudos/kudos',method:'post',data:{trendReplyKudos}})

//删除评论
export const deleteComment = (comment,trend) => request({url:'/trendComments/deleteComment',method:'post',data:{trend,comment}})

//删除回复
export const deleteReply = (reply) => request({url:'/trendReply/deleteReply',method:'post',data:{reply}})

//获取个人动态
export const getOwnTrend = (userId) => request({url:`/trend/getOwnTrend/${userId}`,method:'get'})

//删除动态
export const deleteTrend = (trend) => request({url:'/trend/deleteOwnTrend',method:'post',data:{trend}})