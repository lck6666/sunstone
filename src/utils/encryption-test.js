import { encrypt, decrypt, addSecuritySignature } from './encryption';
import CryptoJS from 'crypto-js';

/**
 * 加密测试工具，可以在浏览器控制台调用
 */
export const EncryptionTester = {
  /**
   * 测试加密和解密功能
   * @param {string} text - 要测试的文本
   */
  testEncryptDecrypt(text) {
    console.log('===== 加密解密测试 =====');
    console.log('原始文本:', text);
    
    // 加密
    const encrypted = encrypt(text);
    console.log('加密后:', encrypted);
    
    // 解密
    const decrypted = decrypt(encrypted);
    console.log('解密后:', decrypted);
    
    // 验证结果
    const success = text === decrypted;
    console.log('测试结果:', success ? '成功 ✅' : '失败 ❌');
    console.log('==================');
    
    return success;
  },
  
  /**
   * 测试密钥长度是否符合要求
   */
  testKeyLength() {
    console.log('===== 密钥长度测试 =====');
    
    // 直接从encryption.js中获取密钥字符串
    const SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'; // 32字符 = 16字节
    
    // 将十六进制字符串转换为WordArray
    const wordArray = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);
    
    // 获取字节长度
    const keyBytes = wordArray.sigBytes;
    
    // 检查密钥长度
    console.log('十六进制字符串长度:', SECRET_KEY_HEX.length, '字符');
    console.log('转换后的密钥长度:', keyBytes, '字节');
    
    // 验证是否为有效的AES密钥长度
    const isValidLength = [16, 24, 32].includes(keyBytes);
    console.log('是否为有效的AES密钥长度(16/24/32字节):', isValidLength ? '是 ✅' : '否 ❌');
    
    if(!isValidLength) {
      console.warn('警告: 当前密钥长度不符合AES要求的16/24/32字节。请调整密钥长度。');
    }
    
    console.log('==================');
    return isValidLength;
  },
  
  /**
   * 测试IV和加密数据格式
   */
  testIVFormat() {
    console.log('===== IV格式测试 =====');
    
    // 加密示例数据
    const sampleText = 'Test123!';
    const encrypted = encrypt(sampleText);
    
    // 从Base64解码
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encrypted);
    
    // 提取IV(前16字节)
    const iv = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(0, 4),
      16
    );
    
    console.log('IV长度:', iv.sigBytes, '字节');
    console.log('IV(Hex):', CryptoJS.enc.Hex.stringify(iv));
    
    // 验证IV长度是否为16字节(128位)
    const isValidIVLength = iv.sigBytes === 16;
    console.log('IV长度是否符合要求(16字节):', isValidIVLength ? '是 ✅' : '否 ❌');
    
    // 验证密文长度是否为AES块大小(16字节)的倍数
    const ciphertext = CryptoJS.lib.WordArray.create(
      encryptedWordArray.words.slice(4),
      encryptedWordArray.sigBytes - 16
    );
    
    console.log('密文长度:', ciphertext.sigBytes, '字节');
    const isValidCiphertextLength = ciphertext.sigBytes % 16 === 0;
    console.log('密文长度是否为16字节的倍数:', isValidCiphertextLength ? '是 ✅' : '否 ❌');
    
    // 测试使用提取的IV和密文进行解密
    const testResult = this.testManualDecrypt(sampleText, iv, ciphertext);
    
    console.log('==================');
    return isValidIVLength && isValidCiphertextLength && testResult;
  },
  
  /**
   * 测试手动解密过程(模拟后端解密)
   * @param {string} originalText - 原始文本
   * @param {CryptoJS.lib.WordArray} iv - 提取的IV
   * @param {CryptoJS.lib.WordArray} ciphertext - 提取的密文
   */
  testManualDecrypt(originalText, iv, ciphertext) {
    console.log('===== 手动解密测试(模拟后端) =====');
    
    try {
      // 从encryption.js获取密钥
      const SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'; // 32字符 = 16字节
      const key = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);
      
      // 创建CipherParams对象
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        key: key,
        iv: iv,
        algorithm: CryptoJS.algo.AES,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        blockSize: 4
      });
      
      // 手动解密
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      // 转换为UTF-8字符串
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      console.log('原始文本:', originalText);
      console.log('手动解密结果:', result);
      
      // 验证结果
      const success = originalText === result;
      console.log('测试结果:', success ? '成功 ✅' : '失败 ❌');
      
      return success;
    } catch(e) {
      console.error('手动解密失败:', e);
      return false;
    }
  },
  
  /**
   * 测试签名功能
   * @param {Object} data - 要签名的数据
   */
  testSignature(data) {
    console.log('===== 签名测试 =====');
    console.log('原始数据:', data);
    
    // 添加签名
    const signedData = addSecuritySignature(data);
    console.log('签名后:', signedData);
    
    // 模拟验证签名
    const { signature, timestamp, ...payload } = signedData;
    const values = Object.values(data).join('');
    const SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'; // 32字符 = 16字节
    const signString = values + timestamp + SECRET_KEY_HEX;
    const expectedSignature = CryptoJS.SHA256(signString).toString();
    
    // 验证结果
    const success = signature === expectedSignature;
    console.log('验证结果:', success ? '成功 ✅' : '失败 ❌');
    console.log('==================');
    
    return success;
  },
  
  /**
   * 测试请求数据格式
   */
  testRequestFormat() {
    console.log('===== 请求格式测试 =====');
    
    // 模拟登录数据
    const loginData = {
      name: 'testuser',
      password: 'Password123'
    };
    
    // 加密密码
    const encryptedPassword = encrypt(loginData.password);
    
    // 构建请求数据
    const requestData = {
      name: loginData.name,
      password: encryptedPassword,
      encrypted: true
    };
    
    // 添加签名
    const secureData = addSecuritySignature(requestData);
    
    // 检查请求数据格式
    console.log('最终请求数据格式:', {
      name: '用户名',
      password: '加密后的密码',
      encrypted: true,
      timestamp: '时间戳',
      signature: '签名'
    });
    console.log('实际请求数据:', secureData);
    
    // 验证所有必要字段都存在
    const requiredFields = ['name', 'password', 'encrypted', 'timestamp', 'signature'];
    const missingFields = requiredFields.filter(field => !Object.keys(secureData).includes(field));
    
    const success = missingFields.length === 0;
    console.log('验证结果:', success ? '成功 ✅' : '失败 ❌');
    if (!success) {
      console.log('缺少字段:', missingFields);
    }
    console.log('==================');
    
    return success;
  },
  
  /**
   * 运行所有测试
   */
  runAllTests() {
    console.log('======= 开始加密测试 =======');
    const results = {
      keyLength: this.testKeyLength(),
      ivFormat: this.testIVFormat(),
      encryptDecrypt: this.testEncryptDecrypt('TestPassword123!'),
      signature: this.testSignature({ user: 'test', action: 'login' }),
      requestFormat: this.testRequestFormat()
    };
    
    console.log('======= 测试结果汇总 =======');
    console.table(results);
    console.log('============================');
    
    // 判断测试是否全部通过
    const allPassed = Object.values(results).every(result => result === true);
    console.log('所有测试是否通过:', allPassed ? '通过 ✅' : '失败 ❌');
    
    if (!allPassed) {
      console.warn('警告: 部分测试未通过，请检查错误信息并修复问题。');
    }
    
    return results;
  }
};

// 将测试工具导出到全局，方便在控制台测试
window.EncryptionTester = EncryptionTester; 