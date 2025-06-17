import axios from 'axios';
import { getApiConfig } from '../config';
import router from '../router';
import store from '../store';

const { baseURL } = getApiConfig();

// 创建axios实例
const api = axios.create({
  baseURL,
  headers: {'Content-Type': 'application/json'},
  timeout: 30000 // 30秒超时
});

// 添加请求拦截器
api.interceptors.request.use(
  config => {
    // 添加token到请求头（如果有）
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('响应错误:', error);
    
    // 如果有响应内容
    if (error.response) {
      console.error('错误响应:', error.response.data);
      
      // 处理401错误（token过期或未授权）
      if (error.response.status === 401) {
        console.log('Token已过期或无效，正在重定向到登录页面');
        
        // 清除用户会话信息
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_name');
        
        // 更新状态管理
        store.isLoggedIn = false;
        store.userInfo.user_name = '';
        
        // 显示友好的提示信息
        alert('您的登录已过期，请重新登录');
        
        // 重定向到登录页面，避免循环跳转
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 