<template>
  <div class="capability-co-creation-page">
    <!-- 第一部分：行业智能化能力共创 -->
    <div class="section section-banner">
      <div class="banner-content">
        <div class="content-wrapper">
          <h2>行业智能化能力共创</h2>
          <p>智慧煤炭，协同奋进，共普新篇，我们需要您的加入</p>
          <button class="contact-button" @click="showContactDialog = true">联系我们</button>
        </div>
      </div>
      <div class="banner-overlay"></div>
      <img :src="bannerImage" alt="行业智能化能力共创" class="banner-image" />
    </div>

    <!-- 第二部分：煤炭行业智能化场景图谱 -->
    <div class="section section-map">
      <div class="container">
        <h2 class="section-title">煤炭行业智能化场景图谱</h2>
        <div class="map-wrapper">
          <img :src="mapImage" alt="煤炭行业智能化场景图谱" class="section-image" />
        </div>
      </div>
    </div>

    <!-- 第三部分：太阳石矿山大模型和全域测试床 -->
    <div class="section section-models">
      <div class="container">
        <h2 class="section-title">核心技术与平台</h2>
        <div class="model-container">
          <div class="model-item">
            <div class="model-card">
              <img :src="modelImage1" alt="太阳石矿山大模型" class="model-image" />
              <div class="model-caption">太阳石矿山大模型</div>
            </div>
          </div>
          <div class="model-item">
            <div class="model-card">
              <img :src="modelImage2" alt="全域测试床" class="model-image" />
              <div class="model-caption">全域测试床</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 联系我们弹窗 -->
    <div v-if="showContactDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <h3>联系我们</h3>
          <button class="close-icon" @click="showContactDialog = false">×</button>
        </div>
        <p class="introduction">为了更好地与您沟通煤炭行业智能化能力共创相关事宜，请留下您的基础信息。以下信息中'姓名'、'所在单位'为必填项，联系方式（联系电话或电子邮箱二选一）为必填项，其他信息您可根据自身情况选填。感谢您的支持与配合！</p>
        
        <form @submit.prevent="handleSubmit" class="contact-form">
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input v-model="formData.name" type="text" required placeholder="请输入您的真实姓名">
          </div>

          <div class="form-group">
            <label>单位名称 <span class="required">*</span></label>
            <input v-model="formData.company" type="text" required placeholder="请输入所在单位名称">
          </div>

          <div class="form-group">
            <label>单位行业</label>
            <select v-model="formData.industry">
              <option value="">请选择单位行业</option>
              <option value="煤炭行业">煤炭行业</option>
              <option value="能源行业">能源行业</option>
              <option value="科技行业">科技行业</option>
              <option value="金融行业">金融行业</option>
              <option value="其他">其他</option>
            </select>
            <input v-if="formData.industry === '其他'" v-model="formData.otherIndustry" type="text" placeholder="请输入具体行业">
          </div>

          <div class="form-group">
            <label>所在领域</label>
            <select v-model="formData.field">
              <option value="">请选择所在领域</option>
              <option value="矿山安全风险监测预警">矿山安全风险监测预警</option>
              <option value="智能问答">智能问答</option>
              <option value="数字人">数字人</option>
              <option value="文检助手">文检助手</option>
              <option value="生态环保">生态环保</option>
              <option value="地质测量">地质测量</option>
              <option value="运输销售">运输销售</option>
              <option value="工程基建">工程基建</option>
              <option value="应急救援">应急救援</option>
              <option value="井工开采">井工开采</option>
              <option value="露天开采">露天开采</option>
              <option value="煤层气开采">煤层气开采</option>
              <option value="煤化工">煤化工</option>
              <option value="洗选加工">洗选加工</option>
              <option value="其他">其他</option>
            </select>
            <input v-if="formData.field === '其他'" v-model="formData.otherField" type="text" placeholder="请输入具体领域">
          </div>

          <div class="form-group">
            <label>联系方式 <span class="required">*</span></label>
            <p class="hint">请您选择以下任意一种方式留下联系方式</p>
            <div class="contact-inputs">
              <input v-model="formData.phone" type="tel" placeholder="请输入联系电话">
              <span class="separator">或</span>
              <input v-model="formData.email" type="email" placeholder="请输入电子邮箱">
            </div>
          </div>

          <div class="form-group">
            <label>合作意向描述</label>
            <textarea v-model="formData.intention" rows="4" placeholder="请简要描述您的合作意向，例如希望参与的项目、提供的资源或技术等"></textarea>
          </div>

          <div class="form-buttons">
            <button type="submit" class="submit-button" :disabled="!isFormValid">提交</button>
            <button type="button" class="reset-button" @click="resetForm">重置</button>
          </div>
        </form>

        <p class="privacy-notice">隐私声明：我们收集的信息仅用于行业能力共创相关沟通和合作，不会泄露给第三方。</p>
      </div>
    </div>
  </div>
</template>

<script>
import banner2 from '@/assets/images/banner_2.jpg';
import banner3 from '@/assets/images/eco.png';
import sunstoneModel from '@/assets/images/太阳石矿山大模型-共创页.png';
import testbedModel from '@/assets/images/全域测试床-共创页.png';
import { submitContactForm } from '@/api/contact.js';

export default {
  name: 'CapabilityCoCreation',
  data() {
    return {
      bannerImage: banner2,
      mapImage: banner3,
      modelImage1: sunstoneModel,
      modelImage2: testbedModel,
      showContactDialog: false,
      formData: {
        name: '',
        company: '',
        industry: '',
        otherIndustry: '',
        field: '',
        otherField: '',
        phone: '',
        email: '',
        intention: ''
      }
    };
  },
  computed: {
    isFormValid() {
      return this.formData.name.trim() !== '' && 
             this.formData.company.trim() !== '' && 
             (this.formData.phone.trim() !== '' || this.formData.email.trim() !== '');
    }
  },
  methods: {
    validatePhone(phone) {
      const phoneReg = /^1[3-9]\d{9}$/;
      return phoneReg.test(phone);
    },
    validateEmail(email) {
      const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return emailReg.test(email);
    },
    async handleSubmit() {
      if (!this.isFormValid) {
          return;
      }
      if (this.formData.phone && !this.validatePhone(this.formData.phone)) {
          alert('请输入正确的手机号码');
          return;
      }
      if (this.formData.email && !this.validateEmail(this.formData.email)) {
          alert('请输入正确的邮箱地址');
          return;
      }
      
      try {
        // 准备接口所需的数据格式
        const contactData = {
          user_id: sessionStorage.getItem('user_id') || 'guest',
          name: this.formData.name,
          company_name: this.formData.company,
          industry: this.formData.industry === '其他' ? this.formData.otherIndustry : this.formData.industry,
          field: this.formData.field === '其他' ? this.formData.otherField : this.formData.field,
          phone_number: this.formData.phone || null,
          email: this.formData.email || null,
          cooperation_intent: this.formData.intention || null
        };
        
        // 调用 API 提交表单
        await submitContactForm(contactData);
        alert('提交成功！我们会尽快与您联系。');
        this.resetForm();
        this.showContactDialog = false;
      } catch (error) {
        //console.error('提交失败:', error);
        alert('提交失败，请稍后再试');
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        company: '',
        industry: '',
        otherIndustry: '',
        field: '',
        otherField: '',
        phone: '',
        email: '',
        intention: ''
      };
    }
  }
};
</script>

<style scoped>
.capability-co-creation-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  /*padding: 0 0 50px;*/
  position: relative;
  background-color: #f8f9fa;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #4a6bff;
}

.section {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 60px 0;
  overflow: hidden;
  position: relative;
}

.section-banner {
  position: relative;
  height: 400px;
  overflow: hidden;
  padding: 0;
  display: flex;
  align-items: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4), transparent);
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  max-width: 100%;
  filter: brightness(0.9);
}

.banner-content {
  position: absolute;
  z-index: 2;
  color: white;
  text-align: left;
  padding: 0 45% 0 10%;
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 600px;
}

.content-wrapper h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.content-wrapper p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.contact-button {
  padding: 12px 30px;
  background-color: #4a6bff;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(74, 107, 255, 0.3);
}

.contact-button:hover {
  background-color: #3955d8;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(74, 107, 255, 0.4);
}

.section-map {
  background-color: white;
}

.map-wrapper {
  width: 100%;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.section-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  display: block;
  object-fit: contain;
}

.section-models {
  background-color: #f0f4f8;
}

.model-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  width: 100%;
}

.model-item {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
}

.model-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.model-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.model-image {
  width: 100%;
  height: auto;
  display: block;
}

.model-caption {
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #333;
  background-color: white;
}

/* 弹窗样式 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(4px);
}

.dialog {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: dialogFadeIn 0.3s ease;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.introduction {
  margin: 15px 0;
  line-height: 1.6;
  color: #666;
  text-align: left;
}

.contact-form {
  margin: 20px 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.required {
  color: #ff4d4f;
  margin-left: 4px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4a6bff;
  box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.2);
  outline: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.hint {
  font-size: 13px;
  color: #888;
  margin-bottom: 8px;
}

.contact-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.separator {
  color: #888;
  font-size: 14px;
}

.form-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.submit-button,
.reset-button {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.submit-button {
  background-color: #4a6bff;
  color: white;
  box-shadow: 0 4px 8px rgba(74, 107, 255, 0.3);
}

.submit-button:hover:not(:disabled) {
  background-color: #3955d8;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(74, 107, 255, 0.4);
}

.reset-button {
  background-color: #f5f5f5;
  color: #666;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reset-button:hover {
  background-color: #e8e8e8;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.privacy-notice {
  font-size: 13px;
  color: #888;
  margin: 20px 0 0;
  text-align: center;
}

.dialog-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.dialog-header h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
  width: 100%;
  text-align: center;
}

.close-icon {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
  position: absolute;
  right: 0;
  top: -5px;
  transition: all 0.2s ease;
}

.close-icon:hover {
  color: #333;
  transform: scale(1.1);
}

.submit-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .section {
    padding: 40px 0;
  }

  .section-title {
    font-size: 24px;
  }

  .content-wrapper h2 {
    font-size: 28px;
  }

  .content-wrapper p {
    font-size: 16px;
  }

  .banner-content {
    padding: 0 5%;
    text-align: center;
  }

  .model-container {
    flex-direction: column;
  }

  .model-item {
    max-width: 100%;
  }

  .contact-inputs {
    flex-direction: column;
  }

  .separator {
    margin: 10px 0;
  }
}
</style>    