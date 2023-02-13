import request from "../request";

//创建默认表
export const createDefault = (userCollection) => request({ url: '/userCollections/createUserCollection', method: 'post', data: { userCollection } })

//获取用户收藏夹列表
export const getCollectionList = (articleId) => request({ url: `/collections/getCollectionList`, method: 'post' ,data:{articleId} })

//用户创建收藏夹
export const createCollection = (collection) => request({url:'/collections/createCollection',method:'post',data:{collection}})

//用户删除收藏夹
export const deleteCollection = (collectionId) => request({url:`/collections/deleteCollection/${collectionId}`,method:'delete'})

//获取单个收藏夹文章
export const getArticle = (collectionId,page) => request({url:`/collections/getArticle/${collectionId}`,method:'post',data:{page}})

//收藏文章
export const collectionArticle = (collection) => request({url:'/collectionItem/collection',method:'post',data:{collection}})

//修改收藏夹名称
export const updateCollectionName = (collection) => request({url:'/collections/updateCollectionName',method:'post',data:{collection}})

//获取收藏状态
export const getCollectionStatus = (articleId) => request({url:`/collections/getCollectionStatus/${articleId}`,method:'get'})

//移除单个收藏文章
export const removeArticle = (collection) => request({url:'/collectionItem/cancelCollection',method:'post',data:{collection}})

//移动文章到指定文件夹
export const removeArticleTo = (collection) => request({url:'/collections/removeArticleTo',method:'post',data:{collection}})

export const removeArticleWitchDeleted = (collectionItemId) => request({url:'/collections/removeArticleWitchDeleted',method:'post',data:{collectionItemId}})
