// API 配置
export const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'http://192.168.0.29:20000'
  },
  // 生产环境
  production: {
    baseURL: '/api'  // 使用相对路径，将通过 Nginx 代理转发
  }
};

// 获取当前环境的配置
export const getApiConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG[env];
}; 