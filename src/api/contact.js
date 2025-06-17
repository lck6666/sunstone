/**
 * 提交联系我们表单到后端
 * @param {Object} data - 包含联系表单数据的对象
 * @returns {Promise} - 返回提交结果的Promise
 */
import { getApiConfig } from '../config';

const { baseURL } = getApiConfig();

export const submitContactForm = async (data) => {
  try {
    // 只保留非空字段
    const processedData = {};
    Object.keys(data).forEach(key => {
      // 如果字段值不是空字符串且不是null，才添加到要提交的数据中
      if (data[key] !== '' && data[key] !== null) {
        processedData[key] = data[key];
      }
    });
    
    //console.log('提交的数据:', processedData); // 记录发送的数据内容，便于调试
    
    const response = await fetch(`${baseURL}/solstone/contact_save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(processedData)
    });

    if (!response.ok) {
      // 尝试读取错误响应内容
      let errorText;
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
      } catch {
        errorText = await response.text();
      }
      
      //console.error(`提交失败: 状态码 ${response.status}, 错误信息: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    //console.error('提交联系表单失败:', error);
    throw error;
  }
}; 