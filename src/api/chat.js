// // src/api/chat.js
// import { getApiConfig } from '../config';

// const { baseURL } = getApiConfig();

// export const getStreamedAnswer = async (payload, token, userId) => {
//   const requestPayload = {
//     ...payload,
//     user_id: userId
//   };

//   const response = await fetch(`${baseURL}/solstone/chat`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify(requestPayload)
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   return response.body.getReader();
// };

// src/api/chat.js
import { getApiConfig } from '../config';

const { baseURL } = getApiConfig();

/**
 * 模拟一个返回固定文字的流式响应,这是测试用的数据
 */
export const getStreamedAnswer = async (payload, token, userId) => {
  const fixedText = '这是本地测试用的返回内容。\n欢迎使用本地模拟数据。\n';

  // 将文本转换成 Uint8Array
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(fixedText);

  // 模拟一个 ReadableStream 的 reader
  const mockReader = {
    readIndex: 0,
    read() {
      if (this.readIndex >= encodedText.length) {
        return Promise.resolve({ done: true, value: undefined });
      }

      const chunk = encodedText.slice(this.readIndex, this.readIndex + 20);
      this.readIndex += 20;
      return Promise.resolve({ done: false, value: chunk });
    },
    releaseLock() {
      // 模拟方法
    }
  };

  return mockReader;
};
