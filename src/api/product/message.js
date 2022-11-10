import request from "../request";

//获取回复
export const getMessage = () => request({url:'/message/getReply',method:'get'})

//获取点赞
export const getKudos = () => request({url:'/message/getKudos',method:'get'})

//获取文章评论
export const getArticleComment = ()=> request({url:'/message/getArticleComment',method:'get'})

//获取动态评论
export const getTrendComment = ()=> request({url:'/message/getTrendComment',method:'get'})