<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <img src="../assets/images/solstone_logo_new.jpg" alt="煤炭科学研究总院" />
      </div>
      
      <!-- 桌面端导航 -->
      <nav class="main-nav desktop-nav">
        <span 
          :class="{ active: $route.path === '/core-capability' }"
          @click="goToPage('/core-capability')"
        >
          核心能力
        </span>
        <span 
          :class="{ active: $route.path === '/intelligent-qa' || $route.path === '/intelligent-qa-login' }"
          @click="goToIntelligentQA"
        >
          智能问答
        </span>
        <span  
          :class="{ active: $route.path === '/capability-co-creation' }"
          @click="goToPage('/capability-co-creation')"
        >
          能力共创
        </span>
      </nav>

      <!-- 移动端汉堡菜单按钮 -->
      <div class="mobile-menu-toggle" @click="toggleMobileMenu">
        <div class="hamburger" :class="{ active: isMobileMenuVisible }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="user-actions" @click="toggleDropdown">
        <template v-if="store.isLoggedIn">
          <img src="../assets/images/default-avatar.svg" class="user-avatar">
          <span class="user-name">{{ store.userInfo.user_name }}</span>
          <div v-if="isDropdownVisible" class="dropdown-menu">
            <span @click="logout">退出登录</span>
          </div>
        </template>
        <template v-else>
          <span 
            class="login" 
            :class="{ 'active-tab': isLoginPage && activeTab === 'login' }"
            @click.stop="goToLogin('login')"
          >
            登录
          </span>
          <span 
            class="register" 
            :class="{ 'active-tab': isLoginPage && activeTab === 'register' }"
            @click.stop="goToLogin('register')"
          >
            注册
          </span>
        </template>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <div class="mobile-nav" :class="{ active: isMobileMenuVisible }">
      <nav class="mobile-nav-content">
        <span 
          :class="{ active: $route.path === '/core-capability' }"
          @click="goToPageMobile('/core-capability')"
        >
          核心能力
        </span>
        <span 
          :class="{ active: $route.path === '/intelligent-qa' || $route.path === '/intelligent-qa-login' }"
          @click="goToIntelligentQAMobile"
        >
          智能问答
        </span>
        <span  
          :class="{ active: $route.path === '/capability-co-creation' }"
          @click="goToPageMobile('/capability-co-creation')"
        >
          能力共创
        </span>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import store from '@/store.js';

const router = useRouter();
const route = useRoute();
const isDropdownVisible = ref(false);
const isMobileMenuVisible = ref(false);

const isLoginPage = computed(() => route.path === '/login');
const activeTab = computed(() => route.query.tab || 'login');

watch(route, (to, from) => {
  isDropdownVisible.value = false;
  isMobileMenuVisible.value = false;
});

const goToPage = (path) => {
  router.push(path);
};

const goToPageMobile = (path) => {
  router.push(path);
  isMobileMenuVisible.value = false;
};

const goToLogin = (tab = 'login') => {
  if (route.path === '/login') {
    router.replace({
      path: '/login',
      query: { tab }
    });
  } else {
    router.push({
      path: '/login',
      query: { tab }
    });
  }
};

const goToIntelligentQA = () => {
  if (store.isLoggedIn) {
    router.push('/intelligent-qa-login');
  } else {
    router.push('/intelligent-qa');
  }
};

const goToIntelligentQAMobile = () => {
  if (store.isLoggedIn) {
    router.push('/intelligent-qa-login');
  } else {
    router.push('/intelligent-qa');
  }
  isMobileMenuVisible.value = false;
};

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const toggleMobileMenu = () => {
  isMobileMenuVisible.value = !isMobileMenuVisible.value;
};

const logout = () => {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('user_name');

  store.isLoggedIn = false;
  store.userInfo.user_name = '';

  isDropdownVisible.value = false;

  if (router.path === '/intelligent-qa-login') {
    router.push('/intelligent-qa');
  } else {
    router.go(0);
  }
};

const handleClickOutside = (event) => {
  const userActions = document.querySelector('.user-actions');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (isDropdownVisible.value && userActions && !userActions.contains(event.target)) {
    isDropdownVisible.value = false;
  }
  
  if (isMobileMenuVisible.value && 
      mobileMenuToggle && !mobileMenuToggle.contains(event.target) &&
      mobileNav && !mobileNav.contains(event.target)) {
    isMobileMenuVisible.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.app-header {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  width: 100%;
  margin: 0 auto;
}

.logo img {
  height: 40px;
}

.main-nav {
  display: flex;
  gap: 30px;
}

.main-nav a,
.main-nav span {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 5px 0;
  position: relative;
  cursor: pointer;
}

.main-nav a.active,
.main-nav span.active {
  color: #4a6bff;
}

.main-nav a.active::after,
.main-nav span.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #4a6bff;
}

.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  padding: 10px;
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.3s ease-in-out;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #333;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.3s ease-in-out;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 7px;
}

.hamburger span:nth-child(3) {
  top: 14px;
}

.hamburger.active span:nth-child(1) {
  top: 7px;
  transform: rotate(135deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.active span:nth-child(3) {
  top: 7px;
  transform: rotate(-135deg);
}

.mobile-nav {
  display: none;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #eee;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.mobile-nav.active {
  max-height: 300px;
}

.mobile-nav-content {
  display: flex;
  flex-direction: column;
  padding: 20px 40px;
}

.mobile-nav-content span {
  padding: 15px 0;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.3s ease;
}

.mobile-nav-content span:hover {
  color: #4a6bff;
}

.mobile-nav-content span.active {
  color: #4a6bff;
}

.mobile-nav-content span:last-child {
  border-bottom: none;
}

.user-actions {
  display: flex;
  min-width: 120px;
  gap: 20px;
  align-items: center;
  position: relative;
}

.login, .register {
  cursor: pointer;
  white-space: nowrap;
}

.register {
  font-weight: 500;
}

.active-tab {
  color: #4a6bff;
  font-weight: 500;
}

.user-avatar {
  width: 40px; 
  height: 40px; 
  object-fit: cover; 
  border-radius: 50%; 
  flex-shrink: 0;
}

.user-name {
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 8px;
  z-index: 101;
  min-width: 120px;
}

.dropdown-menu span {
  display: block;
  padding: 8px 16px;
  cursor: pointer;
}

.dropdown-menu span:hover {
  background-color: #f0f0f0;
}

/* 平板端适配 */
@media (max-width: 1024px) {
  .header-content {
    padding: 15px 20px;
  }
  
  .main-nav {
    gap: 20px;
  }
  
  .user-actions {
    min-width: 100px;
    gap: 15px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    padding: 10px 20px;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .logo img {
    height: 35px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
    order: -1;
  }
  
  .mobile-nav {
    display: block;
  }
  
  .user-actions {
    min-width: auto;
    gap: 10px;
  }
  
  .user-name {
    display: none;
  }
  
  .login, .register {
    font-size: 14px;
  }
}

/* 小屏移动端适配 */
@media (max-width: 480px) {
  .header-content {
    padding: 8px 15px;
  }
  
  .logo img {
    height: 30px;
  }
  
  .mobile-nav-content {
    padding: 15px 20px;
  }
  
  .mobile-nav-content span {
    padding: 12px 0;
    font-size: 16px;
  }
  
  .user-actions {
    gap: 8px;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
  }
  
  .login, .register {
    font-size: 13px;
  }
  
  .dropdown-menu {
    min-width: 100px;
    right: -10px;
  }
}

/* 超小屏适配 */
@media (max-width: 360px) {
  .header-content {
    padding: 8px 10px;
  }
  
  .logo img {
    height: 28px;
  }
  
  .user-actions {
    gap: 5px;
  }
  
  .user-avatar {
    width: 30px;
    height: 30px;
  }
  
  .login, .register {
    font-size: 12px;
  }
}
</style>