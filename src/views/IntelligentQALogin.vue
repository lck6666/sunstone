<template>
  <div class="page-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-item" @click="toggleSidebar"><div class="sidebar-icon"><img src="../assets/images/sidebar侧边栏.png"></div></div>
      <div v-if="!isCollapsed" class="sidebar-title" @click="newConversation">新建对话</div>
      <div v-if="!isCollapsed" class="sidebar-title" @click="toggleHistoryList">
        历史对话
        <span class="toggle-icon">{{ showHistoryList ? '▼' : '▶' }}</span>
      </div>
      <div v-if="historyConversationList.length > 0 && !isCollapsed && showHistoryList" class="history-list">
        <div
          v-for="item in historyConversationList"
          :key="item.record_id"
          class="history-item"
          :class="{ selected: selectedRecordId === item.record_id }"
          @click="loadHistoryConversationDetail(item.record_id)"
        >
          <div class="history-item-content">{{ item.content }} </div>
          <div class="history-item-time">{{ new Date(item.chat_time).toISOString().split('T')[0] }}</div>
        </div>
      </div>
    </div>

    <!-- 内容容器 -->
    <div class="content-container" :style="{ marginLeft: sidebarWidth }">
      <!-- 主内容 -->
      <main class="main-content">
        <div class="dialog-wrapper">
          <h2 class="dialog-greeting">懂你所问、答你所求</h2>

          <!-- 聊天记录区域 -->
          <div class="chat-container" ref="chatContainer">
            <div class="chat-messages" ref="chatMessages" @scroll="handleScroll">
              <template v-for="(msg, index) in messages" :key="index">
                <!-- 用户消息 -->
                <div v-if="msg.role === 'user'" class="user-message-wrapper">
                  <div class="user-message">{{ msg.content }}</div>
                  <img class="user-avatar" src="..\assets\images\default-avatar.svg" alt="User Avatar">
                </div>
                <!-- AI助手消息 -->
                <div v-if="msg.role === 'AI'" class="assistant-message-wrapper">
                  <img class="assistant-avatar" src="..\assets\images\default-avatar.svg" alt="Assistant Avatar">
                  <div class="assistant-message-container">
                    <!-- 思考过程 -->
                    <div v-if="msg.think" class="think-process">
                      <div class="think-content" v-html="renderMarkdown(msg.think)"></div>
                    </div>
                    <!-- 回答内容 -->
                    <div v-if="msg.content" class="assistant-message" v-html="renderMarkdown(msg.content)"></div>
                    <!-- 法规核校思考过程 -->
                    <div v-if="msg.lawThink" class="think-process">
                      <div class="think-content" v-html="renderMarkdown(msg.lawThink)"></div>
                    </div>
                    <!-- 核校后回答内容 -->
                    <div v-if="msg.lawContent" class="assistant-message" v-html="renderMarkdown(msg.lawContent)"></div>
                  </div>
                </div>
              </template>
            </div>
            <!-- 添加提示信息元素 -->
            <div class="ai-generated-tip">内容由 AI 生成，请注意甄别</div>
          </div>

          <!-- 输入区域 -->
          <div class="main-dialog">
            <div class="question-container">
              <textarea
                ref="questionInput"
                class="question-input"
                v-model="questionText"
                @blur="handleBlur"
                @input="autoResize"
                @focus="handleFocus"
                @keyup.enter="startConversation"
                placeholder="请输入您的问题"
                rows="1"
              ></textarea>
            </div>
            <div class="action-container">
              <div class="tags-group">
                <div
                  v-for="tag in tags"
                  :key="tag"
                  class="tag-item"
                  :class="{ selected: selectedTags.includes(tag) }"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </div>
              </div>
              <button class="start-button" 
                      @click="startConversation"
                      :disabled="!isInputValid||isStreaming"
                      :title="!isInputValid ? '请先输入信息' : ''">
                发送
              </button>
            </div>
          </div>
          
          <div class="feedback-link" @click="showFeedbackModal">意见反馈</div>
        </div>

      </main>
      
      <!-- 参考资料弹窗 - 调整为绝对定位 -->
      <div class="reference-container" v-if="currentReference">
        <div class="reference-header">
          <span>参考资料</span>
          <button class="reference-close" @click="currentReference = ''">×</button>
        </div>
        <div class="reference-content" v-html="renderMarkdown(currentReference)"></div>
      </div>

      
      <!-- 反馈意见弹窗，初始为隐藏 -->
      <div class="feedback-modal" v-if="showFeedback">
        <div class="feedback-modal-header">
          <h3>意见反馈</h3>
          <button class="close-button" @click="closeFeedbackModal">x</button>
        </div>
        <div class="feedback-modal-body">
          <textarea v-model="feedbackText" placeholder="请输入您的反馈意见" resize="none"></textarea>
        </div>
        <div class="feedback-modal-footer">
          <button @click="submitFeedback">提交反馈</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 智能问答登录组件 
// 用于用户登录后的智能问答界面
import { v4 as uuidv4 } from 'uuid';
import { ref, computed, nextTick, watch, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getHistoryConversationList, getHistoryConversationDetail, saveHistoryConversation } from '@/api/chat_history.js';
import { getStreamedAnswer } from '@/api/chat.js';
import { marked } from 'marked';
import store from '@/store.js';
import { submitFeedback as submitFeedbackAPI } from '@/api/feedback.js'; // 引入反馈 API
import CryptoJS from 'crypto-js';

// 固定的加密密钥，16字节(128位)，符合AES-128要求
// 在生产环境中应通过更安全的方式管理
const SECRET_KEY_HEX = 'FD9213CB817A42E892A9FBEF4C5D3678'; // 32字符 = 16字节
const SECRET_KEY = CryptoJS.enc.Hex.parse(SECRET_KEY_HEX);

// 配置marked选项
marked.setOptions({
  breaks: true, // 允许换行
  gfm: true,    // 允许GitHub风格Markdown
});

// Markdown渲染函数
const renderMarkdown = (text) => {
  if (!text) return '';
  try {
    return marked(text);
  } catch (e) {
    //console.error('Markdown解析错误:', e);
    return text;
  }
};

const tags = ['深度思考', '联网搜索', '法规遵循'];
const selectedTags = ref([]);
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const questionText = ref('请输入您的问题');
const questionInput = ref(null);
const initialTextHeight = 40;
const maxTextAreaHeight = 120;
const textareaHeight = ref(initialTextHeight);
const isCollapsed = ref(true);
const isEditingQuestion = ref(true); // 新增定义
const showHistoryList = ref(false); // 控制历史列表显示状态

const autoResize = () => {
  nextTick(() => {
    if (questionInput.value) {
      questionInput.value.style.height = 'auto';
      const newHeight = questionInput.value.scrollHeight;
      if (newHeight > maxTextAreaHeight) {
        questionInput.value.style.height = maxTextAreaHeight + 'px';
        textareaHeight.value = maxTextAreaHeight;
      } else {
        questionInput.value.style.height = newHeight + 'px';
        textareaHeight.value = newHeight;
      }
    }
  });
};

watch(questionText, () => {
  if (isEditingQuestion.value) {
    autoResize();
  }
});

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const sidebarWidth = computed(() => (isCollapsed.value ? '50px' : '200px'));

const currentUser = ref('');
const currentToken = ref('');
const getUser = () => sessionStorage.getItem('user_id');
const getToken = () => sessionStorage.getItem('access_token');
const loadUser = () => {
  const user = getUser();
  const token = getToken();
  if (user) {
    currentUser.value = user;
    currentToken.value = token;
  } else {
    //console.warn('未检测到登录信息');
  }
};
loadUser();

const router = useRouter();
onBeforeMount(() => {
  if (!getUser()) {
    router.replace('/login');
  }
});

const messages = ref([]);
const currentReference = ref(''); // 添加当前参考资料

const chatContainer = ref(null);
const chatMessages = ref(null);
const historyConversationList = ref([]);
const currentRecordId = ref(null);
const selectedRecordId = ref(null);
const isStreaming = ref(false);
const isUserScrolling = ref(false);
const lastScrollTop = ref(0);

// 添加滚动事件处理
const handleScroll = () => {
  if (chatMessages.value) {
    const currentScrollTop = chatMessages.value.scrollTop;
    const maxScrollTop = chatMessages.value.scrollHeight - chatMessages.value.clientHeight;
    
    // 如果用户向上滚动或未滚动到底部，标记为用户正在滚动
    if (currentScrollTop < lastScrollTop.value || currentScrollTop < maxScrollTop - 50) {
      isUserScrolling.value = true;
    } else if (currentScrollTop >= maxScrollTop - 50) {
      // 如果用户已滚动到底部，重置标记
      isUserScrolling.value = false;
    }
    
    lastScrollTop.value = currentScrollTop;
  }
};

// 在消息显示时检查是否需要自动滚动
const autoScroll = () => {
  if (chatMessages.value && !isUserScrolling.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// 在消息添加后强制滚动到底部
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// 生成 UUID 的函数
const generateUUID = () => {
  return uuidv4();
};

const startConversation = async () => {
  if (!isInputValid.value) return;
  const userMessage = questionText.value;

  if (!currentRecordId.value) { 
    currentRecordId.value = generateUUID(); 
  }

  // 计算当前聊天轮次
  const chatRound = messages.value.length + 1;

  try {
    isStreaming.value = true;
    currentReference.value = '';
    let fullResult = '';

    // 添加用户消息到历史记录
    messages.value.push({ role: 'user', content: userMessage });
    questionText.value = '';
    textareaHeight.value = initialTextHeight;

    try {
      await saveHistoryConversation({
        user_id: currentUser.value,
        record_id: currentRecordId.value,
        chat_round: chatRound.toString(),
        role: 'user',
        content: userMessage
      }, currentToken.value);
//      console.log('user query saved');
    } catch (error) {
      //console.error('保存用户消息失败:', error);
      // 继续执行，不中断对话流程
    }

    // 在用户消息添加后滚动到底部
    nextTick(() => {
      scrollToBottom();
      if (questionInput.value) {
        questionInput.value.focus(); 
      }
    });
    
    // 添加一个AI回复占位消息
    messages.value.push({ 
      role: 'AI', 
      content: '', 
      think: '',
      lawThink: '',
      lawContent: ''
    });
    const aiMessageIndex = messages.value.length - 1;
    
    // 在AI回复消息添加后再次滚动到底部
    nextTick(() => {
      scrollToBottom();
    });

    const payload = {
      query: userMessage,
      is_deep: selectedTags.value.includes('深度思考'),
      is_network: selectedTags.value.includes('联网搜索'),
      is_law: selectedTags.value.includes('法规遵循'),
      history: messages.value.slice(0, -1) // 排除新添加的消息
    };

    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('user_id');
    const reader = await getStreamedAnswer(payload, token, userId);
    const decoder = new TextDecoder();
    
    // 状态变量
    let thinkBuffer = '';     // 思考内容缓冲区
    let answerBuffer = '';    // 回答内容缓冲区
    let lawThinkBuffer = '';  // 法规核校思考内容缓冲区
    let lawAnswerBuffer = ''; // 核校后回答内容缓冲区
    let referenceBuffer = ''; // 参考资料缓冲区
    let tagBuffer = '';       // 标签检测缓冲区
    
    // 内容类型状态
    const STATE = {
      INIT: 'init',           // 初始状态，尚未确定内容类型
      THINKING: 'thinking',   // 正在接收思考内容
      ANSWERING: 'answering', // 正在接收回答内容
      LAW_THINKING: 'law_thinking', // 正在接收法规核校思考内容
      LAW_ANSWERING: 'law_answering', // 正在接收核校后回答内容
      REFERENCE: 'reference'  // 正在接收参考资料内容
    };
    
    let currentState = STATE.INIT;
    
    // 处理接收到的字符
    const processChar = (char) => {
      // 检查是否需要开始收集标签
      if (char === '<') {
        tagBuffer = '<';
        return;
      }
      
      // 正在收集标签
      if (tagBuffer.length > 0) {
        tagBuffer += char;
        
        // 检查是否是开始思考标签
        if (tagBuffer === '<think>') {
//          console.log('开始接收思考内容');
          currentState = STATE.THINKING;
          tagBuffer = '';
          return;
        }
        
        // 检查是否是结束思考标签
        if (tagBuffer === '</think>') {
//          console.log('结束接收思考内容，开始接收回答内容');
          currentState = STATE.ANSWERING;
          tagBuffer = '';
          // 标签处理完毕，更新UI
          updateMessage();
          return;
        }
        
        // 检查是否是开始法规核校思考标签
        if (tagBuffer === '<law>') {
//          console.log('开始接收法规核校思考内容');
          currentState = STATE.LAW_THINKING;
          tagBuffer = '';
          return;
        }
        
        // 检查是否是结束法规核校思考标签
        if (tagBuffer === '</law>') {
//          console.log('结束接收法规核校思考内容，开始接收核校后回答内容');
          currentState = STATE.LAW_ANSWERING;
          tagBuffer = '';
          // 标签处理完毕，更新UI
          updateMessage();
          return;
        }
        
        // 检查是否是参考资料标签
        if (tagBuffer === '<ref>') {
//          console.log('开始接收参考资料内容');
          currentState = STATE.REFERENCE;
          tagBuffer = '';
          return;
        }
        
        // 如果标签不完整但长度超过特定阈值，可能不是标签
        if (tagBuffer.length > 6 && !tagBuffer.includes('think') && !tagBuffer.includes('law') && !tagBuffer.includes('ref')) {
          // 根据当前状态，将标签内容放入对应缓冲区
          if (currentState === STATE.THINKING) {
            thinkBuffer += tagBuffer;
          } else if (currentState === STATE.ANSWERING) {
            answerBuffer += tagBuffer;
          } else if (currentState === STATE.LAW_THINKING) {
            lawThinkBuffer += tagBuffer;
          } else if (currentState === STATE.LAW_ANSWERING) {
            lawAnswerBuffer += tagBuffer;
          } else if (currentState === STATE.REFERENCE) {
            referenceBuffer += tagBuffer;
          } else {
            // 初始状态，默认作为回答内容
            answerBuffer += tagBuffer;
          }
          tagBuffer = '';
        }
        
        // 继续收集标签
        return;
      }
      
      // 根据当前状态，将字符放入对应缓冲区
      if (currentState === STATE.THINKING) {
        thinkBuffer += char;
      } else if (currentState === STATE.ANSWERING) {
        answerBuffer += char;
      } else if (currentState === STATE.LAW_THINKING) {
        lawThinkBuffer += char;
      } else if (currentState === STATE.LAW_ANSWERING) {
        lawAnswerBuffer += char;
      } else if (currentState === STATE.REFERENCE) {
        referenceBuffer += char;
      } else {
        // 初始状态，默认作为回答内容
        answerBuffer += char;
      }
    };
    
    // 更新消息显示
    const updateMessage = () => {
      let contentChanged = false;
      
      // 更新思考内容 - 去除开头空行
      if (thinkBuffer && messages.value[aiMessageIndex].think !== thinkBuffer) {
        // 移除开头可能的空行，同时处理多余的空行
        const cleanThinkBuffer = thinkBuffer.replace(/^\s*\n/, '').replace(/\n{3,}/g, '\n\n');
        messages.value[aiMessageIndex].think = cleanThinkBuffer;
        contentChanged = true;
      }
      
      // 更新回答内容
      if (messages.value[aiMessageIndex].content !== answerBuffer) {
        messages.value[aiMessageIndex].content = answerBuffer;
        contentChanged = true;
      }
      
      // 更新法规核校思考内容
      if (lawThinkBuffer && messages.value[aiMessageIndex].lawThink !== lawThinkBuffer) {
        // 移除开头可能的空行，同时处理多余的空行
        const cleanLawThinkBuffer = lawThinkBuffer.replace(/^\s*\n/, '').replace(/\n{3,}/g, '\n\n');
        messages.value[aiMessageIndex].lawThink = cleanLawThinkBuffer;
        contentChanged = true;
      }
      
      // 更新法规核校后回答内容
      if (messages.value[aiMessageIndex].lawContent !== lawAnswerBuffer) {
        messages.value[aiMessageIndex].lawContent = lawAnswerBuffer;
        contentChanged = true;
      }
      
      // 更新参考资料（一次性设置，而非流式显示）
      if (referenceBuffer && currentReference.value !== referenceBuffer) {
        currentReference.value = referenceBuffer;
        contentChanged = true;
//        console.log('设置参考资料:', referenceBuffer);
      }
      
      // 如果内容有变化，执行自动滚动
      if (contentChanged) {
        nextTick(() => {
          autoScroll();
        });
      }
    };
    
    // 设置定时更新UI的计时器
    let updateTimer = null;
    const startUpdateTimer = () => {
      if (!updateTimer) {
        updateTimer = setInterval(() => {
          updateMessage();
        }, 50);
      }
    };
    
    try {
      startUpdateTimer();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
//          console.log('接收数据完成');
          // 最后一次更新，确保所有内容都显示
          updateMessage();
          clearInterval(updateTimer);
          updateTimer = null;
          break;
        }
        
        // 解码接收到的内容块
        const chunk = decoder.decode(value, { stream: true });
//        console.log(`接收到数据块: ${chunk.length} 字符`);
        
        // 处理每个字符
        for (const char of chunk) {
          processChar(char);
        }
        
        fullResult += chunk; // 累积完整响应内容，用于保存
      }
    } catch (error) {
      //console.error('数据流处理错误:', error);
      clearInterval(updateTimer);
    }

    // 最终滚动到底部
    nextTick(() => {
      scrollToBottom();
      isUserScrolling.value = false;
    });

    try {
      // 打印后端返回的完整内容
      //console.log('后端返回的完整内容:', fullResult);
      
      // 保存完整的内容，包括思考和回答
      await saveHistoryConversation({
        user_id: currentUser.value,
        record_id: currentRecordId.value,
        chat_round: (chatRound + 1).toString(),
        role: 'AI',
        content: fullResult // 使用完整的结果
      }, currentToken.value);
//      console.log('AI answer saved');
      
      // 对话完成后刷新历史对话列表
      if (showHistoryList.value) {
        await loadHistoryConversationList(); // 更新历史对话列表
      }
    } catch (error) {
      //console.error('保存AI回复失败:', error);
      // 不中断对话流程
    }
  } catch (error) {
    //console.error('对话处理失败:', error);
  } finally {
    isStreaming.value = false;
  }
};

const newConversation = () => {
  messages.value = [];
  currentRecordId.value = null;
  selectedRecordId.value = null;
  currentReference.value = ''; // 清空参考资料
  
  // 如果对话为空，显示欢迎提示
  if (messages.value.length === 0) {
    // 在输入框添加焦点并给出提示
    nextTick(() => {
      if (questionInput.value) {
        questionInput.value.focus();
      }
      // 可选：显示轻微的动画效果或提示
      const dialogGreeting = document.querySelector('.dialog-greeting');
      if (dialogGreeting) {
        // 添加一个临时的动画类
        dialogGreeting.classList.add('greeting-highlight');
        // 一段时间后移除
        setTimeout(() => {
          dialogGreeting.classList.remove('greeting-highlight');
        }, 1000);
      }
    });
  }
};

// 切换历史对话列表显示状态
const toggleHistoryList = async () => {
  showHistoryList.value = !showHistoryList.value;
  
  // 每次展开时都重新加载历史对话列表
  if (showHistoryList.value) {
    await loadHistoryConversationList();
  }
};

// 加载历史对话列表
const loadHistoryConversationList = async () => {
  try {
    const response = await getHistoryConversationList(currentUser.value, currentToken.value);
    historyConversationList.value = response.sort((a, b) => b.chat_time - a.chat_time);
  } catch (error) {
    //console.error('加载历史对话列表时出错:', error);
  }
};

const loadHistoryConversationDetail = async (recordId) => {
  try {
    selectedRecordId.value = recordId;
    const response = await getHistoryConversationDetail(currentUser.value, recordId, currentToken.value);
    // 按照聊天轮次排序
    const sortedResponse = response.sort((a, b) => a.chat_round - b.chat_round);
    
    // 初始化currentReference
    currentReference.value = '';
    
    // 处理历史消息
    messages.value = [];
    sortedResponse.forEach(msg => {
      if (msg.role === 'AI') {
        // 使用与实时消息相同的解析逻辑
        let thinkContent = '';
        let answerContent = '';
        let lawThinkContent = '';
        let lawAnswerContent = '';
        let referenceContent = '';
        
        // 简化的解析逻辑，专用于历史消息
        const content = msg.content;
        
        // 提取思考内容
        const thinkStartIndex = content.indexOf('<think>');
        const thinkEndIndex = content.indexOf('</think>');
        if (thinkStartIndex !== -1 && thinkEndIndex !== -1 && thinkEndIndex > thinkStartIndex) {
          thinkContent = content.substring(thinkStartIndex + 7, thinkEndIndex).trim();
          // 处理多余的空行
          thinkContent = thinkContent.replace(/\n{3,}/g, '\n\n');
        }
        
        // 提取法规核校思考内容
        const lawStartIndex = content.indexOf('<law>');
        const lawEndIndex = content.indexOf('</law>');
        if (lawStartIndex !== -1 && lawEndIndex !== -1 && lawEndIndex > lawStartIndex) {
          lawThinkContent = content.substring(lawStartIndex + 5, lawEndIndex).trim();
          // 处理多余的空行
          lawThinkContent = lawThinkContent.replace(/\n{3,}/g, '\n\n');
        }
        
        // 提取参考资料
        const refIndex = content.indexOf('<ref>');
        if (refIndex !== -1) {
          referenceContent = content.substring(refIndex + 5);
          currentReference.value = referenceContent;
        }
        
        // 提取回答内容（移除标签）
        let contentWithoutTags = content;
        
        // 处理思考部分
        if (thinkStartIndex !== -1 && thinkEndIndex !== -1) {
          // 移除思考标签部分
          contentWithoutTags = contentWithoutTags.substring(0, thinkStartIndex) + 
                               contentWithoutTags.substring(thinkEndIndex + 8);
        }
        
        // 处理法规核校部分
        if (lawStartIndex !== -1 && lawEndIndex !== -1) {
          // 获取法规核校前的回答内容
          answerContent = contentWithoutTags.substring(0, lawStartIndex).trim();
          
          // 获取法规核校后的回答内容
          if (refIndex !== -1) {
            // 如果有参考资料，提取核校后回答到参考资料前
            lawAnswerContent = contentWithoutTags.substring(lawEndIndex + 6, refIndex).trim();
          } else {
            // 如果没有参考资料，提取核校后回答到结尾
            lawAnswerContent = contentWithoutTags.substring(lawEndIndex + 6).trim();
          }
        } else {
          // 如果没有法规核校内容
          if (refIndex !== -1) {
            // 如果有参考资料，提取回答到参考资料前
            answerContent = contentWithoutTags.substring(0, refIndex).trim();
          } else {
            // 如果没有参考资料，全部内容都是回答
            answerContent = contentWithoutTags.trim();
          }
        }
        
        // 添加处理后的消息
        messages.value.push({
          role: 'AI',
          content: answerContent.trim(),
          think: thinkContent.trim(),
          lawThink: lawThinkContent.trim(),
          lawContent: lawAnswerContent.trim()
        });
      } else {
        // 用户消息直接添加
        messages.value.push(msg);
      }
    });
    
    currentRecordId.value = recordId;
    
    nextTick(() => {
      if (chatContainer.value) {
        scrollToBottom();
      }
    });
  } catch (error) {
    //console.error('加载历史对话详情时出错:', error);
  }
};

const showFeedback = ref(false);
const feedbackText = ref('');

const showFeedbackModal = () => {
  showFeedback.value = true;
};

const closeFeedbackModal = () => {
  showFeedback.value = false;
  feedbackText.value = ''; // 清空输入框内容
};

const submitFeedback = async () => {
  if (feedbackText.value.trim()) {
    try {
      // 准备提交数据
      const feedbackData = {
        user_id: currentUser.value || 'guest', // 使用当前用户 ID，如果不存在则使用 guest
        feedback: feedbackText.value.trim()
      };
      
      // 调用 API 提交反馈
      await submitFeedbackAPI(feedbackData);
      alert('感谢您的反馈！');
      closeFeedbackModal(); // 提交后关闭弹窗
    } catch (error) {
      alert('提交反馈失败，请稍后再试');
      //console.error('提交反馈失败:', error);
    }
  } else {
    alert('请输入反馈意见内容');
  }
};

const handleBlur = () => {
  if (!questionText.value.trim() || questionText.value.trim() === '请输入您的问题') {
    questionText.value = '请输入您的问题';
  }
};

const handleFocus = () => {
  if (questionText.value === '请输入您的问题') {
    questionText.value = '';
  }
};

const isInputValid = computed(() => {
  const trimmed = questionText.value.trim();
  return trimmed !== '';
});

/**
 * AES-CBC解密，兼容后端加密函数
 * @param {string} encryptedBase64 - Base64编码的加密数据
 * @param {CryptoJS.lib.WordArray} key - 解密密钥，需要16/24/32字节
 * @returns {string} - 解密后的原始数据
 */
const decrypt = (encryptedBase64, key = SECRET_KEY) => {
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
    
    // 准备CipherParams对象
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: ciphertext,
      key: key,
      iv: iv,
      algorithm: CryptoJS.algo.AES,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      blockSize: 4,
      formatter: CryptoJS.format.OpenSSL
    });
    
    // 解密
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // 转换为UTF-8字符串
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    // 输出调试信息
/*     console.log('====== 解密信息 ======');
    console.log('加密数据(Base64):', encryptedBase64);
    console.log('IV:', CryptoJS.enc.Hex.stringify(iv));
    console.log('密文:', CryptoJS.enc.Hex.stringify(ciphertext));
    console.log('解密结果:', result);
    console.log('====================='); */
    
    return result;
  } catch (e) {
    console.error('解密失败:', e);
    return '';
  }
};

/**
 * AES-CBC加密，兼容后端加密函数
 * @param {string} data - 需要加密的数据
 * @param {CryptoJS.lib.WordArray} key - 加密密钥，需要16/24/32字节
 * @returns {string} - Base64编码的加密结果
 */
const encrypt = (data, key = SECRET_KEY) => {
  if (!data) return '';
  
  // 将数据转换为字符串
  const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
  
  // 生成16字节(128位)的随机IV
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // 使用AES-CBC模式加密
  const encrypted = CryptoJS.AES.encrypt(dataStr, key, {
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
  console.log('IV:', CryptoJS.enc.Hex.stringify(iv));
  console.log('密文:', CryptoJS.enc.Hex.stringify(ciphertext));
  console.log('合并后(IV+密文):', CryptoJS.enc.Hex.stringify(ivAndCiphertext));
  console.log('Base64结果:', result);
  console.log('====================='); */
  
  return result;
};

</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>

<style scoped>

.page-container {
  position: relative;
}

/* 侧边栏 */
.sidebar {
  position: static;
  float: left;
  width: 200px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  z-index: 999;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
.sidebar.collapsed {
  width: 50px;
}

/* 侧边栏标题样式 */
.sidebar-title {
  padding: 14px 20px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 500;
  color: #505050;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.sidebar-title:hover {
  background: #f0f0f0;
  color: #505050;
  transform: translateX(3px);
}

.sidebar-item {
  padding: 14px 20px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
  color: #505050;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item:first-child {
  background-color: #e9f0f8;
  color: #2c78c5;
  font-size: 18px;
}

.sidebar-item:hover {
  background: #e9f0f8;
  color: #2c78c5;
  transform: translateX(3px);
}

.sidebar.collapsed .sidebar-item:not(:first-child) {
  display: none;
}

/* 侧边栏图标固定大小 */
.sidebar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.sidebar-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain; /* 保持图片比例，防止变形 */
  flex-shrink: 0; /* 防止图片被压缩 */
}

/* 修改第一个侧边栏项目的布局 */
.sidebar-item:first-child {
  background-color: #e9f0f8;
  color: #2c78c5;
  font-size: 18px;
  justify-content: flex-start;
  margin-left: -10px;; 
}

.sidebar:not(.collapsed) .sidebar-item {
  justify-content: flex-start; 
  padding-right: 20px;
}

.sidebar:not(.collapsed) .sidebar-item:first-child {
  justify-content: flex-start; 
  padding-right: 20px; 
}

.history-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
  background-color: #f8f9fa;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.history-item {
  padding: 12px 20px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  transition: all 0.25s ease;
  background-color: #fff;
  margin: 6px 8px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.history-item:hover {
  background-color: #f0f0f0;
  transform: translateX(3px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.history-item.selected {
  background-color: #f0f0f0;
  border-left: 3px solid #2c78c5;
  font-weight: 500;
}

.history-item-content {
  margin-bottom: 8px;
  color: #333;
  text-align: left;
}

.history-item-time {
  color: #8c8c8c;
  font-size: 12px;
  text-align: right;
}

/* 历史对话箭头图标 */
.toggle-icon {
  font-size: 12px;
  position: absolute;
  right: 20px;
  transition: transform 0.3s ease;
}

/* 内容区域 */
.content-container {
  transition: margin-left 0.3s ease;
  display: flex;
  position: relative;
}

/* 主内容 */
.main-content {
  flex: 1;
  padding: 40px 20px 20px 20px;
  background: #f8f8f8;
  position: relative;
  min-height: 100vh;
}

/* 对话框容器 */
.dialog-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* 标题 */
.dialog-greeting {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 1.5em;
}

/* 聊天记录区域 */
.chat-container {
  min-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

/* 消息样式 */
.user-message-wrapper,
.assistant-message-wrapper {
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 12px;
}

.user-message-wrapper {
  justify-content: flex-end;
}

.assistant-message-wrapper {
  justify-content: flex-start;
}

.user-avatar,
.assistant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar {
  margin-left: 10px;
}

.assistant-avatar {
  margin-right: 10px;
}

.user-message,
.assistant-message {
  padding: 12px 20px;
  border-radius: 24px;
  word-wrap: break-word;
  text-align: left;
  min-height: 50px;
}

.user-message {
  background: #d0e9ff;
  color: #092645;
  border-radius: 24px 24px 0 24px;
}

.assistant-message {
  background: #f5f5f5;
  color: #333;
  border-radius: 24px 24px 24px 0;
  overflow: auto;
}

/* Markdown样式 */
.assistant-message :deep(pre) {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: monospace;
}

.assistant-message :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.assistant-message :deep(table) {
  border-collapse: collapse;
  margin: 10px 0;
}

.assistant-message :deep(th),
.assistant-message :deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
}

.assistant-message :deep(th) {
  background-color: #f2f2f2;
  text-align: left;
}

.assistant-message :deep(p) {
  margin: 8px 0;
}

.assistant-message :deep(ul),
.assistant-message :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.assistant-message :deep(blockquote) {
  margin: 8px 0;
  padding-left: 10px;
  border-left: 4px solid #ddd;
  color: #666;
}

.assistant-message :deep(img) {
  max-width: 100%;
  height: auto;
}

.assistant-message :deep(a) {
  color: #007bff;
  text-decoration: none;
}

.assistant-message :deep(a:hover) {
  text-decoration: underline;
}

/* 欢迎提示高亮动画 */
@keyframes greeting-pulse {
  0% { transform: scale(1); color: #666; }
  50% { transform: scale(1.05); color: #007bff; }
  100% { transform: scale(1); color: #666; }
}

.greeting-highlight {
  animation: greeting-pulse 1s ease;
}

/* 对话框 */
.main-dialog {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 30px;
  box-sizing: border-box;
  position: relative;
}

.question-container {
  min-height: 40px;
  max-height: 120px;
}

/* 文本框 */
.question-input {
  font-size: 16px;
  color: #333;
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  resize: none;
  text-align: left;
  width: 100%;
}

.action-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

/* 标签与发送按钮 */
.tags-group {
  position: static;
  display: flex;
  gap: 15px;
}

.start-button {
  position: static;
  background: #2c78c5;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(44, 120, 197, 0.2);
}

.start-button:hover {
  background-color: #1e5b96;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 120, 197, 0.4);
}

.start-button:disabled {
  background: #b0b0b0;
  box-shadow: none;
  transform: none;
  cursor: not-allowed;
}

.tag-item {
  padding: 8px 20px;
  border-radius: 20px;
  background: #eee;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}
.tag-item.selected {
  background: #2c78c5;
  color: white;
  box-shadow: 0 2px 6px rgba(44, 120, 197, 0.2);
}

/* 新增提示信息样式 */
.ai-generated-tip {
  font-size: 12px;
  color: #999;
  text-align: center;
  padding-top: 10px;
}

.feedback-link {
  cursor: pointer;
  color: #2c78c5;
  text-decoration: underline;
  text-align: center;
  margin-top: 25px;
  display: block;
  position: relative;
}

.feedback-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 400px; /* 弹窗宽度，可调整 */
}

.feedback-modal-header {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background-color: white; /* 背景颜色 */
  color: black;
  border: none;
  padding: 6px 12px; /* 内边距控制大小 */
  border-radius: 4px;
  cursor: pointer;
}

.feedback-modal-body {
  padding: 25px;
}

.feedback-modal-body textarea {
  width: 100%;
  height: 150px;
  resize: none; 
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
}

.feedback-modal-footer {
  padding: 15px;
  text-align: center;
}

.feedback-modal-footer button {
  background-color: #2c78c5;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.feedback-modal-footer button:hover {
  background-color: #1e5b96;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 120, 197, 0.4);
}

/* 参考资料区域 - 修改为弹窗样式 */
.reference-container {
  position: absolute;
  right: 50px;
  top: 118px;
  width: 350px;
  height: 560px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow-y: auto;
  padding: 0;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.reference-header {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 2;
}

.reference-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 0 5px;
}

.reference-close:hover {
  color: #333;
}

.reference-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: left;
  padding: 15px;
  max-height: none;
  overflow-y: visible;
  margin-left:15px;
}

/* 思考过程样式 */
.think-process {
  margin-bottom: 10px;
  padding-left: 15px;
  border-left: 3px solid #e0e0e0;
  align-self: flex-start;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  min-height: 24px; /* 最小高度，防止内容为空时闪烁 */
}

.think-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  white-space: normal;
  text-align: justify;
  hyphens: auto;
  word-break: break-word;
}

/* Markdown样式 - 增强思考内容中的markdown */
.think-content :deep(pre) {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
  font-family: monospace;
  margin: 10px 0;
  white-space: pre-wrap;
}

.think-content :deep(code) {
  background-color: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.think-content :deep(p) {
  margin: 8px 0;
}

.think-content :deep(ul),
.think-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

/* 助手消息容器 */
.assistant-message-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 70%;
}

/* 助手消息样式 */
.assistant-message {
  background: #f5f5f5;
  color: #333;
  border-radius: 24px 24px 24px 0;
  padding: 12px 20px;
  word-wrap: break-word;
  text-align: justify;
  hyphens: auto;
  word-break: break-word;
  min-height: 24px; /* 最小高度，防止内容为空时闪烁 */
  width: 100%;
  box-sizing: border-box;
}

/* 添加空状态的样式 */
.assistant-message:empty {
  padding: 12px 20px;
  min-height: 24px;
}

.think-content:empty {
  min-height: 24px;
}

/* ========== 移动端响应式，仅在小屏幕下生效 ========== */
@media (max-width: 768px) {
  .sidebar:not(.collapsed) {
    width: 200px;  /* 展开宽度 */
  }

  /* content-container 左侧留出 sidebar 空间 */
  .content-container {
    margin-left: 50px !important;
    transition: margin-left 0.3s ease;
  }
  .sidebar:not(.collapsed) ~ .content-container {
    margin-left: 200px !important;
  }

  /* 其余内部微调保持原有，只是 padding/margin */
  .main-content {
    padding: 20px 10px 10px 10px;
  }
  .dialog-wrapper {
    max-width: 100%;
    margin: 0;
  }
  .dialog-greeting {
    margin-bottom: 20px;
    font-size: 1.2em;
  }
  .chat-container {
    padding: 15px;
    margin-bottom: 15px;
    min-height: 400px;
    max-height: 600px;
  }
  .main-dialog {
    padding: 15px;
    height: auto;
  }
  .action-container {
    gap: 10px;
    margin-top: 15px;
  }
  .tags-group {
    gap: 10px;
    flex-wrap: wrap;
    height:30px;
  }
  .start-button {
    width: 80px;
    padding: 10px;
  }
  .question-title {
    font-size: 14px;
  }
  /* 弹窗宽度百分比，防止超出 */
  .feedback-modal,
  .login-prompt-content {
    width: 90%;
    max-width: 90%;
  }
  .feedback-modal-body textarea {
    height: 120px;
  }

  .tag-item {
  border-radius: 8px;
  font-size: 12px;
  line-height: 12px;
  height:30px
  }

  .tag-item.selected {
    box-shadow: 0 2px 6px rgba(128,0,128,0.2);
  }
}

@media (max-width: 480px) {
  .sidebar:not(.collapsed) {
    width: 180px;
  }
  .content-container {
    margin-left: 50px !important;
  }
  .sidebar:not(.collapsed) ~ .content-container {
    margin-left: 180px !important;
  }
  .sidebar-item {
    padding: 12px 16px;
    font-size: 14px;
  }
  .chat-container {
    min-height: 450px;
    max-height: 600px;
  }
  .dialog-greeting {
    font-size: 1.1em;
  }
  .question-title {
    font-size: 13px;
  }

  .start-button {
    padding: 8px;
    font-size: 14px;
    width: 40px;
    font-size: 12px;
  }
  .main-dialog {
    height: auto;
  }

  .feedback-modal-body textarea {
    height: 100px;
  }

  .tags-group {
    gap: 8px;
    overflow: hidden;
    height: auto;
  }

  .tag-item {
    border-radius: 8px;
    font-size: 12px;
    line-height: 12px;
    height:auto;
    padding: 5px 10px;
    width:50px;
  }
}

</style>