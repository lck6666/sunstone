// src/api/chat_history.js
import api from './axiosConfig';

// 获取历史对话列表的接口
export const getHistoryConversationList = async (userId, token) => {
  try {
    const response = await api.get('/solstone/history_list', {
      params: {
        user_id: userId
      }
    });
    if (response.data.code !== 0) { // 修改为数值比较
      throw new Error(response.data.msg);
    }
    return response.data.data;
  } catch (error) {
    console.error('获取历史对话列表时出错:', error);
    throw error;
  }
};

// 获取某次历史对话详情的接口
export const getHistoryConversationDetail = async (userId, recordId, token) => {
  try {
    const response = await api.get('/solstone/history_chat', {
      params: {
        user_id: userId,
        record_id: recordId
      }
    });
    if (response.data.code !== 0) { // 修改为数值比较
      throw new Error(response.data.msg);
    }
    return response.data.data;
  } catch (error) {
    console.error('获取历史对话详情时出错:', error);
    throw error;
  }
};

// 保存历史对话记录的接口
export const saveHistoryConversation = async (data, token) => {
  try {
    const response = await api.post('/solstone/chat_save', data);
    if (response.data.code !== 0) { // 修改为数值比较
      throw new Error(response.data.msg);
    }
    return response.data;
  } catch (error) {
    console.error('保存历史对话记录时出错:', error);
    throw error;
  }
};