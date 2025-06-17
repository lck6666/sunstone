// src/api/auth.js
import { encrypt, addSecuritySignature } from '../utils/encryption';
import api from './axiosConfig';

// 常量定义 - 统一的验证规则
const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 16,
    PATTERN: /^[a-zA-Z0-9_-]{4,16}$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 18,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/
  },
  PHONE: {
    PATTERN: /^1[3-9]\d{9}$/,
    MAX_LENGTH: 15
  },
  EMAIL: {
    MAX_LENGTH: 64
  }
};

// 统一的数据验证函数
const validateCredentials = (credentials, isRegistration = false) => {
  // 基本验证 - 登录和注册都需要
  if (!credentials.name || typeof credentials.name !== 'string') {
    throw new Error('用户名不能为空');
  }
  
  if (!credentials.password || typeof credentials.password !== 'string') {
    throw new Error('密码不能为空');
  }
  
  // 用户名长度验证
  if (credentials.name.length < VALIDATION_RULES.USERNAME.MIN_LENGTH || 
      credentials.name.length > VALIDATION_RULES.USERNAME.MAX_LENGTH) {
    // 根据场景返回不同的错误信息
    if (isRegistration) {
      throw new Error(`用户名需为${VALIDATION_RULES.USERNAME.MIN_LENGTH}-${VALIDATION_RULES.USERNAME.MAX_LENGTH}位，可以包含数字、字母、下划线和连字符`);
    } else {
      throw new Error('用户名或密码错误');
    }
  }
  
  // 密码长度验证
  if (credentials.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH || 
      credentials.password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    // 根据场景返回不同的错误信息
    if (isRegistration) {
      throw new Error(`密码需为${VALIDATION_RULES.PASSWORD.MIN_LENGTH}-${VALIDATION_RULES.PASSWORD.MAX_LENGTH}位，必须是大写字母、小写字母和数字的混合`);
    } else {
      throw new Error('用户名或密码错误');
    }
  }
  
  // 注册时的附加验证
  if (isRegistration) {
    // 验证电话号码长度
    if (credentials.phone) {
      if (credentials.phone.length > VALIDATION_RULES.PHONE.MAX_LENGTH || 
          !VALIDATION_RULES.PHONE.PATTERN.test(credentials.phone)) {
        throw new Error('请输入正确的手机号');
      }
    }
    
    // 验证邮箱长度
    if (credentials.email && credentials.email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      throw new Error('邮箱长度超出限制');
    }
  }
  
  return true;
};

// 统一错误处理函数
const handleApiError = (error, defaultMessage) => {
  // 捕获并处理API调用错误
  if (error.response) {
    // 处理HTTP状态码错误
    if (error.response.status === 422) {
      // 422错误通常是请求数据格式问题，统一返回友好错误信息
      console.error('请求格式错误:', error);
      throw new Error(defaultMessage);
    }
    
    // 如果有后端错误码和消息，创建自定义错误对象
    if (error.response.data && error.response.data.code) {
      const customError = new Error(defaultMessage);
      customError.response = {
        data: error.response.data
      };
      throw customError;
    }
  }
  
  // 其他错误继续抛出
  throw error;
};

export const authApi = {
  // 登录接口
  async login(credentials) {
    try {
      // 验证输入数据 - 使用统一验证函数
      validateCredentials(credentials, false);
      
      // 加密密码
      const encryptedPassword = encrypt(credentials.password);
      
      // 构建要发送的数据
      const requestData = {
        name: credentials.name,
        password: encryptedPassword,
        // 添加加密标记，让后端知道密码已加密
        encrypted: true
      };
      
      // 添加时间戳和签名防止重放攻击
      const secureData = addSecuritySignature(requestData);
      
      try {
        const response = await api.post('/solstone/sign_in', secureData);
        if (response.data.code !== 0) {
          // 不直接使用后端消息作为错误文本
          // 创建自定义错误对象，保留完整的响应信息
          const error = new Error('登录失败');
          error.response = {
            data: response.data
          };
          throw error;
        }
        
        return response.data;
      } catch (apiError) {
        // 使用统一错误处理
        handleApiError(apiError, '用户名或密码错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  async signup(registerData) {
    try {
      // 验证注册数据 - 使用统一验证函数
      validateCredentials(registerData, true);
      
      // 加密密码
      const encryptedPassword = encrypt(registerData.password);
      
      // 构建要发送的数据
      const requestData = {
        name: registerData.name,
        password: encryptedPassword,
        phone: registerData.phone || '', 
        email: registerData.email || '',
        // 添加加密标记，让后端知道密码已加密
        encrypted: true
      };
      
      // 添加时间戳和签名防止重放攻击
      const secureData = addSecuritySignature(requestData);
      
      try {
        const response = await api.post('/solstone/sign_up', secureData);
        if (response.data.code !== 0) {
          // 不直接使用后端消息作为错误文本
          // 创建自定义错误对象，保留完整的响应信息
          const error = new Error('注册失败');
          error.response = {
            data: response.data
          };
          throw error;
        }
        
        return response.data;
      } catch (apiError) {
        // 使用统一错误处理
        handleApiError(apiError, '注册信息格式有误，请检查输入');
      }
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  }
};