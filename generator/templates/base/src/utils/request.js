import axios from 'axios';
import config from "@/config";
import { getToken, setToken, removeToken } from './auth';
import { Message, MessageBox } from 'element-ui';
import router from "@/router";

// 创建axios实例
const service = axios.create({
  baseURL: config.apiUrl, // api的base_url
  timeout: 15000 // 请求超时时间
})

// 不传token的api url名单
const tokenWhiteList = ['/auth/login'];

// request 拦截
service.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';

  if (tokenWhiteList.indexOf(config.url) === -1 && getToken()) {
    config.headers['Authorization'] = getToken();
  }

  config.data = {
    reqSeq: '',
    reqTime: '',
    content: config.data || {}
  }

  // for debug
  if (process.env.NODE_ENV !== 'production') console.log('===请求数据===', config.url, config.data);

  return config
}, error => {
  return Promise.reject(error);
})


// 请求错误登出，确保多请求错误只提示一次
let outMsgBox = false;

// 请求错误登出
function loginOut(msg) {
  if (!outMsgBox) {
    outMsgBox = true;
    removeToken();
    MessageBox.alert(msg, '确定登出', {
      type: 'warning',
      callback: () => {
        router.push('/login');
        outMsgBox = false;
      }
    });
  }
}

// response 拦截
service.interceptors.response.use(response => {
    if (response.headers.authorization) {
      setToken(response.headers.authorization);
    }

    const res = response.data;
    const code = res.respCode;

    // for debug      
    if (process.env.NODE_ENV !== 'production') console.log('===返回数据===', response.config.url.replace(config.apiUrl, ''), res);

    if (code !== 0) {

      Message({
        message: res.respMsg || 'Error',
        type: 'error',
        duration: 5000
      })

      if (code === 1001) {
        loginOut('认证失败，请重新登录');
      } else if (code === 1002) {
        loginOut('授权过期，请重新登录');
      } else if (code === 401) {
        loginOut('权限token无效，请重新登录');
      }

      return Promise.reject(new Error(res.respMsg || 'Error'));

    } else {
      return res.content;
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error);
  }
)

export default service;