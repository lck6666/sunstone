// store.js
import { reactive } from 'vue';

const store = reactive({
  isLoggedIn: false,
  token: '',
  userInfo: {
    user_name: '',
  },
  // 同步登录状态的方法
  syncLoginStatus() {
    const userId = sessionStorage.getItem('user_id');
    if (userId) {
      this.isLoggedIn = true;
      this.userInfo.user_name = sessionStorage.getItem('user_name');
    } else {
      this.isLoggedIn = false;
      this.userInfo.user_name = '';
    }
  }
});

// 初始化时同步一次登录状态
store.syncLoginStatus();

export default store;