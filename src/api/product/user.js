import request from "../request";

//注册
export const userRegister = (userRegisterInfo) => request({ url: '/users/register', method: 'post', data: { user: userRegisterInfo } })

//登录
export const userLogin = (userLoginInfo) => request({ url: '/users/login', method: 'post', data: { user: userLoginInfo } })

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