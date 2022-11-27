import requests from "../request";

//获取违规类型
export const getReportType = () => requests({url:'/report/getReportType',method:'get'})

//举报文章
export const reportTheArticle = (report) => requests({url:'/report/reportTheArticle',method:'post',data:{report}})

//举报评论
export const reportTheComment = (commentReport) => requests({url:'/report/reportTheComment',method:'post',data:{commentReport}})

//举报动态
export const reportTheTrend = (reportMessage) => requests({url:'/report/reportTheTrend',method:'post',data:{reportMessage}})

//举报动态评论
export const reportTheTrendComment = (reportMessage) => requests({url:'/report/reportTheTrendComment',method:'post',data:{reportMessage}})