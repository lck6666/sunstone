<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="footer-department">
          <div class="footer-logo">
            <p>煤炭科学研究总院</p>
          </div>
          <div class="qrcode">
            <img src="../assets/images/qrcode1.jpg" alt="扫码关注公众号" />
            <p>扫码关注公众号</p>
          </div>
        </div>
        <div class="footer-department">
          <div class="footer-logo">
            <p>矿山人工智能研究院</p>
          </div>
          <div class="qrcode">
            <img src="../assets/images/qrcode2.jpg" alt="扫码关注公众号" />
            <p>扫码关注公众号</p>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>电话:(010) 8426-3758</p>
          <p>邮箱:solstone-support@mail.ccri.ccteg.cn</p>
          <p>地址:北京市朝阳区和平里青年沟东路5号</p>
        </div>
        <!-- <div class="footer-section">
          <h3>友情链接</h3>
          <p>煤炭科学研究总院</p>
          <p>中国煤炭工业协会</p>
          <p>北京大学</p>
        </div> -->
      </div>
    </div>
    <div class="copyright">
      <p>版权所有:煤炭科学研究总院有限公司 · 生成式人工智能服务备案号:Beijing-TaiYangShiKuangShan-202503180064 · 京ICP备05086979号-33</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 40px 0 20px;
}

.footer-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 180px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.footer-left {
  display: flex;
  flex-direction: row;
  gap: 40px;
}

.footer-department {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 140px;
}

.footer-logo p {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  white-space: nowrap;
}

.footer-logo img {
  height: 50px;
}

.qrcode {
  text-align: center;
}

.qrcode img {
  width: 120px;
  height: 120px;
  background-color: #fff;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.qrcode p {
  font-size: 12px;
  margin: 0;
  color: #ccc;
}

.footer-right {
  display: flex;
  gap: 60px;
  flex-shrink: 0;
}

.footer-section h3 {
  text-align: left;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: bold;
}

.footer-section p {
  text-align: left;
  margin: 8px 0;
  color: #ccc;
  font-size: 14px;
  line-height: 1.5;
}

.copyright {
  text-align: center;
  margin-top: 40px;
  padding: 20px 20px 0;
  border-top: 1px solid #555;
  color: #ccc;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
}

/* 平板设备 (768px - 1024px) */
@media (max-width: 1024px) {
  .footer-content {
    padding: 0 30px;
    gap: 60px;
  }
  
  .footer-left {
    gap: 30px;
  }
  
  .footer-right {
    gap: 40px;
  }
  
  .qrcode img {
    width: 100px;
    height: 100px;
  }
}

/* 小平板和大手机 (480px - 768px) */
@media (max-width: 768px) {
  .app-footer {
    padding: 30px 0 15px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 30px;
    padding: 0 20px;
  }
  
  .footer-left {
    justify-content: center;
    gap: 40px;
  }
  
  .footer-right {
    align-self: center;
    gap: 30px;
  }
  
  .footer-section h3 {
    font-size: 16px;
  }
  
  .footer-section p {
    font-size: 13px;
  }
  
  .copyright {
    margin-top: 30px;
    padding-top: 15px;
    font-size: 12px;
  }
}

/* 手机设备 (最大 480px) */
@media (max-width: 480px) {
  .app-footer {
    padding: 20px 0 10px;
  }
  
  .footer-content {
    gap: 25px;
    padding: 0 15px;
  }
  
  .footer-left {
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }
  
  .footer-department {
    align-items: center;
    text-align: center;
    min-width: auto;
  }
  
  .footer-logo p {
    font-size: 14px;
  }
  
  .qrcode img {
    width: 80px;
    height: 80px;
  }
  
  .qrcode p {
    font-size: 11px;
  }
  
  .footer-right {
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
  
  .footer-section {
    text-align: center;
  }
  
  .footer-section h3 {
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  .footer-section p {
    font-size: 12px;
    margin: 6px 0;
    word-break: break-all;
  }
  
  .copyright {
    margin-top: 20px;
    padding-top: 10px;
    font-size: 11px;
    line-height: 1.8;
  }
}

/* 超小屏幕 (最大 320px) */
@media (max-width: 320px) {
  .footer-content {
    padding: 0 10px;
  }
  
  .footer-left {
    gap: 20px;
  }
  
  .footer-logo p {
    font-size: 13px;
  }
  
  .qrcode img {
    width: 70px;
    height: 70px;
  }
  
  .footer-section h3 {
    font-size: 14px;
  }
  
  .footer-section p {
    font-size: 11px;
  }
  
  .copyright {
    font-size: 10px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>