import { getCurrentUser, getOneUser } from '@/api/product/user'
import { getAllMessageCount } from '@/api/product/message'
import { getArticleType } from '@/api/product/article'
import { getReportType } from '@/api/product/report'
import { getSwiper, getRecommendArticle } from '@/api/product/user'
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
        async getOneUserInfo(context, userId) {
            try {
                let res = await getOneUser(userId)
                if (res.code === 200) {
                    context.commit('GETONEUSERINFO', res.userInfo)
                }
            } catch (error) {

            }
        },
        //获取未读总条数
        async getTotalCount(context) {
            try {
                const ret = await getAllMessageCount()
                if (ret.code === 200) {
                    context.commit('GETTOTALCOUNT', { totalCount: ret.totalCount, kudos: ret.kudos, articleCommentCount: ret.articleCommentCount, trendCommentCount: ret.trendCommentCount, replyCount: ret.replyCount, systemCount: ret.systemMessageCount })
                }
            } catch (error) {

            }
        },
        async getArticleType(context) {
            return new Promise(async (resolve, reject) => {
                try {
                    const ret = await getArticleType()
                    if (ret.code === 200) {
                        context.commit('GTEARTICLETYPE', ret.typeList)
                        resolve('success')
                    }
                } catch (error) {
                    reject()
                }
            })
        },
        async getReportType(context) {
            try {
                const ret = await getReportType()
                if (ret.code === 200) {
                    context.commit('GETREPORTTYPE', ret.typeList)
                }
            } catch (error) {

            }
        },
        async getSwiper(context) {
            try {
                const ret = await getSwiper()
                if (ret.code === 200) {
                    context.commit('GETSWIPER', ret.swiperList)
                }
            } catch (error) {

            }
        },
        async getRecommendArticle(context) {
            try {
                const ret = await getRecommendArticle()
                if (ret.code === 200) {
                    context.commit('GETRECOMMENDARTICLE', ret.articleList)
                }
            } catch (error) {

            }
        },
        async clearUserInfo(context) {
            try {
                context.commit('CLEARUSERINFO')
            } catch (error) {

            }
        },

    },
    mutations: {
        GETUSERINFO(state, userInfo) {
            state.userInfo = userInfo
            state.userId = userInfo._id
        },
        GETONEUSERINFO(state, oneUserInfo) {
            state.oneUserInfo = oneUserInfo
        },
        GETTOTALCOUNT(state, countObj) {
            state.totalCount = countObj.totalCount
            state.kudos = countObj.kudos
            state.articleCommentCount = countObj.articleCommentCount
            state.trendCommentCount = countObj.trendCommentCount
            state.replyCount = countObj.replyCount
            state.systemCount = countObj.systemCount
        },
        GTEARTICLETYPE(state, typeList) {
            state.typeList = typeList
        },
        GETREPORTTYPE(state, reportTypeList) {
            state.reportType = reportTypeList
        },
        GETSWIPER(state, swiperList) {
            state.swiperList = swiperList
        },
        GETRECOMMENDARTICLE(state, articleList) {
            state.articleList = articleList
        },
        CLEARUSERINFO(state){
            state.userInfo = {}
            state.userId = ""
        }
    },
    state: {
        userInfo: {},
        oneUserInfo: {},
        userId: '',
        totalCount: null,
        kudos: null,
        articleCommentCount: null,
        trendCommentCount: null,
        systemCount: null,
        replyCount: null,
        typeList: null,
        reportType: null,
        swiperList: null,
        articleList: null
    },
    getters: {

    }
}