import request from "../request";

//获取回复
export const getMessage = () => request({url:'/message/getReply',method:'get'})

//获取点赞
export const getKudos = () => request({url:'/message/getKudos',method:'get'})

//获取文章评论
export const getArticleComment = ()=> request({url:'/message/getArticleComment',method:'get'})

//获取动态评论
export const getTrendComment = ()=> request({url:'/message/getTrendComment',method:'get'})

//获取所有未读条数
export const getAllMessageCount = () => request({url:'/message/getAllNotCheckedMes',method:'get'})

//修改未读回复状态
export const changeUnCheckedReply = () => request({url:'/message/changeUnCheckedReply',method:'get'})

//修改未读点赞状态
export const changeUnCheckedKudos = () => request({url:'/message/changeUnCheckedKudos',method:'get'})

//修改未读文章评论状态
export const changeUnCheckedArticleComment = () => request({url:'/message/changeUnCheckedArticleComment',method:'get'})

//修改未读动态评论状态
export const changeUnCheckedTrendComment = () => request({url:'/message/changeUnCheckedTrendComment',method:'get'})

//获取系统消息
export const getSystemMessage = () => request({url:'/message/getSystemMessage',method:'get'})

//获取公告详情
export const getDetailNotice = (noticeId) => request({url:`/message/getDetailNotice/${noticeId}`,method:'get'})