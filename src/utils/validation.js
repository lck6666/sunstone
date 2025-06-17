/**
 * 验证工具函数 - 安全验证
 */

/**
 * 检测输入内容是否包含SQL注入风险
 * @param {string} input - 需要检测的输入内容
 * @returns {boolean} - 返回true表示安全，false表示存在风险
 */
export const isSqlSafe = (input) => {
  if (!input || typeof input !== 'string') return true;
  
  // SQL注入常见关键字和模式
  const sqlPattern = /('|"|--|\/\*|\*\/|;|DROP|DELETE|UPDATE|INSERT|SELECT|UNION|ALTER|CREATE|EXEC|OR 1=1|AND 1=1)/i;
  
  return !sqlPattern.test(input);
};

/**
 * 检测输入内容是否包含XSS攻击风险
 * @param {string} input - 需要检测的输入内容
 * @returns {boolean} - 返回true表示安全，false表示存在风险
 */
export const isXssSafe = (input) => {
  if (!input || typeof input !== 'string') return true;
  
  // XSS攻击常见模式
  const xssPattern = /<[^>]*script|javascript:|onerror=|onload=|eval\(|setTimeout\(|setInterval\(|new Function\(|document\.cookie/i;
  
  return !xssPattern.test(input);
};

/**
 * 综合安全验证函数 - 进行SQL注入和XSS攻击检查
 * @param {string} input - 需要检测的输入内容
 * @returns {object} - 返回验证结果对象 { valid: boolean, message: string }
 */
export const validateInputSecurity = (input) => {
  if (!input || typeof input !== 'string') {
    return { valid: true, message: '' };
  }
  
  // SQL注入检查
  if (!isSqlSafe(input)) {
    return { 
      valid: false, 
      message: '输入内容包含不安全字符，请避免使用特殊符号和SQL关键字' 
    };
  }
  
  // XSS攻击检查
  if (!isXssSafe(input)) {
    return { 
      valid: false, 
      message: '输入内容包含不安全代码，请避免使用脚本标签和事件处理器' 
    };
  }
  
  // 通过所有检查
  return { valid: true, message: '' };
};

/**
 * 对输入字符串进行基本的安全清理
 * @param {string} input - 输入字符串
 * @returns {string} - 清理后的字符串
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return input;
  
  // 移除或替换危险字符
  return input
    .replace(/['"]/g, '') // 移除引号
    .replace(/;/g, '') // 移除分号
    .replace(/--/g, '') // 移除注释符号
    .replace(/\/\*|\*\//g, '') // 移除块注释
    .trim(); // 移除前后空白
}; 