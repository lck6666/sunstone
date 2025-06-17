// src/api/chat.js
import { getApiConfig } from '../config';

const { baseURL } = getApiConfig();

export const getStreamedAnswer = async (payload, token, userId) => {
  const requestPayload = {
    ...payload,
    user_id: userId
  };

  const response = await fetch(`${baseURL}/solstone/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.body.getReader();
};