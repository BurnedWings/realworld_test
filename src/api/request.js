import axios from "axios";
import nProgress from "nprogress";
import 'nprogress/nprogress.css'
import store from "@/store";

const requests = axios.create({
  baseURL: '/api',
  timeout: 5000
})

requests.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么

    //判断是否携带token

    if (localStorage.kumicho_access_token) {
      config.headers.Authorization = localStorage.kumicho_access_token;
    }
    nProgress.start()
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
)


requests.interceptors.response.use(
  async function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    nProgress.done()

    if (response.status === 208) {

      const refreshToken = localStorage.kumicho_refresh_token

      if (refreshToken) {
        try {
          const ret = await axios({
            method: 'PUT',
            url: '/api/users/refreshToken',
            headers: {
              refreshToken
            }
          })

          if(ret.status===209){
            // location.reload()
            store.dispatch("clearUserInfo");
            localStorage.removeItem('kumicho_access_token')
            localStorage.removeItem('kumicho_refresh_token')
            return Promise.resolve({})
          }

          if (ret.data.code === 200) {
            const access_token = ret.data.access_token
            const refresh_token = ret.data.refresh_token
            localStorage.setItem('kumicho_access_token', access_token)
            localStorage.setItem('kumicho_refresh_token', refresh_token)
            return requests(response.config)
          }
        } catch (error) {
          return Promise.reject(new Error('fail'));
        }
      }
    } else {
      return response.data;
    }

  }, async function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    nProgress.done()

    if (error.response.status === 400) {
      return Promise.reject(error.response.data.errors)

    }
    else {
      return Promise.reject(new Error('fail'));
    }
    // return Promise.reject(new Error('fail'));
  }
)

export default requests