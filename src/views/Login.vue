<template>
    <div class="page-container">
      <main class="login-content">
        <div class="auth-dialog">
          <h2 class="auth-title">欢迎使用太阳石矿山大模型服务平台</h2>
          
          <div class="auth-tabs">
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
            >
              登录
            </div>
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
            >
              注册
            </div>
          </div>
  
          <!-- 登录表单 -->
          <div v-if="activeTab === 'login'" class="auth-form">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="请输入用户名（4-16个字符）"
                v-model="loginForm.name"
                maxlength="16"
                @input="checkNameLength(loginForm.name, 'login')"
              >
              <span v-if="showLoginNameLimitTip" 
                    class="input-limit-tip" 
                    :class="{'input-limit-warning': loginForm.name.length >= 16}">
                {{loginForm.name.length}}/16
              </span>
            </div>
            <div class="form-group">
              <label>密码</label>
              <div class="password-input-container">
                <input 
                  :type="passwordVisible ? 'text' : 'password'" 
                  class="form-input"
                  placeholder="请输入密码（8位以上）"
                  v-model="loginForm.password"
                >
                <span 
                  class="password-toggle-icon" 
                  @click="togglePasswordVisibility('login')"
                  :title="passwordVisible ? '隐藏密码' : '显示密码'"
                >
                  <svg v-if="!passwordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </span>
              </div>
            </div>
            <!-- 新增勾选框和链接 -->
            <div class="form-group">
              <label for="agreeLoginTerms">
                <input 
                type="checkbox" 
                id="agreeLoginTerms" 
                v-model="agreeLoginTerms"
                >
                我已阅读并同意 
                <a href="#" @click.prevent="showTerms('modelService')">模型服务协议</a> 
                和 
                <a href="#" @click.prevent="showTerms('privacyPolicy')">用户隐私保护政策</a>
              </label>
            </div>
            <div v-if="loginError" class="error-message">{{ loginError }}</div>
            <button 
              class="auth-button" 
              @click="handleLogin"
              :disabled="isLoading || !agreeLoginTerms || isAccountLocked"
            >
              {{ isLoading ? '登录中...' : isAccountLocked ? '账号已锁定' : '立即登录' }}
            </button>
          </div>
  
          <!-- 注册表单 -->
          <div v-if="activeTab === 'register'" class="auth-form">
            <div class="form-group">
              <label>用户名</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="用户名需为4-16位，可以包含数字、字母、下划线和连字符"
                v-model="registerForm.name"
                maxlength="16"
                @input="checkNameLength(registerForm.name, 'register')"
              >
              <span v-if="showRegisterNameLimitTip" 
                    class="input-limit-tip" 
                    :class="{'input-limit-warning': registerForm.name.length >= 16}">
                {{registerForm.name.length}}/16
              </span>
            </div>
            <div class="form-group">
              <label>密码</label>
              <div class="password-input-container">
                <input 
                  :type="registerPasswordVisible ? 'text' : 'password'" 
                  class="form-input"
                  placeholder="密码需为8-18位，必须是大写字母、小写字母和数字的混合"
                  v-model="registerForm.password"
                >
                <span 
                  class="password-toggle-icon" 
                  @click="togglePasswordVisibility('register')"
                  :title="registerPasswordVisible ? '隐藏密码' : '显示密码'"
                >
                  <svg v-if="!registerPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </span>
              </div>
              <!-- 密码强度指示器 -->
              <div class="password-strength-meter" v-if="registerForm.password">
                <div class="strength-text">密码强度: <span :style="{ color: passwordStrength.color }">{{ passwordStrength.text }}</span></div>
                <div class="strength-bar">
                  <div class="strength-bar-fill" :style="{ width: (passwordStrength.strength * 16.66) + '%', backgroundColor: passwordStrength.color }"></div>
                </div>
                <div class="strength-tips">
                  <small v-if="passwordStrength.strength < 3">提示: 使用大小写字母、数字和特殊字符提高密码强度</small>
                </div>
              </div>
            </div>
             <div class="form-group">
              <label>确认密码</label>
              <div class="password-input-container">
                <input 
                  :type="confirmPasswordVisible ? 'text' : 'password'" 
                  class="form-input"
                  placeholder="请再次输入相同的密码"
                  v-model="registerForm.confirmPassword"
                >
                <span 
                  class="password-toggle-icon" 
                  @click="togglePasswordVisibility('confirm')"
                  :title="confirmPasswordVisible ? '隐藏密码' : '显示密码'"
                >
                  <svg v-if="!confirmPasswordVisible" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                </span>
              </div>
            </div>
            <div class="form-group">
              <label>电话号码</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="请填写电话号码"
                v-model="registerForm.phone"
              >
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input 
                type="email" 
                class="form-input"
                placeholder="可选填写"
                v-model="registerForm.email"
              >
            </div>
            <!-- 新增勾选框和链接 -->
            <div class="form-group">
              <label for="agreeRegisterTerms">
                <input 
                  type="checkbox" 
                  id="agreeRegisterTerms" 
                  v-model="agreeRegisterTerms"
                >
                我已阅读并同意 
                <a href="#" @click.prevent="showTerms('modelService')">模型服务协议</a> 
                和 
                <a href="#" @click.prevent="showTerms('privacyPolicy')">用户隐私保护政策</a>
              </label>
            </div>
            <div v-if="registerError" class="error-message">{{ registerError }}</div>
            <button 
              class="auth-button"
              @click="handleRegister"
              :disabled="isLoading||!agreeRegisterTerms"
            >
              立即注册
            </button>
          </div>
        </div>
      </main>
      <!-- 新增弹窗组件 -->
      <div v-if="showModal" class="modal">
        <div class="modal-header">
          <h2>{{ modalTitle }}</h2>
          <button class="close-button" @click="showModal = false">x</button>
        </div>
        <div class="modal-body">          
          <div class="modal-content">{{ modalContent }}</div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authApi } from '@/api/auth';
import store from '@/store.js';
import { validateInputSecurity, sanitizeInput } from '@/utils/validation.js';

const router = useRouter();
const route = useRoute();

// 响应式状态
const activeTab = ref('login');
const isLoading = ref(false);
const loginError = ref('');
const registerError = ref('');
const agreeRegisterTerms = ref(false);
const agreeLoginTerms = ref(false);
const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
// 账号锁定状态
const isAccountLocked = ref(false);
const accountLockedTime = ref(null); // 单位为秒
const accountLockedTimer = ref(null);
const remainingLockTime = ref(0); // 单位为秒

const showLoginNameLimitTip = ref(false);
const showRegisterNameLimitTip = ref(false);

// 密码可见状态
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const registerPasswordVisible = ref(false);

// 切换密码可见性
const togglePasswordVisibility = (field) => {
  if (field === 'login') {
    passwordVisible.value = !passwordVisible.value;
  } else if (field === 'register') {
    registerPasswordVisible.value = !registerPasswordVisible.value;
  } else if (field === 'confirm') {
    confirmPasswordVisible.value = !confirmPasswordVisible.value;
  }
};

// 根据URL参数设置初始标签
onMounted(() => {
  if (route.query.tab === 'register') {
    activeTab.value = 'register';
  }
});

// 监听路由参数变化
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'login' || newTab === 'register') {
    activeTab.value = newTab;
  }
}, { immediate: true });

// 登录表单数据
const loginForm = ref({
  name: '',
  password: ''
});


// 注册表单数据
const registerForm = ref({
name: '',
password: '',
confirmPassword: '',
phone: '',
email: ''
});
  
// 验证用户名
const isValidUsername = (username) => {
  const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
  return pattern.test(username);
};

// 验证密码
const isValidPassword = (password) => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,18}$/;
  return pattern.test(password);
};

// 验证手机号
const isValidPhone = (phone) => {
  const pattern = /^1[3-9]\d{9}$/;
  return pattern.test(phone);
};

// 检测密码强度
const checkPasswordStrength = (password) => {
  if (!password) return { strength: 0, text: '未输入密码', color: '#ccc' };
  
  let strength = 0;
  let text = '';
  let color = '';
  
  // 长度检查
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  
  // 复杂度检查
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[!@#$%^&*]/.test(password)) strength += 1;
  
  // 根据分数返回强度描述
  if (strength <= 2) {
    text = '弱';
    color = '#ff4444';
  } else if (strength <= 4) {
    text = '中';
    color = '#ffbb33';
  } else {
    text = '强';
    color = '#00C851';
  }
  
  return { strength, text, color };
};

// 添加响应式密码强度属性
const passwordStrength = ref({ strength: 0, text: '', color: '' });

// 监听密码变化，更新密码强度
watch(() => registerForm.value.password, (newPassword) => {
  passwordStrength.value = checkPasswordStrength(newPassword);
});

// 登录处理
const handleLogin = async () => {
  try {
    loginError.value = '';
    isLoading.value = true;

    // 前端基本验证 - 避免空表单提交
    if (!loginForm.value.name || !loginForm.value.password) {
      throw new Error('用户名和密码不能为空');
    }
    
    // 安全性验证 - 防止SQL注入和XSS攻击
    const nameSecurityCheck = validateInputSecurity(loginForm.value.name);
    if (!nameSecurityCheck.valid) {
      throw new Error('输入内容包含不安全字符');
    }
    
    const passwordSecurityCheck = validateInputSecurity(loginForm.value.password);
    if (!passwordSecurityCheck.valid) {
      throw new Error('输入内容包含不安全字符');
    }
    
    // 清理输入数据，确保安全
    const cleanedName = sanitizeInput(loginForm.value.name);

    // 调用API验证（API内部会进行详细的长度和格式验证）
    const response = await authApi.login({
      name: cleanedName,
      password: loginForm.value.password
    });

    // 存储用户信息
    sessionStorage.setItem('access_token', response.data.access_token);
    sessionStorage.setItem('user_id', response.data.user_id);
    sessionStorage.setItem('user_name', loginForm.value.name);

    store.syncLoginStatus();
  
    // 登录成功跳转
    router.push('/intelligent-qa-login');      
  } catch (error) {
    // 检查是否为账号锁定错误（错误码10020）
    if (error.response && error.response.data && error.response.data.code === 10020) {
      // 设置账号锁定状态
      isAccountLocked.value = true;
      
      // 获取后端返回的剩余锁定时间（单位：秒）
      const lockTimeInSeconds = error.response.data.data || 1800; // 默认30分钟
      remainingLockTime.value = lockTimeInSeconds;
      
      // 设置剩余时间展示逻辑，使用自定义的友好提示，不直接显示后端的msg
      updateLockTimeDisplay();
      
      // 设置定时器，每秒更新一次剩余时间
      if (accountLockedTimer.value) {
        clearInterval(accountLockedTimer.value);
      }
      
      accountLockedTimer.value = setInterval(() => {
        if (remainingLockTime.value > 0) {
          remainingLockTime.value--;
          updateLockTimeDisplay();
        } else {
          // 锁定时间已过，解除锁定
          isAccountLocked.value = false;
          clearInterval(accountLockedTimer.value);
          accountLockedTimer.value = null;
          loginError.value = '账号锁定已解除，请重新登录';
        }
      }, 1000); // 每秒更新一次
      
    } else {
      // 对于其他错误，不直接显示后端的错误消息，而是使用统一的错误提示
      if (error.response && error.response.data && error.response.data.msg) {
        // 如果是其他类型的后端错误，统一显示用户名或密码错误
        loginError.value = '用户名或密码错误';
      } else {
        // 如果是前端验证错误，显示错误消息
        loginError.value = error.message || '登录失败，请检查用户名和密码';
      }
    }
    loginForm.value.password = '';
  } finally {
    isLoading.value = false;
  }
};

// 更新锁定时间显示
const updateLockTimeDisplay = () => {
  if (remainingLockTime.value <= 0) {
    isAccountLocked.value = false;
    loginError.value = '账号锁定已解除，请重新登录';
    return;
  }
  
  const minutes = Math.floor(remainingLockTime.value / 60);
  const seconds = remainingLockTime.value % 60;
  
  // 格式化时间字符串
  let timeStr = '';
  if (minutes > 0) {
    timeStr += `${minutes}分`;
  }
  if (seconds > 0 || minutes === 0) {
    timeStr += `${seconds}秒`;
  }
  
  loginError.value = `由于多次输入错误密码，该用户已锁定，请在${timeStr}后重试`;
};

// 注册处理函数
const handleRegister = async () => {
try {
  registerError.value = '';
  isLoading.value = true;
  
  // 前端验证 - 确保格式正确
  if (!isValidUsername(registerForm.value.name)) {
    throw new Error('用户名需为4-16位，可以包含数字、字母、下划线和连字符');
  };
  
  // 先验证两次密码是否一致 (这一步仍然需要在前端完成)
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    throw new Error('两次输入的密码不一致，请重新输入');
  };
  
  // 验证密码格式
  if (!isValidPassword(registerForm.value.password)) {
    throw new Error('密码需为8-18位，必须是大写字母、小写字母和数字的混合');
  };
  
  // 验证密码强度
  if (passwordStrength.value.strength < 3) {
    throw new Error('密码强度过低，请增加密码复杂度');
  };
  
  // 验证手机号
  if (!isValidPhone(registerForm.value.phone)) {
    throw new Error('请输入正确的手机号');
  };
  
  // 验证协议同意
  if (!agreeRegisterTerms.value) {
    throw new Error('注册需同意模型服务协议和用户隐私保护政策');
  };
  
  // 安全性验证 - 防止SQL注入和XSS攻击
  const fieldsToCheck = [
    { name: '用户名', value: registerForm.value.name },
    { name: '密码', value: registerForm.value.password },
    { name: '电话', value: registerForm.value.phone },
    { name: '邮箱', value: registerForm.value.email }
  ];
  
  for (const field of fieldsToCheck) {
    if (field.value) {
      const securityCheck = validateInputSecurity(field.value);
      if (!securityCheck.valid) {
        throw new Error(field.name + '：' + securityCheck.message);
      }
    }
  }
  
  // 清理输入数据，确保安全
  const cleanedName = sanitizeInput(registerForm.value.name);
  const cleanedEmail = sanitizeInput(registerForm.value.email);
  const cleanedPhone = sanitizeInput(registerForm.value.phone);

  // 调用注册接口（API内部会再次进行详细的长度和格式验证）
  const response = await authApi.signup({
    name: cleanedName,
    password: registerForm.value.password,
    phone: cleanedPhone,
    email: cleanedEmail
  });

  // 注册成功处理（如提示或跳转）
  loginError.value = '注册成功，请登录';
  activeTab.value = 'login'; // 自动切回登录页
} catch (error) {
  registerError.value = error.message;
} finally {
  isLoading.value = false;
}
};

// 显示协议内容弹窗
const showTerms = (type) => {
  showModal.value = true;
  if (type === 'modelService') {
    modalTitle.value = '模型服务协议';
    modalContent.value = `太阳石矿山大模型服务协议
  重要提示
  【审慎阅读】您在使用流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款，特别是粗体下划线标识之处，您应重点阅读。如您对协议有任何疑问，可向太阳石矿山大模型客服咨询。
  【签约动作】当您按照启动页面提示并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与我公司达成一致，成为太阳石矿山大模型用户（下称"用户"或"您"）。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。用户在每次注册、登录时，均需勾选同意《模型服务协议》，否则无法登录并使用模型的主要功能。
  【审慎阅读】
  在完成【签约动作】之前，请您务必审慎阅读、充分理解本协议各条款的内容。您需要重点阅读和理解免除或者限制责任的条款、法律适用和争议解决条款，相关条款将以粗体和下划线标识以便于您的关注。如您对协议有任何疑问，可通过本协议披露的联系方式联系我们。
  用户协议
  欢迎签署本《太阳石矿山大模型服务协议》（下称"本协议"）并使用太阳石矿山大模型（定义见下文）服务。
  相关定义说明
  太阳石矿山大模型：指煤炭科学研究总院有限公司经营的问答对话生成平台产品。
  太阳石矿山大模型服务提供者：指太阳石矿山大模型的互联网信息及软件技术服务提供者煤炭科学研究总院有限公司。
  用户或您：指使用太阳石矿山大模型产品或服务的人。
  协议适用范围
  本协议由您和煤炭科学研究总院有限公司签署，自您确认接受之时起或自您使用太阳石矿山大模型的行为发生之时起生效。
  除非另有明确规定，太阳石矿山大模型平台新增的任何新功能、新产品、新服务，均无条件地适用本协议。
  账号与使用说明
  在您使用太阳石矿山大模型服务时，需要您先进行用户注册。
  在您使用我们的产品/服务时，我们需要/可能需要收集和使用的您的个人信息，包括如下两种：
  1、为实现向您提供我们产品及服务的基本功能，您须授权我们收集、关联您的手机号，用于用户身份验证、重要通知发送以及紧急情况下的联络。如您拒绝提供相应信息，您将无法正常使用我们的产品及服务；
  2、为实现向您提供我们产品及服务的附加功能，您可选择是否授权我们收集、使用的信息。如您拒绝提供，您将无法正常使用相关附加功能或无法达到我们拟达到的功能效果。
  信息收集的主要目的是通过了解用户特征和需求，提供更为精准的服务，并提升用户体验。具体用途包括：
  安全保障：通过多因素验证机制，确保账户安全，防止未经授权的访问。
  客户服务：改进客户支持流程，提供快速、有效的解决方案和反馈。
  用户资格说明
  请确认在您开始注册程序使用太阳石矿山大模型服务前，您已具备中华人民共和国法律规定的与您行为相适应的民事行为能力。若您不具备前述与您行为相适应的民事行为能力而进行用户注册，则您及您的监护人应依照法律规定承担因此而导致的一切后果。
  太阳石矿山大模型适用于中华人民共和国境内的特定人群，包括矿山从业者、矿业类学生及科研工作者，不包括未成年人（未满十八周岁的未成年人使用应依照法律规定承担因此而导致的一切后果）。太阳石矿山大模型在多个矿业相关场景中展现出广泛的适用性，但不适用关键信息基础设施、自动控制、医疗信息服务、心理咨询。太阳石矿山大模型服务范围是公众科普、教育与培训、科研与创新等。
  您知悉，无民事行为能力人、限制民事行为能力人不当注册为太阳石矿山大模型用户的，其与太阳石矿山大模型之间的服务协议自始无效，一经发现，太阳石矿山大模型有权立即停止为该用户服务或注销该用户账号。
  账户注册说明
  账户注册是指用户登录太阳石矿山大模型，按要求填写相关信息并确认同意履行本协议的过程。如有证据证明或太阳石矿山大模型根据相关规则判断您存在不当注册或不当使用多个太阳石矿山大模型账户的情形，太阳石矿山大模型可采取冻结或关闭账户、拒绝提供服务等措施，如给太阳石矿山大模型及相关方造成损失的，我公司有权追究您的相关责任。
  账户安全说明
  您有权使用您设置或确认的手机号码及您设置的密码登录太阳石矿山大模型。您的账户为您自行设置并由您保管，太阳石矿山大模型在任何时候均不会主动要求您提供您的账户密码。您的账户发生的任何行为均视为您的行为，您需对您账户项下发生的一切行为负责。因此，若账户因您主动泄露或因您遭受他人攻击、诈骗等行为导致的损失及后果，太阳石矿山大模型并不承担责任，您应通过司法、行政等救济途径向侵权行为人追偿。
  账户转让说明
  仅在有法律明文规定、司法裁定或经太阳石矿山大模型平台同意，并符合太阳石矿山大模型平台规则规定的用户账户转让流程的情况下，您可进行账户的转让。您的账户一经转让，该账户项下权利义务一并转移。除此以外，您的账户不得以任何方式转让，否则太阳石矿山大模型平台有权追究您的违约责任，且由此产生的责任及后果均由您自行承担。
  更新维护说明
  您应当及时更新您提供的信息，在法律有明确规定要求太阳石矿山大模型作为平台服务提供者必须对部分用户的信息进行核实的情况下，太阳石矿山大模型将依法不时地对您的信息进行检查核实，您应当配合提供最新、真实、完整、有效的信息。太阳石矿山大模型可向您发出询问或要求整改的通知，并要求您进行重新认证，直至中止、终止对您提供部分或全部太阳石矿山大模型平台服务，当出现如下情况时，太阳石矿山大模型对此不承担任何责任：
  如太阳石矿山大模型按您最后一次提供的信息与您联系未果；
  您未按太阳石矿山大模型的要求及时提供信息；
  您提供的信息存在明显不实或行政司法机关核实您提供的信息无效的，您将承担因此对您自身、他人及太阳石矿山大模型造成的全部损失与不利后果。
  平台的权利和义务
  1、太阳石矿山大模型有义务在现有技术上维护整个平台的正常运行，并努力提升和改进技术，保障您的产品和服务使用体验。
  2、对于您在注册使用太阳石矿山大模型平台时遇到的与本产品或服务有关的问题及反映的情况，太阳石矿山大模型将在法律规定期限内及时作出回复。
  3、对于您在太阳石矿山大模型平台上的不当行为，或任何太阳石矿山大模型认为应当终止服务的情况，太阳石矿山大模型有权实施屏蔽相关信息、终止提供服务等处理措施，并将相关情况及时通知于您和告知有关部门；您对太阳石矿山大模型的处理措施存在异议的，可以提供相关证据予以说明。若经核实，您的行为确有违反本平台用户协议或违法违规情况的，太阳石矿山大模型有权终止对您提供服务。
  4、为不断改善太阳石矿山大模型的服务质量，太阳石矿山大模型可能使用您输入太阳石矿山大模型的和太阳石矿山大模型向您输出的内容进行进一步的开发训练。您完全理解并接受该种使用，并不因该种使用而向太阳石矿山大模型主张权利或主张太阳石矿山大模型侵犯您的权益。
  5、太阳石矿山大模型将尽最大努力、采取必要合理措施，保障太阳石矿山大模型网络安全和稳定运行。
  6、太阳石矿山大模型为您提供免费服务，但可能具有调用次数、生成能力等方面的限制，您理解并同意，该种免费使用可能根据研究进展进行调整。您承诺不会因该规则的调整、免费使用权益的失效而向太阳石矿山大模型追究任何责任。
  7、您不得以任何方式删除、篡改、隐匿太阳石矿山大模型在输出内容中生成的深度合成服务标识。
  您的权利和义务
  1、您有权根据本协议的约定享受太阳石矿山大模型提供的以下服务：问答对话生成服务。太阳石矿山大模型有权依据业务需要增加或减少服务的内容。
  2、您应当保证在使用太阳石矿山大模型时不采取不正当行为，不扰乱平台正常秩序。
  3、您不得向太阳石矿山大模型输出或诱导太阳石矿山大模型向您输出包含以下内容的言论，否则太阳石矿山大模型平台可对您发布的信息依法或依本协议进行删除或屏蔽，并将您发布信息的情况和向有关机关报告：
  煽动、抗拒、破坏宪法和法律、行政法规实施的；
  煽动颠覆国家政权，推翻社会主义制度的；
  煽动、分裂国家，破坏国家统一的；
  煽动民族仇恨、民族歧视，破坏民族团结的；
  任何包含对种族、性别、宗教、地域内容等歧视的；
  捏造或者歪曲事实，散布谣言，扰乱社会秩序的；
  宣扬封建迷信、淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的；
  公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的；
  损害国家机关信誉的；
  其他违背社会公共利益或公共道德或依据相关太阳石矿山大模型平台协议、规则的规定不适合在太阳石矿山大模型平台上发布的；
  其他违反宪法、法律和行政法规的。
  4、您不应以以下方式不当使用太阳石矿山大模型：
  以侵犯任何人权利的方式；
  对太阳石矿山大模型的任何算法、源代码、机制等进行反向工程；
  利用太阳石矿山大模型开发、训练或改善其他与煤炭科学研究总院有限公司存在直接或间接竞争关系的算法、模型等；
  将太阳石矿山大模型使用于任何对主体资格有要求的服务中，包括但不限于医疗服务、法律服务、心理咨询、基础设施建设等；
  其他可能损害煤炭科学研究总院有限公司利益的使用方式。
  5、如您利用太阳石矿山大模型向任何第三方提供服务，相应的权利义务和责任均由您承担，太阳石矿山大模型不对由此造成的任何损失负责。
  6、在海外使用太阳石矿山大模型应遵守美国、欧盟和/或其他政府机关等外国实体的全部法律、法规、政策的限制与监督。
  服务协议的终止
  1、您有权通过以下任一方式终止本协议：
  ①您注销您的账户的；
  ②变更事项生效前您停止使用并明示不愿接受变更事项的；
  ③您明示不愿继续使用太阳石矿山大模型平台服务，且符合平台终止条件的。由您向太阳石矿山大模型提出注销账号申请后，经太阳石矿山大模型审核同意，由太阳石矿山大模型注销该注册用户，您即解除与太阳石矿山大模型的服务协议关系。
  2、当出现下列情况下时，太阳石矿山大模型可以通过注销用户的方式终止服务：
  ①在您违反本服务协议相关规定时，太阳石矿山大模型依据违约条款终止本协议。太阳石矿山大模型将在终止服务时通知您。但如您在太阳石矿山大模型终止提供服务后，再一次直接或间接以他人名义注册为太阳石矿山大模型用户的，太阳石矿山大模型有权再次单方面终止向您提供服务；
  ②如太阳石矿山大模型通过您提供的信息与您联系时，发现您在注册时填写的电子邮箱或手机等已不存在或无法接收信息的，经太阳石矿山大模型以您在注册时填写的其他联系方式通知您更改，而您在三个工作日内仍未能提供，或太阳石矿山大模型无法根据您注册时预留的信息联系到您的；
  ③经太阳石矿山大模型发现您注册信息中主要内容是虚假的；
  ④本服务协议终止或更新时，您明示不愿接受新的服务协议的；
  ⑤您在太阳石矿山大模型平台有发布违法信息、侵犯他人合法权益或其他严重违法违约行为的；
  ⑥除上述情形外，因您多次违反太阳石矿山大模型平台规则相关规定且情节严重，太阳石矿山大模型依据平台规则对您的账户予以查封的；
  ⑦其它太阳石矿山大模型认为需终止服务的情况。
  3、协议终止后的处理
  本协议终止后，除法律有明确规定外，太阳石矿山大模型无义务向您或您指定的第三方披露您账户中的任何信息。
  本协议终止后，太阳石矿山大模型仍享有下列权利：
  ①在匿名化处理您的用户信息的前提下，继续保存您留存于太阳石矿山大模型平台的各类信息；
  ②对于您过往的违约行为，太阳石矿山大模型仍可依据本协议向您追究违约责任。
  关于生成内容的知识产权
  1、您充分理解并同意，您仅可以非商业的、个人研究学习的方式使用太阳石矿山大模型。太阳石矿山大模型及其程序、软件、信息、数据、开发文档及相关的元素、组件等内容均受中华人民共和国法律法规和相应的国际条约保护，由煤炭科学研究总院有限公司及相关权利人享有知识产权。
  2、未经煤炭科学研究总院有限公司及相关权利人书面同意：
  您无权以任何商业化方式使用太阳石矿山大模型及太阳石矿山大模型生成的内容；
  您不得利用太阳石矿山大模型开发与太阳石矿山大模型相竞争的产品或服务。
  3、您输入太阳石矿山大模型的任何内容的版权均仅归原作者所有，若作者有版权声明或原作从其他网站转载而附带有原版权声明者，其版权归属以附带声明为准。
  4、您基于太阳石矿山大模型生成的内容的版权由您自行维护并对其独立判断后使用，基于太阳石矿山大模型生成内容产生的任何知识产权问题由您自行处理，煤炭科学研究总院有限公司对由此造成的任何损失不负责任，您由此给煤炭科学研究总院有限公司造成损失的煤炭科学研究总院有限公司有权向您追偿。
  生成内容相关的责任限制说明
  1、太阳石矿山大模型依照法律规定履行基础保障义务，但对于下述原因导致的合同履行障碍、履行瑕疵、履行延后或履行内容变更等情形，太阳石矿山大模型并不承担相应的违约责任：
  因自然灾害、罢工、暴乱、战争、政府行为、司法行政命令等不可抗力因素；
  因常规或紧急的设备与系统维护、设备与系统故障、网络信息与数据安全等因素。
  2、由于太阳石矿山大模型提供服务所依赖的技术瓶颈，太阳石矿山大模型不对以下事项作出任何保证：
  不保证太阳石矿山大模型将符合您的实际或特定需求或目的；
  不保证太阳石矿山大模型准确可靠、功能可用、及时、安全、无错误、不受干扰、无中断、持续稳定、不存在任何故障；
  太阳石矿山大模型的生成内容虽已经过人工智能算法自动过滤，但仍不排除其中部分信息具有瑕疵、不合理或引发用户不适，且其生成的内容不代表团队的态度或观点；
  不保证太阳石矿山大模型中的代码、程序及其指向的内容的准确性、稳定性和完整性。
  用户信息保护及管理
  我公司非常重视用户个人信息的保护，对于您提供、发布及在使用太阳石矿山大模型平台服务中形成的除个人信息外的非个人信息，均不会因上传、发布等行为发生知识产权、肖像权等权利的转移。除非我们另行说明，在法律允许的范围内，您免费授予煤炭科学研究总院有限公司及其关联公司非排他的、无地域限制的、永久的、免费的许可使用及可再许可第三方使用的权利，以及可以自身名义对第三方侵权行为取证及提起诉讼的权利。
  （一）我们通过以下三种方式保护您的信息：
  1、我们采取的数据保护技术措施
  我们已采取符合业界标准、合理可行的安全防护措施保护您的信息，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。例如，我们已采取数据分类分级制度，对数据进行分类分级保护；采取身份鉴别技术进行用户身份验证。此外我们会使用受信赖的保护机制防止个人信息遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访问个人信息。
  2、我们采取的数据保护管理组织措施
  我们建立了完备的以数据为核心、围绕数据生命周期进行的数据安全管理体系，从组织建设、制度设计、人员管理、产品技术等方面多维度提升个人信息的安全性。我们已经建立了个人信息管理制度，并设置了个人信息保护负责人对您的个人信息予以特别保护。我们会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。
  3、个人信息安全事件的响应
  如果我们的物理、技术或管理防护设施遭到或可能遭到破坏，导致或可能导致信息被非法授权访问、公开披露、篡改或毁坏，以致您的合法权益受损的，我们会及时启动应急预案，采取合理救济措施，以尽可能降低对您个人信息和其他权益的影响。如发生个人信息安全事件，我们还将按照法律法规的要求向您告知：发生或者可能发生个人信息泄露、篡改、丢失的信息种类、原因和可能造成的危害；我们采取的补救措施和您可以采取的减轻危害的措施；我们的联系方式。事件相关情况我们将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。根据相关法律规定，如果我们采取措施能够有效避免信息泄露、篡改、丢失造成危害的，可以不通知您；履行个人信息保护职责的部门认为有必要的除外。同时，我们还将按照监管部门要求，上报个人信息安全事件的处置情况。
  （二）我们如何存储您的信息
  1、存储地点
  我们在中国境内运营中收集和产生的个人信息存储在中国境内。
  目前我们不会跨境传输或存储您的个人信息，将来如需跨境传输或存储的，我们会向您告知信息出境的目的、接收方、安全保障措施和安全风险，并事先征得您的同意。
  2、存储期限
  我们只会在达成本政策所述目的所需的期限内保留您的个人信息，除非法律有强制的留存要求，例如《网络信息内容生态治理规定》第10条要求网络信息内容服务平台发现违法违规、不良信息的，保存有关记录。我们判断个人信息的存储期限主要参考以下标准并以其中较长者为准：
  ①完成、维护与您相关的业务记录，以应对您可能的查询或投诉；
  ②保证我们为您提供服务的安全和质量；
  ③您是否同意更长的留存期间；
  ④是否存在关于保留期限的其他特别约定或法律法规规定。
  在前述法律法规有强制留存要求的情况下，即使您注销您的账户或要求删除您的个人信息，我们亦无法删除或匿名化处理您的个人信息。在超出保留期间后，我们会根据适用法律的要求删除您的个人信息，或对其进行匿名化处理。
  （三）您可以通过以下方式访问及管理您的信息：
  （一）查询、复制、更正和补充您的信息
  您有权查询、复制、更正或补充您的信息。您可以通过以下方式进行：向我们的个人信息保护负责人发送邮件，联系邮箱：solstone-support@mail.ccri.ccteg.cn。您也可拨打以下电话：(010) 8426-3758。
  （二）删除您的信息
  您可以通过"（一）查询、复制、更正和补充您的信息"中列明的方式删除您的个人信息。
  当您或我们协助您删除相关信息后，因为适用的法律和安全技术限制，我们可能无法立即从备份系统中删除相应的信息，我们将安全地存储您的个人信息并限制对其的任何进一步的处理，直到备份可以清除或实现匿名化。
  （三）改变您授权同意的范围
  您可以通过"（一）查询、复制、更正和补充您的信息"中列明的方式改变或者撤回您授权我们收集和处理您的个人信息的范围：
  当您收回授权后，我们将不再处理相应的个人信息。但您收回授权的决定，不会影响我们此前基于您的授权而开展的个人信息处理。
  （四）注销您的账户
  您可以通过以下方式申请关闭/注销您的账户：
  向我们的个人信息保护负责人发送邮件，联系邮箱：solstone-support@mail.ccri.ccteg.cn。您也可拨打以下电话：(010) 8426-3758。
  在您主动注销账户之后，我们将停止为您提供产品或服务，并根据适用法律的要求删除您的个人信息，或对其进行匿名化处理。一旦您注销账号，将无法恢复相关账号信息，请谨慎操作。
  违约责任及处理办法
  您存在下列行为的，视为违约，太阳石矿山大模型有权做出相应处理：
  太阳石矿山大模型有权对您的注册数据及产品/服务使用行为进行查阅，发现或怀疑注册数据或产品/服务使用行为中存在问题，有权向您发出询问和/或要求改正的通知，若您未在合理期限内作出合理回应，太阳石矿山大模型可以对您的注册数据或产品/服务使用做出屏蔽、删除等处理；
  经国家生效法律文书或行政处罚决定确认您存在违法行为，或者太阳石矿山大模型有足够事实依据可以认定您存在违法或违反服务协议行为的，太阳石矿山大模型有权在网站上以合法的形式公示您的违法行为；
  经国家生效法律文书或行政处罚决定确认您存在违法行为，或者太阳石矿山大模型有足够事实依据可以认定您存在违法或违反服务协议行为的，太阳石矿山大模型有权在网站上以网络发布形式公布您的违法行为；
  对于您在太阳石矿山大模型发布的下列各类信息，太阳石矿山大模型有权在不通知您的前提下进行删除或采取其他限制性措施。包括太阳石矿山大模型有理由相信存在欺诈等恶意或虚假内容的信息；太阳石矿山大模型有理由相信存在试图扰乱正常平台秩序因素的信息；太阳石矿山大模型有理由相信违反公共利益或可能严重损害太阳石矿山大模型和其他用户合法利益的信息。
  法律适用范围与争议解决
  1、本协议之订立、生效、解释、修订、补充、终止、执行与争议解决均适用中华人民共和国大陆地区法律；如法律无相关规定的，参照商业惯例及/或行业惯例。
  2、本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。
  联系我们
  如您对本政策有任何疑问、意见或建议，或者您在使用太阳石矿山大模型平台服务所遇到的任何问题，您可以通过我们提供的多种反馈渠道与我们联系：
  1、您的个人信息相关咨询、投诉问题，可通过太阳石矿山大模型主界面的"投诉与举报中心"与我们取得联系。
  2、您在使用过程中遇到的任何问题，可以通过以下方式与我们联系，联系邮箱：solstone-support@mail.ccri.ccteg.cn，您也可拨打以下电话：(010) 8426-3758。`;
  } else if (type === 'privacyPolicy') {
    modalTitle.value = '用户隐私保护政策';
    modalContent.value = `隐私保护政策
  太阳石矿山大模型（以下简称"我们"）深知个人信息对您的重要性，您的信任对我们非常重要，我们将按照法律法规的规定并参照行业最佳实践保护您的个人信息及隐私安全。我们制定本"隐私政策"并特别提示：希望您在使用太阳石矿山大模型及相关服务前仔细阅读并理解本隐私政策，以便做出适当的选择。
  本隐私政策将帮助您了解：
  我们会遵循隐私政策收集、使用您的信息，但不会仅因您同意本隐私政策而采用强制捆绑的方式收集个人信息。
  当您使用或开启相关功能或使用服务时，为实现功能、服务所必需，我们会收集、使用相关信息。除非是为实现业务功能或根据法律法规要求所必需的必要信息，您均可以拒绝提供且不影响其他功能或服务。我们将在隐私政策中逐项说明所要收集的信息。
  下文将帮您详细了解我们如何收集、使用、存储、转移（如适用）与保护个人信息；帮您了解管理您的个人信息的方式。本政策与您使用我们的服务关系密切，我们建议您仔细阅读并理解本政策全部内容，作出您认为适当的选择，有关您个人信息权益的条款重要内容我们已用加粗形式提示，请特别关注。
  1.我们如何收集和使用个人信息
  2.我们如何使用cookie等同类技术
  3.数据使用过程中涉及的合作方、转移、公开个人信息
  4.我们如何存储个人信息
  5.我们如何保护个人信息的安全
  6.行使您的个人信息权利
  7.未成年人条款
  8.隐私政策的修订和通知
  9.联系我们
  1我们如何收集和使用个人信息
  我们会按照如下方式收集您在使用服务时主动提供的，以及通过自动化手段收集您在使用功能或接受服务过程中产生的信息：
  1.1注册、登录
  当您注册、登录太阳石矿山大模型及相关服务时，您可以通过手机号创建账号并完成注册。手机号码是履行国家法律法规关于网络实名制要求的必要信息，如果您不提供手机号码用于注册、登录，我们可能无法为您提供AI对话等功能。
  1.2智能对话
  a.我们基于生成式人工智能模型技术向您提供对话及互动服务。您可以通过对话框向我们发送文字、图片等内容，我们自动接收上述信息以便于向您提供对话服务。
  b.在经安全加密技术处理、严格去标识化且无法重新识别特定个人的前提下，我们可能会将上述所收集的数据以及模型生成的对应回复用于模型训练，不断调整优化模型的效果。如果您不希望您输入或提供的信息用于模型训练和优化，可以通过本隐私政策第9条公示的联系方式与我们联系，要求撤回使用您的数据用于模型训练和优化。
  c.您还可以对我们所输出的内容进行点赞、点踩、复制等处理，我们将收集您的操作信息，以便不断改进我们的服务质量。
  d.如您输入的聊天信息、提交的信息等内容包含他人的个人信息时，请您务必在提供该信息前获得他人的合法授权，避免造成他人信息的不当泄露。
  1.3用户反馈与服务
  客服及问题：为便于与您联系、尽快帮助您解决问题或记录相关问题的处理方案及结果，我们可能会保存您与我们的通信、通话记录及相关内容（包括账号信息、反馈信息、您为了证明相关事实提供的其他信息，或您留下的联系方式）。
  1.4个性化推荐
  为了向您推荐相关性更高的输入指令，提供更契合您要求的服务，我们会为您提供个性化推荐服务。
  当您保持个性化推荐开关打开时，我们会在您授权同意范围内收集、使用您在使用产品时的输入信息（包括对话内容及搜索文本）及行为信息（包括您在访问/使用产品时的点击、搜索、浏览以及分享操作等相关记录）、以及经您授权从本产品中收集、由其他合作方提供的其他信息。
  1.5消息通知
  您知悉并同意，我们在运营中可能会通过您在使用产品及/或服务的过程中所提供的联系方式（例如：电话号码），向您同时发送一种或多种类型的通知，例如用于用户消息告知、身份验证、安全验证、用户使用体验调研。如您不愿接受这些信息，您可以通过手机短信中提供的退订方式进行退订，也可以直接通过solstone-support@mail.ccri.ccteg.cn与我们联系进行退订。
  1.6运营与安全保障
  1.6.1运营与安全保障
  我们致力于为您提供安全、可信的产品与使用环境，提供优质而可靠的服务与信息是我们的核心目标。为了维护我们服务的正常运行，保护您或其他用户或公众的合法利益免受损失，我们会收集用于维护产品或服务安全稳定运行的必要信息。
  1.6.2设备信息与日志信息
  a.为了保障软件与服务的安全运行、运营的质量及效率，我们会收集您的硬件型号、操作系统版本号、设备标识符等。
  b.为了预防恶意程序、保障运营质量及效率，我们会收集正在运行的进程信息、页面的总体运行、使用情况与频率、页面崩溃情况、总体使用情况、性能数据等。
  1.7收集、使用个人信息目的变更
  请您了解，随着我们业务的发展，可能会对太阳石矿山大模型的功能和提供的服务有所调整变化。原则上，当新功能或服务与我们当前提供的功能或服务相关时，收集与使用的个人信息将与原处理目的具有直接或合理关联。在与原处理目的无直接或合理关联的场景下，我们收集、使用您的个人信息，会再次按照法律法规及国家标准的要求以页面提示、交互流程、协议确认方式另行向您进行告知说明，并征得您的同意。
  1.8征得授权同意的例外
  请您理解，在下列情形中，根据法律法规及相关国家标准，我们收集和使用您的个人信息不必事先征得您的授权同意：
  a.与我们履行法律法规规定的义务相关的；
  b.与国家安全、国防安全直接相关的；
  c.与公共安全、公共卫生、重大公共利益直接相关的；
  d.与刑事侦查、起诉、审判和判决执行等直接相关的；
  e.出于维护您或他人的生命、财产等重大合法权益但又很难得到本人授权同意的；
  f.您自行向社会公众公开的个人信息；
  g.根据个人信息主体要求签订和履行合同所必需的；
  h.从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道；
  i.用于维护软件及相关服务的安全稳定运行所必需的，例如发现、处置软件及相关服务的故障；
  j.为开展合法的新闻报道所必需的；
  k.为学术研究机构，基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
  l.法律法规规定的其他情形。
  特别提示您注意，如信息无法单独或结合其他信息识别到您的个人身份，其不属于法律意义上您的个人信息；当您的信息可以单独或结合其他信息识别到您的个人身份时或我们将无法与任何特定个人信息建立联系的数据与其他您的个人信息结合使用时，这些信息在结合使用期间，将作为您的个人信息按照本隐私政策处理与保护。
  2我们如何使用 cookie 等同类技术
  cookie 和设备信息标识等同类技术是互联网中普遍使用的技术。当您使用太阳石矿山大模型及相关服务时，我们可能会使用相关技术向您的设备发送一个或多个 cookie 或匿名标识符，以收集、标识和存储您访问、使用本产品时的信息。我们承诺，不会将 cookie 用于本隐私政策所述目的之外的任何其他用途。我们使用 cookie 和同类技术主要为了实现以下功能或服务：
  2.1 保障产品与服务的安全、高效运转
  我们可能会设置认证与保障安全性的 cookie 或匿名标识符，使我们确认您是否安全登录服务，或者是否遇到盗用、欺诈及其他不法行为。这些技术还会帮助我们改进服务效率，提升登录和响应速度。
  2.2 帮助您获得更轻松的访问体验
  使用此类技术可以帮助您省去重复您填写个人信息、输入搜索内容的步骤和流程。
  2.3 cookie 的清除
  您可以通过浏览器设置拒绝或管理cookies及同类技术。具体地，进入浏览器"设置"页面，找到隐私和安全设置相关页面，关闭允许使用网站保存和读取Cookie的相关设置。
  **请您知悉，具体的关闭方式取决于您选择的浏览器类型。**
  但请注意，如果停用cookies或同类技术，您有可能无法享受最佳的服务体验，某些服务也可能无法正常使用。
  3数据使用过程中涉及的合作方以及转移、公开个人信息
  3.1数据使用过程中涉及的合作方
  3.1.1原则
  a.合法原则：与合作方合作过程中涉及数据使用活动的，必须具有合法目的、符合法定的合法性基础。如果合作方使用信息不再符合合法原则，则其不应再使用您的个人信息，或在获得相应合法性基础后再行使用。
  b.正当与最小必要原则：数据使用必须具有正当目的，且应以达成目的必要为限。
  c.安全审慎原则：我们将审慎评估合作方使用数据的目的，对这些合作方的安全保障能力进行综合评估，并要求其遵循合作法律协议。
  3.1.2委托处理
  对于委托处理个人信息的场景，我们会与受托合作方根据法律规定签署相关处理协议，并对其个人信息使用活动进行监督。
  3.1.3共同处理
  对于共同处理个人信息的场景，我们会与合作方根据法律规定签署相关协议并约定各自的权利和义务，确保在使用相关个人信息的过程中遵守法律的相关规定、保护数据安全。
  3.1.4合作方的范围
  若具体功能和场景中涉及由我们的关联方、第三方提供服务，则合作方范围包括我们的关联方与第三方。
  3.1.5实现功能或服务的数据使用
  当您在使用太阳石矿山大模型中由我们的合作方提供的功能时，我们的合作方可能会使用为实现业务目的所必需的信息，用以向您返回更具有相关性的内容或查询结果。
  3.1.6实现广告与推广业务的数据使用
  a.广告推送与投放：为实现广告与推广以及相关分析服务，并优化与提升广告与推广的有效触达率，以下合作方需要使用去标识化或匿名化后的设备、网络、渠道信息、位置和标签信息：
  广告主/推广方，或提供广告与推广以及相关分析服务的合作方；
  与广告主/推广方合作的提供广告与推广以及相关分析服务的合作方。
  b.统计分析：进行广告与推广以及提供相关分析服务的合作方可能需要使用您的设备、网络、广告与推广的点击、浏览、展示以及转化数据等信息用于分析、衡量、提升广告与推广服务的有效性。
  c.合作方对信息的使用：广告与推广合作方可能将上述信息与其合法获取的其他数据相结合，以优化广告与推广效果，我们会要求其对信息的使用遵循合法、正当、必要原则，保障用户合法权利不受侵犯。
  3.1.7实现安全与分析统计而提供信息
  a.保障使用安全：我们非常重视账号、服务及内容安全，为保障您和其他用户的账号与财产安全，使您和我们的正当合法权益免受不法侵害，我们的合作方可能会使用必要的设备、账号及日志信息。为确保用户账号安全，在我们识别出您登录账号所使用的手机号码有二次放号风险时，我们会将您的手机号码、账号注册的时间提供给通信运营商做二次号查验，以保障您的账号安全。
  b.分析产品情况：为分析我们产品的使用和表现情况，我们的合作方可能需要使用该产品使用情况（崩溃、闪退）、设备标识信息等信息。
  3.2转移
  随着我们业务的持续发展，我们将有可能进行合并、收购、资产转让，您的个人信息有可能因此而被转移。在发生前述变更时，我们将按照法律法规及不低于本隐私政策所载明的安全标准要求继受方继续履行个人信息处理者的义务，若继受方变更原先的处理目的、处理方式的，我们将要求继受方重新征得您的授权同意。
  3.3公开
  a.我们不会公开您的个人信息，除非遵循国家法律法规规定或者获得您的同意。我们公开您的个人信息会采用符合行业内标准的安全保护措施。
  b.对违规账号、欺诈行为进行处罚公告时，我们会披露相关账号的信息。
  3.4依法豁免征得同意提供、公开的个人信息
  请您理解，在下列情形中，根据法律法规及国家标准，我们向合作方提供、公开您的个人信息无需征得您的授权同意：
  a.根据您的要求订立或履行合同所必需；
  b.为履行法定职责或者法定义务所必需；
  c.与国家安全、国防安全直接相关的；
  d.与刑事侦查、起诉、审判和判决执行等直接相关的；
  e.为应对突发公共卫生事件，或者紧急情况下为保护自然人的生命健康和财产安全所必需；
  f.为公共利益实施新闻报道、舆论监督等行为，在合理的范围内处理个人信息；
  g.依照相关法律规定处理您自行公开或者其他已经合法公开的个人信息；
  h.从合法公开披露的信息中收集个人信息的；
  i.法律、行政法规规定的其他情形。
  4我们如何存储个人信息
  4.1存储地点
  我们依照法律法规的规定，将在境内运营过程中收集和产生的您的个人信息存储于中华人民共和国境内。目前，我们不会将上述信息传输至境外，如果我们向境外传输，会严格遵守中国的相关法律、监管政策，并会遵循相关国家规定或者征求您的同意。
  4.2存储期限
  我们致力于竭尽全力保障您的个人信息安全，仅在为提供太阳石矿山大模型服务之目的所必需的期间内保留您的个人信息，不做超出必要原则的留存。例如：
  手机号码：当您使用手机号码注册登录时，我们需要持续保留您的手机号码，以便于向您提供正常的服务并保障您的账号和系统安全。
  您输入的信息、反馈的信息、点赞、点踩及相关信息，在您未撤回、删除或未注销账号期间，我们会保留相关信息用于向您提供持续的业务功能。
  如果您注销帐户、主动删除个人信息或超出必要的期限后，我们将对您的个人信息进行删除或匿名化处理，但以下情况除外：
  遵从法律法规有关信息留存的要求。
  出于财务、审计、争议解决等目的需要合理延长期限的。
  5我们如何保护个人信息的安全
  5.1 我们非常重视您个人信息的安全，将努力采取合理的安全措施（包括技术方面和管理方面）来保护您的个人信息，防止您提供的个人信息被不当使用或未经授权的情况下被访问、公开披露、使用、修改、损坏、丢失或泄漏。
  5.2 我们会使用不低于行业同行的加密技术、匿名化处理及相关合理可行的手段保护您的个人信息，并使用安全保护机制防止您的个人信息遭到恶意攻击。
  5.3 我们会建立专门的安全部门、安全管理制度、数据安全流程保障您的个人信息安全。我们采取严格的数据使用和访问制度，确保只有授权人员才可访问您的个人信息，并适时对数据和技术进行安全审计。
  5.4 尽管已经采取了上述合理有效措施，并已经遵守了相关法律规定要求的标准，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全，我们将尽力确保您提供给我们的个人信息的安全性。
  5.5 您知悉并理解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。因此，我们强烈建议您采取积极措施保护个人信息的安全，包括但不限于使用复杂密码、定期修改密码、不将自己的账号密码及相关个人信息透露给他人。
  5.6 我们会制定应急处理预案，并在发生用户信息安全事件时立即启动应急预案，努力阻止这些安全事件的影响和后果扩大。一旦发生用户信息安全事件（泄露、丢失）后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已经采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施。我们将及时将事件相关情况以推送通知、邮件、信函、短信及相关形式告知您，难以逐一告知时，我们会采取合理、有效的方式发布公告。同时，我们还将按照相关监管部门要求，上报用户信息安全事件的处置情况。
  5.7 您一旦离开【太阳石矿山大模型】及相关服务，浏览或使用其他网站、服务及内容资源，我们将没有能力和直接义务保护您在【太阳石矿山大模型】及相关服务之外的软件、网站提交的任何个人信息，无论您登录、浏览或使用上述软件、网站是否基于【太阳石矿山大模型】的链接或引导。
  6行使您的个人信息权利
  我们非常重视您对个人信息的管理，并尽全力保护您对于您个人信息的查阅、复制、更正、补充、删除、撤回同意授权、注销账号、投诉举报以及设置隐私功能等权利，以使您有能力保障您的隐私和信息安全。
  6.1改变或撤回授权范围
  您可以关闭、改变同意范围或撤回您的授权。
  请您理解，当您执行上述操作后，我们将无法继续为您提供撤回同意或授权所对应的服务，我们将不再收集与这些权限相关的信息，但不会影响此前基于您的授权而开展的个人信息处理。
  6.2查阅、复制、更正、补充、删除您的个人信息
  您可以通过如下方式查阅、复制、更正、补充或删除您的个人信息：
  a.查阅/更正/补充账号信息：点击头像账号区域，进行操作
  b.查阅/复制/删除历史对话：点击对话框--点击单个对话--删除
  6.3注销账号
  您可以注销账号。在您注销账号前，我们将验证您的个人身份、安全状态、设备信息等。您知悉并理解，注销账号是不可逆的行为，当您注销账号后，我们将停止为您提供任何服务，并删除有关您账号的一切信息或对相关信息进行匿名化处理，因法律法规规定需要留存个人信息的，我们承诺将其单独存储，并不会将该等信息用于日常业务活动中。
  6.4意见反馈和投诉举报
  您可以按照我们公示的方式进行意见反馈和投诉或举报。如果您或其他有权主体对相关法律法规赋予的个人信息权利的行使，有任何主张、要求或者疑问，或者如果您有任何意见或您认为您的个人信息权利可能受到侵害，或者发现侵害个人信息权利的线索，您可以通过（solstone-support@mail.ccri.ccteg.cn）与我们联系。
  6.5访问隐私政策
  关于隐私政策，您可以在太阳石矿山大模型网页版"我的--设置--关于太阳石矿山大模型--隐私政策"进行访问。
  6.6停止运营并向您告知
  如我们停止运营，我们将及时停止收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，并对所持有的您的个人信息进行删除或匿名化处理。
  7未成年人条款
  我们非常重视对未成年个人信息的保护。
  我们禁止未满18周岁的未成年人使用本产品及相关服务。
  8隐私政策的修订和通知
  8.1 为了给您提供更好的服务，太阳石矿山大模型及相关服务将不时更新与变化，我们会适时对本隐私政策进行修订，这些修订构成本隐私政策的一部分并具有等同于本隐私政策的效力。
  8.2 本隐私政策更新后，我们会在太阳石矿山大模型发出更新版本，并在更新后的条款生效前通过官方网站公告或其他适当的方式提醒您更新的内容，以便您及时了解本隐私政策的最新版本。
  9联系我们
  9.1 太阳石矿山大模型由煤炭科学研究总院有限公司提供，如果您对个人信息保护问题有投诉、建议、疑问，您可以将问题发送至（solstone-support@mail.ccri.ccteg.cn），我们核查并验证后会及时反馈您的投诉与举报。
  9.2如对本隐私政策有任何疑问、意见或建议，您可通过如下方式与我们联系：
  a.将问题发送至solstone-support@mail.ccri.ccteg.cn。
  b.拨打以下电话：(010) 8426-3758。`;
  }
};

// 检查用户名长度，控制提示显示
const checkNameLength = (name, type) => {
  if (type === 'login') {
    // 当用户名长度大于等于10字符时显示提示
    showLoginNameLimitTip.value = name.length >= 10;
  } else if (type === 'register') {
    // 当用户名长度大于等于10字符时显示提示
    showRegisterNameLimitTip.value = name.length >= 10;
  }
};

// 在组件卸载时清除定时器
onUnmounted(() => {
  if (accountLockedTimer.value) {
    clearInterval(accountLockedTimer.value);
  }
});
</script>
  
<style scoped>
.page-container {
  height: auto;
  display: flex;
  flex-direction: column;
  background: #f8f8f8;
}

.login-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.auth-dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 50px;
  width: 100%;
  max-width: 500px;
}

.auth-title {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 1.5em;
  font-weight: normal;
}

.auth-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.tab-item.active {
  color: #800080;
  font-weight: 500;
  border-bottom: 2px solid #800080;
  margin-bottom: -2px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #800080;
  box-shadow: 0 0 0 2px rgba(128, 0, 128, 0.1);
}

.auth-button {
  width: 100%;
  padding: 12px 0;
  background: #800080;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.auth-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.auth-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin: 10px 0;
  text-align: center;
}

.footer {
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
  background: white;
  border-top: 1px solid #eee;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 80%;
  max-width: 600px;
}

.modal-header {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.modal-content {
  white-space: pre-wrap;
  text-align: left;
}

.close-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  color: #999;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #333;
}

.password-strength-meter {
  margin-top: 10px;
}

.strength-text {
  font-size: 12px;
  color: #666;
}

.strength-bar {
  height: 5px;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 5px;
}

.strength-bar-fill {
  height: 100%;
}

.strength-tips {
  font-size: 10px;
  color: #999;
  margin-top: 5px;
}

/* 添加表单提示样式 */
.input-limit-tip {
  position: absolute;
  right: 10px;
  top: 40px;
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
  z-index: 1;
  transition: opacity 0.3s;
}

.input-limit-warning {
  color: #ff6b6b;
}

/* 密码输入框相关样式 */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
  z-index: 2;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle-icon:hover {
  color: #800080;
}

.password-input-container .form-input {
  padding-right: 40px;
}

/* 480px以下 */
@media (max-width: 480px) {
  .login-content {
    align-items: flex-start;
    padding: 40px 15px 40px 15px;
  }
  
  .auth-dialog {
    padding: 30px 20px;
    border-radius: 8px;
    margin-top: 0;
  }
  
  .auth-title {
    font-size: 1.3em;
    margin-bottom: 25px;
  }
  
  .auth-tabs {
    margin-bottom: 25px;
  }
  
  .tab-item {
    padding: 10px 0;
    font-size: 14px;
  }
  
  .form-group {
    margin-bottom: 18px;
  }
  
  .modal {
    width: 90%;
    max-width: none;
    margin: 0 5%;
  }
  
  .modal-body {
    max-height: 300px;
  }
}
</style>