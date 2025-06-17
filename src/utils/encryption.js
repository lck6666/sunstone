import CryptoJS from 'crypto-js';

// 固定的加密密钥，16字节(128位)，符合AES-128要求
// 在生产环境中应通过更安全的方式管理
// 注意：以十六进制字符串表示的密钥需要转换为正确的WordArray格式
// 十六进制字符串长度必须是32字符(16字节)或64字符(32字节)
const SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'; // 32字符 = 16字节
const SECRET_KEY = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);

// 或者使用UTF-8编码的字符串密钥
// 该密钥会被转换为字节数据
// const SECRET_KEY = CryptoJS.enc.Utf8.parse('这是16字节UTF8密钥');

/**
 * AES-CBC加密，兼容后端解密函数
 * @param {string} data - 需要加密的数据
 * @param {CryptoJS.lib.WordArray|string} key - 加密密钥，需要16/24/32字节
 * @returns {string} - Base64编码的加密结果
 */
export const encrypt = (data, key = SECRET_KEY) => {
  if (!data) return '';
  
  // 将数据转换为字符串
  const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
  
  // 生成16字节(128位)的随机IV
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // 如果密钥是字符串，将其转换为WordArray
  const keyWordArray = typeof key === 'string' ? CryptoJS.enc.Hex.parse(key) : key;
  
  // 使用AES-CBC模式加密
  const encrypted = CryptoJS.AES.encrypt(dataStr, keyWordArray, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // 获取加密后的原始数据(WordArray)
  const ciphertext = encrypted.ciphertext;
  
  // 将IV和密文合并
  const ivAndCiphertext = CryptoJS.lib.WordArray.create()
    .concat(iv)
    .concat(ciphertext);
  
  // 转换为Base64格式
  const result = CryptoJS.enc.Base64.stringify(ivAndCiphertext);
  
  // 输出调试信息
/*   console.log('====== 加密信息 ======');
  console.log('原始数据:', dataStr);
  console.log('IV(16字节):', CryptoJS.enc.Hex.stringify(iv));
  console.log('密钥(Hex):', CryptoJS.enc.Hex.stringify(keyWordArray));
  console.log('密钥长度:', keyWordArray.sigBytes, '字节');
  console.log('密文:', CryptoJS.enc.Hex.stringify(ciphertext));
  console.log('合并后(IV+密文):', CryptoJS.enc.Hex.stringify(ivAndCiphertext));
  console.log('Base64结果:', result);
  console.log('====================='); */
  
  return result;
};

/**
 * AES-CBC解密，兼容后端解密函数
 * @param {string} encryptedBase64 - Base64编码的加密数据
 * @param {CryptoJS.lib.WordArray|string} key - 解密密钥，需要16/24/32字节
 * @returns {string} - 解密后的原始数据
 */
export const decrypt = (encryptedBase64, key = SECRET_KEY) => {
  if (!encryptedBase64) return '';
  
  try {
    // 从Base64解码
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedBase64);
    
    // 前16字节是IV
    const iv = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(0, 4), // 16字节 = 4个32位字
      16
    );
    
    // 剩余部分是加密数据
    const ciphertext = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(4), 
      encryptedWordArray.sigBytes - 16
    );
    
    // 如果密钥是字符串，将其转换为WordArray
    const keyWordArray = typeof key === 'string' ? CryptoJS.enc.Hex.parse(key) : key;
    
    // 准备CipherParams对象
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
      key: keyWordArray,
      iv: iv,
      algorithm: CryptoJS.algo.AES,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      blockSize: 4,
      formatter: CryptoJS.format.OpenSSL
    });
    
    // 解密
    const decrypted = CryptoJS.AES.decrypt(cipherParams, keyWordArray, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // 转换为UTF-8字符串
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    // 输出调试信息
    console.log('====== 解密信息 ======');
    console.log('加密数据(Base64):', encryptedBase64);
    console.log('IV(16字节):', CryptoJS.enc.Hex.stringify(iv));
    console.log('密钥(Hex):', CryptoJS.enc.Hex.stringify(keyWordArray));
    console.log('密钥长度:', keyWordArray.sigBytes, '字节');
    console.log('密文:', CryptoJS.enc.Hex.stringify(ciphertext));
    console.log('解密结果:', result);
    console.log('=====================');
    
    return result;
  } catch (e) {
    console.error('解密失败:', e);
    return '';
  }
};

/**
 * 仅加密敏感字段的对象加密函数
 * @param {Object} data - 包含需要加密字段的对象
 * @param {Array} sensitiveFields - 需要加密的敏感字段名数组
 * @returns {Object} - 处理后的对象，敏感字段被加密
 */
export const encryptSensitiveData = (data, sensitiveFields) => {
  if (!data || !sensitiveFields || !sensitiveFields.length) return data;
  
  const result = { ...data };
  
  // 只加密指定的敏感字段
  sensitiveFields.forEach(field => {
    if (result[field]) {
      result[field] = encrypt(result[field]);
    }
  });
  
  // 添加标记表明数据已加密
  result.__encrypted = sensitiveFields;
  
  return result;
};

/**
 * 生成用于防止重放攻击的请求签名
 * @param {Object} data - 请求数据
 * @returns {Object} - 添加了时间戳和签名的数据
 */
export const addSecuritySignature = (data) => {
  // 添加时间戳
  const timestamp = Date.now();
  const dataWithTimestamp = { 
    ...data, 
    timestamp 
  };
  
  // 计算签名：对象值连接+时间戳的哈希值
  const values = Object.values(data).join('');
  // 使用SECRET_KEY_HEX作为字符串用于签名
  const signString = values + timestamp + SECRET_KEY_HEX;
  const signature = CryptoJS.SHA256(signString).toString();
  
  // 输出调试信息
/*   console.log('====== 签名信息 ======');
  console.log('原始数据:', data);
  console.log('添加时间戳:', timestamp);
  console.log('签名字符串:', signString);
  console.log('生成签名:', signature);
  console.log('最终请求数据:', { ...dataWithTimestamp, signature });
  console.log('====================='); */
  
  // 返回带有安全签名的数据
  return {
    ...dataWithTimestamp,
    signature
  };
};

// 将加密函数暴露到全局环境，方便在浏览器控制台和测试页面中使用
window.encrypt = encrypt;
window.decrypt = decrypt;
window.addSecuritySignature = addSecuritySignature;
window.encryptSensitiveData = encryptSensitiveData; 