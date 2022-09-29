import { getCurrentUser,getOneUser } from '@/api/product/user'
export default {
    actions: {
        async getUserInfo(context) {
            try {
                let res = await getCurrentUser()
                if (res.code === 200) {
                    context.commit('GETUSERINFO', res.data)
                }
            } catch (error) {
                
            }
        },
        async getOneUserInfo(context,userId){
            try {
                let res = await getOneUser(userId)
                if (res.code === 200) {
                    context.commit('GETONEUSERINFO', res.userInfo)
                }
            } catch (error) {
                
            }
        }
    },
    mutations: {
        GETUSERINFO(state, userInfo) {
            state.userInfo = userInfo
        },
        GETONEUSERINFO(state,oneUserInfo){
            state.oneUserInfo = oneUserInfo
        }
    },
    state: {
        userInfo: {},
        oneUserInfo:{}
    },
    getters: {

    }
}