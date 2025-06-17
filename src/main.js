import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import store from './store'
import { EncryptionTester } from './utils/encryption-test'
import './utils/encryption'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$store = store
app.mount('#app')

/* if (process.env.NODE_ENV !== 'production') {
  console.log('===== 加密功能测试工具已加载 =====');
  console.log('可以在控制台使用 EncryptionTester.runAllTests() 运行所有测试');
  console.log('或者使用以下方法测试单项功能:');
  console.log('EncryptionTester.testEncryptDecrypt("测试文本")');
  console.log('EncryptionTester.testSignature({key: "value"})');
  console.log('EncryptionTester.testRequestFormat()');
  console.log('=================================');
} */
