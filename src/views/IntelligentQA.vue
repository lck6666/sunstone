<template>
  <div class="page-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-item" @click="toggleSidebar"><div class="sidebar-icon"><img src="../assets/images/sidebar侧边栏.png"></div></div>
      <div class="sidebar-item" @click="showLoginPrompt">新建对话</div>
      <div class="sidebar-item" @click="showLoginPrompt">历史对话</div>
    </div>

    <!-- 内容容器 -->
    <div class="content-container" :style="{ marginLeft: sidebarWidth }">
      <!-- 主内容 -->
      <main class="main-content">
        <div class="dialog-wrapper">
          <h2 class="dialog-greeting">懂你所问、答你所求</h2>
          
          <!-- 聊天记录区域 -->
          <div class="chat-container">
          </div>

          <!-- 输入区域 -->
          <div class="main-dialog">
            <div class="question-title" @click="showLoginPrompt">请输入您的问题</div>

            <div class="action-container">
              <div class="tags-group">
                <div
                  v-for="tag in tags"
                  :key="tag"
                  class="tag-item"
                  :class="{ selected: selectedTags.includes(tag) }"
                  @click="handleTagClick(tag)"
                >
                  {{ tag }}
                </div>
              </div>
              <button class="start-button" @click="handleLogin">
              登录后使用
              </button>
            </div>            
          </div>
        </div>
        <div class="feedback-link" @click="showFeedbackModal">意见反馈</div>
      </main>
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
      
      <!-- 登录提示弹窗 -->
      <div class="login-prompt-modal" v-if="showLoginPromptModal">
        <div class="login-prompt-content">
          <div class="login-prompt-header">
            <h3>登录提示</h3>
            <button class="close-button" @click="closeLoginPrompt">x</button>
          </div>
          <div class="login-prompt-body">
            <p>请登录后使用智能问答功能</p>
          </div>
          <div class="login-prompt-footer">
            <button class="login-button" @click="handleLogin">跳转到登录界面</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 添加路由导入
import { submitFeedback as submitFeedbackAPI } from '@/api/feedback.js'; // 引入反馈 API

const router = useRouter(); // 获取路由实例

// 添加登录处理函数
const handleLogin = () => {
  router.push('/login'); // 假设你的登录路由是 '/login'
};

// 登录提示弹窗逻辑
const showLoginPromptModal = ref(false);

const showLoginPrompt = () => {
  showLoginPromptModal.value = true;
};

const closeLoginPrompt = () => {
  showLoginPromptModal.value = false;
};

// 标签点击处理函数
const handleTagClick = (tag) => {
  // 如果用户点击标签，先显示登录提示
  showLoginPrompt();
  // 但不执行标签选择逻辑，因为未登录
};

// 原有业务逻辑
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

// 侧边栏逻辑
const isCollapsed = ref(true);
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const sidebarWidth = computed(() => isCollapsed.value ? '50px' : '200px');

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
        user_id: 'guest', // 未登录用户使用默认值
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
</script>

<style>
/* 全局样式（<style> 部分） */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 
               "Segoe UI", Roboto, "Helvetica Neue", 
               Arial, sans-serif;
}

/* 可视区高度适配*/
html, body, #app {
  height: 100%;
}
</style>

<style scoped>

.page-container {
  position: relative;
}

/* 侧边栏样式 */
.sidebar {
  position: static;
  float: left;
  width: 200px;
  height: auto;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.sidebar.collapsed {
  width: 50px;
}

.sidebar-item {
  padding: 14px 20px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 500;
  color: #505050;
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
  margin-left: -8px;; 
}

.sidebar:not(.collapsed) .sidebar-item {
  justify-content: flex-start; 
  padding-right: 20px;
}

.sidebar:not(.collapsed) .sidebar-item:first-child {
  justify-content: flex-start; 
  padding-right: 20px; 
}

/* 内容区域调整 */
.content-container {
  transition: margin-left 0.3s ease;
}

/* 主内容样式 */
.main-content {
  flex: 1;
  padding: 40px 20px 20px 20px;
  height:100vh;
  background: #f8f8f8;
}

.dialog-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.dialog-greeting {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
  font-size: 1.5em;
}

.chat-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 40px;
  height: 300px;
  overflow-y: auto;
  box-sizing: border-box;
  position: relative;
}

.main-dialog {
  margin-top: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 30px;
  height: 160px;
  overflow-y: auto;
}

.question-title {
  font-size: 16px;
  text-align: left;
}

.action-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 35px;
  height: auto;
}

.tags-group {
  position: static;
  display: flex;
  gap: 15px;
}

.start-button {
  position: static;
  background: #007bff;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.start-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
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
  background: #007bff;
  color: white;
  box-shadow: 0 2px 6px rgba(128,0,128,0.2);
}

.feedback-link {
  cursor: pointer;
  color: #007bff; /* 文本颜色，可根据需求调整 */
  text-decoration: underline; /* 添加下划线，类似超链接样式 */
  text-align: center;
  margin-top:25px;
  display: block; /* 使其能设置宽高、内外边距等样式 */
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
  height: 150px; /* 固定高度 */
  resize: none; /* 禁止调整大小 */
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

/* 登录提示弹窗样式 */
.login-prompt-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.login-prompt-content {
  background-color: white;
  border-radius: 8px;
  width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.3s ease;
  transform-origin: center;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.login-prompt-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.login-prompt-body {
  padding: 30px 20px;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.login-prompt-footer {
  padding: 15px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.login-button {
  background-color: #2c78c5;
  color: white;
  border: none;
  padding: 10px 32px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(44, 120, 197, 0.3);
}

.login-button:hover {
  background-color: #1e5b96;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 120, 197, 0.4);
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
    min-height: 360px;
    height: 60vh;
  }
  .main-dialog {
    padding: 15px;
    height: 150px;
  }
  .action-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-top: 15px;
  }
  .tags-group {
    gap: 10px;
    flex-wrap: wrap;
    height:30px;
  }
  .start-button {
    width: 100%;
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
    padding:0 4px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 30px;
    height:30px;
  }

  .tag-item.selected {
    box-shadow: 0 2px 6px rgba(128,0,128,0.2);
  }
}

@media (max-width: 480px) {
  /* 调整展开宽度，如需更小也可自行修改 */
  .sidebar:not(.collapsed) {
    width: 180px;
  }
  /* 重新设置 content-container margin-left */
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
  .dialog-greeting {
    font-size: 1.1em;
  }
  .question-title {
    font-size: 13px;
  }
  .tags-group {
    gap: 8px;
  }
  .start-button {
    padding: 8px;
    font-size: 14px;
  }
  .chat-container {
    height: 55vh;
  }
  .main-dialog {
    height: auto;
  }

  .feedback-modal-body textarea {
    height: 100px;
  }

  .sidebar-item:first-child {
    margin-left: -4px; 
  }
}




</style>