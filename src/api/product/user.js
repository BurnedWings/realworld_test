import request from "../request";

//注册
export const userRegister = (userRegisterInfo) => request({ url: '/users/register', method: 'post', data: { user: userRegisterInfo } })

//登录
export const userLogin = (userLoginInfo) => request({ url: '/users/login', method: 'post', data: { user: userLoginInfo } })

//验证码登录
export const emailLogin = (user) => request({url:'/users/emailLogin',method:'post',data:{user}})

//获取当前登录用户
export const getCurrentUser = () => request({ url: '/user', method: 'get' })

//获取指定用户信息
export const getOneUser = (userId) => request({url:`/user/${userId}`,method:'get'})

//更新登录用户信息
export const updateUserInfo = (userInfo) => request({url:`/user`,method:'post',data:{userInfo}})

//更新用户头像
export const updateUserAvatar = (fromData) => request({url:'/user/avatar',method:'post',data:fromData})

//关注
export const concernOneUser = (fans) => request({url:'/fans/concernOneUser',method:'post',data:{fans}})

//取消关注
export const cancelConcern = (fans) => request({url:'/fans/cancelConcern',method:'post',data:{fans}})

//获取关注状态
export const getConcernStatus = (ofUser) => request({url:'/fans/getConcernStatus',method:'post',data:{ofUser}})

//获取关注列表
export const getConcernList = (user) => request({url:'/fans/getConcernList',method:'post',data:{user}})

//获取粉丝列表
export const getFansList = (user) => request({url:'/fans/getFansList',method:'post',data:{user}})

//获取验证码
export const getCaptcha = (email) => request({url:'/users/sendCaptcha',method:'post',data:{email}})

//查询轮播图
export const getSwiper = () => request({url:'/users/getSwiper',method:"get"})

//轮播图点赞
export const kudosTheSwiper = (swiperId) => request({url:'/users/kudosTheSwiper',method:'post',data:{swiperId}})

//获取推荐文章
export const getRecommendArticle = () => request({url:'/users/getRecommendArticle',method:'get'})

//修改密码
export const updatePassword = (prePassword,newPassword) => request({url:'/users/updatePassword',method:'post',data:{prePassword,newPassword}})

//邮箱修改密码
export const updatePasswordByEmail = (newPassword,captcha) => request({url:'/users/updatePasswordByEmail',method:'post',data:{newPassword,captcha}})

//验证码
export const sendUpdatePasswordCaptcha = () => request({url:'/users/sendUpdatePasswordCaptcha',method:'get'})

//添加邮箱
export const addEmail = (email,captcha) => request({url:'/users/addEmail',method:'post',data:{email,captcha}})

//获取邮箱列表
export const getEmailList = () => request({url:'/users/getEmailList',method:'get'})

//更新备用邮箱
export const updateSpareEmail = (spareEmail) => request({url:'/users/updateSpareEmail',method:'post',data:{spareEmail}})

//创建合集
export const createTheArticleCollection = (collection) => request({url:'/users/createTheArticleCollection',method:'post',data:{collection}})

//获取合集
export const getArticleCollection = () => request({url:'/users/getArticleCollection',method:'post'})

//获取单个合集
export const getOneArticleCollection = (collectionId) => request({url:'/users/getOneArticleCollection',method:'post',data:{collectionId}})

//获取合集未包含文章
export const getCollectionArticleList = (collectionId) => request({url:'/users/getCollectionArticleList',method:'post',data:{collectionId}})

//添加文字到合集
export const addArticleToCollection = (articleId,collectionId) => request({url:'/users/addArticleToCollection',method:'post',data:{articleId,collectionId}})

//删除文章
export const deleteArticleOfCollection = (articleId,collectionId) => request({url:'/users/deleteArticleOfCollection',method:'post',data:{articleId,collectionId}})

//更新合集
export const updateTheCollection = (collectionId,title,keyWord) => request({url:'/users/updateTheCollection',method:'post',data:{collectionId,title,keyWord}})

//删除合集
export const deleteTheCollection = (collectionId) => request({url:'/users/deleteTheCollection',method:'post',data:{collectionId}})

export const getArticleOfCollection = (articleId) => request({url:'/users/getArticleOfCollection',method:'post',data:{articleId}})
