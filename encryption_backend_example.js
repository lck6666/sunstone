/**
 * 后端解密示例代码
 * 注意：此示例代码仅供参考，需要根据后端实际使用的语言和框架进行调整
 */

// 示例使用Node.js和CryptoJS库
const CryptoJS = require('crypto-js');

// 与前端使用相同的密钥
const SECRET_KEY = 'FD9213CB817A42E892A9FBEF4C5D3';

/**
 * AES解密函数
 * @param {string} encryptedData - 加密后的字符串
 * @returns {string} - 解密后的原始数据
 */
function decrypt(encryptedData) {
  if (!encryptedData) return '';
  
  // 使用AES解密
  const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  
  // 将解密结果转换为UTF-8字符串
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 验证请求签名
 * @param {Object} data - 请求数据
 * @returns {boolean} - 签名是否有效
 */
function verifySignature(data) {
  const { signature, timestamp, ...payload } = data;
  
  // 检查时间戳是否在允许范围内（5分钟）
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  if (Math.abs(now - timestamp) > fiveMinutes) {
    return false;
  }
  
  // 重新计算签名
  const values = Object.values(payload).join('');
  const signString = values + timestamp + SECRET_KEY;
  const expectedSignature = CryptoJS.SHA256(signString).toString();
  
  // 比较签名是否一致
  return signature === expectedSignature;
}

/**
 * 处理登录请求示例
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
function handleSignIn(req, res) {
  try {
    const requestData = req.body;
    
    // 1. 验证签名
    if (!verifySignature(requestData)) {
      return res.status(401).json({ 
        code: -1, 
        msg: '无效的请求签名或请求已过期' 
      });
    }
    
    // 2. 检查是否加密
    if (requestData.encrypted) {
      // 3. 解密密码
      const decryptedPassword = decrypt(requestData.password);
      
      // 4. 使用解密后的密码进行用户验证
      // ... 验证用户名和密码的代码
      
      // 5. 响应
      return res.json({
        code: 0,
        msg: '登录成功',
        data: {
          // 用户信息
        }
      });
    } else {
      // 非加密请求，根据安全策略可能需要拒绝
      return res.status(400).json({
        code: -1,
        msg: '请使用加密方式登录'
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: -1,
      msg: '服务器错误'
    });
  }
}

// 示例路由设置（Express.js）
/*
app.post('/solstone/sign_in', handleSignIn);
app.post('/solstone/sign_up', handleSignUp); // 使用类似的逻辑处理注册请求
*/

module.exports = {
  decrypt,
  verifySignature
}; 