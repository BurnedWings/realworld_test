import request from "../request";

//创建文章
export const createArticle = (articleMessage) => request({ url: '/articles', method: 'post', data: { article: articleMessage } })

//获取文章列表
export const getArticleList = () => request({url:'/articles',method:'get'})

//获取文章详情
export const getDetailArticle = (articleId) => request({url:'/articles/getDetailArticle',method:'post',data:{articleId}})

//获取指定用户文章
export const getArticlesOfOneUser = (userId) => request({url:`/articles/${userId}`,method:'get'})

//文章图片上传
export const handleImg = (formData) => request({url:'/articles/handleImg',method:'post',data:formData})

//搜索文章
export const searchArticle = (inputInfo) => request({url:'/articles/searchArticle',method:'post',data:{inputInfo}})