import Vue from 'vue'
import VueRouter from 'vue-router'
import { getDetailArticle } from '@/api/product/article'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta: { isLogin: true }
  },
  {
    path: '/register',
    name: 'register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login'),
    meta: { isLogin: false }
  },
  {
    path: '/createArticle',
    name: 'createArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateArticle')
  },
  {
    path: '/editArticle/:articleId',
    name: 'editArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateArticle'),
  },
  {
    path: '/detailArticle/:articleId',
    name: 'detailArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailArticle')
  },
  {
    path: '/detailNotice/:noticeId',
    name: 'detailNotice',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailNotice')
  },
  {
    path: '/userView/:userId',
    name: 'userView',
    redirect: '/userView/:userId/userArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/UserView'),
    children: [
      {
        path: 'userArticle',
        name: 'userArticle',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserArticle')
      },
      {
        path: 'auditIng',
        name: 'auditIng',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/AuditIng')
      },
      {
        path: 'userTrends',
        name: 'userTrends',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserTrends')
      },
      {
        path: 'userConcern',
        name: 'userConcern',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserConcern')
      },
      {
        path: 'userFans',
        name: 'userFans',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserFans')
      },
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/UserInfo')
      },
      {
        path: 'articleCollections',
        name: 'articleCollections',
        redirect:'articleCollections/collectionList',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserView/Collections'),
        children: [
          {
            path: 'detailCollection/:collectionId',
            name: 'detailCollection',
            component: () => import(/* webpackChunkName: "about" */ '../views/UserView/Collections/DetailCollection')
          },
          {
            path: 'collectionList',
            name: 'collectionList',
            component: () => import(/* webpackChunkName: "about" */ '../views/UserView/Collections/CollectionList')
          },
        ]
      },

    ]

  },
  {
    path: '/messageView',
    name: 'messageView',
    redirect: '/messageView/reply',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/MessageView'),
    children: [
      {
        path: 'reply',
        name: 'reply',
        component: () => import(/* webpackChunkName: "about" */ '../views/MessageView/Reply')
      },
      {
        path: 'kudos',
        name: 'kudos',
        component: () => import(/* webpackChunkName: "about" */ '../views/MessageView/Kudos')
      },
      {
        path: 'aboutArticle',
        name: 'aboutArticle',
        component: () => import(/* webpackChunkName: "about" */ '../views/MessageView/AboutArticle')
      },
      {
        path: 'aboutTrend',
        name: 'aboutTrend',
        component: () => import(/* webpackChunkName: "about" */ '../views/MessageView/AboutTrend')
      },
      {
        path: 'systemMessage',
        name: 'systemMessage',
        component: () => import(/* webpackChunkName: "about" */ '../views/MessageView/SystemMessage')
      },
    ]
  },
  {
    path: '/collectionView',
    name: 'collectionView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CollectionView')
  },
  {
    path: '/trendsView',
    name: 'trendsView',
    redirect: '/trendsView/trendArticle',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/TrendsView'),
    children: [
      {
        path: 'trendArticle',
        name: 'trendArticle',
        component: () => import(/* webpackChunkName: "about" */ '../views/TrendsView/TrendArticle')
      },
      {
        path: 'concernTrend',
        name: 'concernTrend',
        component: () => import(/* webpackChunkName: "about" */ '../views/TrendsView/ConcernTrend')
      },
    ]
  },
  {
    path: '/detailTrend/:trendId',
    name: 'detailTrend',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/DetailTrend')
  },
  {
    path: '/userSetting',
    name: 'userSetting',
    redirect: '/userSetting/infoView',
    component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting'),
    children: [
      {
        path: 'infoView',
        name: 'infoView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/InfoView')
      },
      {
        path: 'accountView',
        name: 'accountView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/AccountView')
      },
      {
        path: 'emailView',
        name: 'emailView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/EmailView')
      },
      {
        path: 'aboutView',
        name: 'aboutView',
        component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/AboutView')
      },
    ]
  },
  {
    path: '/404',
    component: () => import('../views/404/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }

]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    //返回的这个y=0，代表的滚动条在最上方
    return { y: 0 };
  },
})

//解决重复点击相同路由异常
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.beforeEach(async (to, from, next) => {
  // let userInfo = store.state.user.userInfo
  // //已登录
  // if(userInfo){
  //   if(to.path=="/login"||to.path=='/register'){
  //     next('/');
  //  }else{

  //  }
  // }else{
  //   //未登录

  // }

  if (to.name === 'detailArticle') {
    const ret = await getDetailArticle(to.params.articleId)
    if (ret.data) {
      return next()
    } else {
      return next('/404')
    }
  }
  const refreshToken = localStorage.kumicho_refresh_token
  const toPath = to.path
  if (toPath.indexOf('/messageView') != -1 || toPath.indexOf('/trendsView') != -1 || toPath.indexOf('collectionView') != -1 || toPath.indexOf('createArticle') != -1) {
    if (!refreshToken) {
      return next('/login')
    }
  }
  
  if (to.name === 'login' || to.name === 'register') {
    if (refreshToken) {
      return next('/')
    }
  }

  next()
})


export default router
