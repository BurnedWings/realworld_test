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