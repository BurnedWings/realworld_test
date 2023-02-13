import request from "../request";
//创建文章
export const createArticle = (articleMessage) => request({ url: '/articles', method: 'post', data: { article: articleMessage } })

//获取文章列表
export const getArticleList = (offset, typeId) => request({ url: '/articles/getArticleList', method: 'post', data: { offset, typeId } })

//获取文章详情
export const getDetailArticle = (articleId) => request({ url: '/articles/getDetailArticle', method: 'post', data: { articleId } })

export const getToEditDetailArticle = (articleId) => request({url:'/articles/getToEditDetailArticle',method:'post',data:{articleId}})

//获取指定用户文章
export const getArticlesOfOneUser = (userId) => request({ url: `/articles/${userId}`, method: 'get' })

//文章图片上传
export const handleImg = (formData) => request({ url: '/articles/handleImg', method: 'post', data: formData })

//文章图片上传
export const handleCover = (formData) => request({ url: '/articles/handleCover', method: 'post', data: formData })

//搜索文章
export const searchArticle = (inputInfo) => request({ url: '/articles/searchArticle', method: 'post', data: { inputInfo } })

//更新文章
export const updateArticle = (article) => request({ url: '/articles/updateArticle', method: 'post', data: { article } })


//删除文章
export const deleteArticle = (articleId) => request({ url: '/articles/deleteOneArticle', method: 'post', data: { articleId } })

//点赞
export const kudos = (articleKudos) => request({ url: '/articleKudos/createArticleKudos', method: 'post', data: { articleKudos } })

//获取文章点赞状态
export const getKudosStatus = (articleKudos) => request({ url: '/articleKudos/getArticleKudosStatus', method: 'post', data: { articleKudos } })

//获取文章类型
export const getArticleType = () => request({ url: '/articles/getArticleType', method: 'post' })

//获取未过审文章
export const getNotAuditAndBackArticle = (userId) => request({url:`/articles/getNotAuditAndBackArticle/${userId}`,method:'get'})

//获取未过审文章详情
export const getNotAuditAndBackArticleDetail = (articleId) => request({url:'/articles/getNotAuditArticle',method:'post',data:{articleId}})

