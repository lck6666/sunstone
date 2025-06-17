<template>
  <div class="core-capability-page">
    <!-- Banner模块 -->
    <section class="banner-section">
      <div class="banner-carousel">
        <div class="banner-slides" :style="{ transform: `translateX(-${currentBannerIndex * 100}%)` }">
          <div v-for="(banner, index) in bannerData" :key="index" class="banner-slide" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.subtitle }}</h2>
              <div class="banner-title">
                <div class="icon-wrapper">
                  <img class="icon" :src="solstoneLogo">
                </div>
                <h1>{{ banner.title }}</h1>
              </div>
              <p>{{ banner.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="banner-indicators">
          <span 
            v-for="(_, index) in bannerData" 
            :key="index" 
            :class="{ active: currentBannerIndex === index }"
            @click="setCurrentBanner(index)"
          ></span>
        </div>
      </div>
    </section>
    <div class="content">
      <!-- 核心能力模块 -->
      <section class="capability-section">
        <h2 class="section-title">核心能力</h2>
        <p class="section-subtitle">AI时代，开启智能、开放、简单的全新服务模式</p>
        <div class="capability-carousel">
          <div class="carousel-nav left" @click="prevCapability">
            <span>&lt;</span>
          </div>
          <div class="capability-cards">
            <div 
              v-for="(capability, index) in capabilityData" 
              :key="index" 
              class="capability-card" 
              :class="{ active: currentCapabilityIndex === index }"
              @click="setCurrentCapability(index)"
            >
              <div class="card-icon">
                <img :src="capability.icon">
              </div>
              <h3>{{ capability.title }}</h3>
            </div>
          </div>
          <div class="carousel-nav right" @click="nextCapability">
            <span>&gt;</span>
          </div>
        </div>
        <div class="capability-detail" v-if="currentCapability">
          <div class="detail-left">
            <p class="detail-description">{{ currentCapability.description }}</p>
          </div>
          <div class="detail-right">
            <img v-if="currentCapability.detailImage" :src="currentCapability.detailImage" alt="详情图片" class="detail-image">
          </div>
        </div>
      </section>

      <!-- 场景应用模块 -->
      <section class="application-section">
        <h2 class="section-title">场景应用</h2>
        <p class="section-subtitle">全面精准的应用场景服务能力</p>
        <div class="application-carousel">
          <div class="carousel-nav left" @click="prevApplication">
            <span>&lt;</span>
          </div>
          <div class="application-items">
            <div 
              v-for="(item, index) in applicationData" 
              :key="index" 
              class="application-item"
              :class="{ active: currentApplicationIndex === index }"
              @click="setCurrentApplication(index)"
            >
              <div class="item-icon">
                <img :src="item.icon">
              </div>
              <h3>{{ item.title }}</h3>
            </div>
          </div>
          <div class="carousel-nav right" @click="nextApplication">
            <span>&gt;</span>
          </div>
        </div>
        <div class="application-detail" v-if="currentApplication">
          <div class="detail-left">
            <h3>{{ currentApplication.detailTitle }}</h3>
            <p class="detail-description">
              {{ currentApplication.description }}
            </p>
          </div>
          <div class="detail-right">
            <div class="qa-demo" v-if="currentApplication.demoContent">
              <div v-for="(qa, idx) in currentApplication.demoContent" :key="idx" class="qa-item">
                <div class="qa-icon">{{ qa.type }}</div>
                <p>{{ qa.content }}</p>
              </div>
            </div>
            <img v-else-if="currentApplication.detailImage" :src="currentApplication.detailImage" alt="详情图片" class="detail-image">
          </div>
        </div>
      </section>

      <!-- 新闻与活动模块 -->
      <section class="news-section">
        <h2 class="section-title">新闻与活动</h2>
        <p class="section-subtitle">获取最新的新闻及活动信息</p>

        <div class="news-carousel">
          
          <div class="news-nav left" :class="{disabled:!canPrev}" @click="prevNews" :disabled="!canPrev">
            <span>&lt;</span>
          </div>

          <div class="news-items">
            <div class="news-items-container" :style="{ transform: `translateX(${-currentNewsIndex * (300 + 30)}px)` }">
              <div v-for="(item, index) in newsData" :key="index" class="news-item" @click="openNewsLink(item)">
                <div class="news-image">
                  <img :src="item.image" alt="新闻图片">
                </div>
                <h3>{{ item.title }}</h3>
                <div class="news-footer">
                  <!-- <p class="news-date">{{ item.date }}</p> -->
                  <span class="news-link-hint">查看详情 &raquo;</span>
                </div>
              </div>
            </div>
          </div>
          <div class="news-nav right" :class="{disabled:!canNext}" @click="nextNews" :disabled="!canNext">
            <span>&gt;</span>
          </div>
        </div>        
      </section>

      <!-- 资质与行业引领模块 -->
      <section class="qualification-section">
        <h2 class="section-title">资质与行业引领</h2>
        <p class="section-subtitle">专业的技术能力认证，保障服务质量</p>
        <div class="qualification-tabs">
          <div 
            class="tab" 
            :class="{ active: currentQualificationTabIndex === 0 }"
            @click="setQualificationTab(0)"
          >
            专业资质
          </div>
          <div 
            class="tab" 
            :class="{ active: currentQualificationTabIndex === 1 }"
            @click="setQualificationTab(1)"
          >
            工作引领
          </div>
        </div>
        <div class="qualification-content">
          <div class="qualification-items">
            <div v-for="(item, index) in currentQualificationData" :key="index" class="qualification-item">
              <div class="qualification-image">
                <img :src="item.image" alt="证书图片">
              </div>
              <p>{{ item.title }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// banner太阳石logo
import SolstoneLogo from '@/assets/images/solstone_logo.png';
import BannerImg1 from '@/assets/images/banner_1.jpg';
import BannerImg2 from '@/assets/images/banner_2.jpg';
import BannerImg3 from '@/assets/images/banner_3.jpg';

// 核心能力部分
// 行业数据标注体系图片
import DataLabelIcon from '@/assets/images/太阳石矿山大模型.png';
import DataLabelDetailImg from '@/assets/images/数据标注详情.png';
// 太阳石矿山大模型图片
import ModelIcon from '@/assets/images/太阳石矿山大模型.png';
import ModelDetailImg from '@/assets/images/太阳石矿山大模型详情.png';
// 大小模型协同推理架构图片
import LargeSmallModelIcon from '@/assets/images/太阳石矿山大模型.png';
import LargeSmallModelDetailImg from '@/assets/images/大小模型协同详情.png';
// 行业认知能力测试床图片
import TestbedIcon from '@/assets/images/全域测试床.png';
import TestbedDetailImg from '@/assets/images/行业认知能力测试床详情.png';

// 场景应用部分
// 行业知识服务图片
import IndustryKnowledgeIcon from '@/assets/images/行业知识服务.png';
import IndustryKnowledgeDetailImg from '@/assets/images/行业知识服务详情.png';
// 行标合规验证图片
import StandardValidationIcon from '@/assets/images/行标合规验证.png';
import StandardValidationDetailImg from '@/assets/images/行标合规验证详情.png';
// 远程风险研判图片
import RemoteRiskAssessmentIcon from '@/assets/images/远程风险研判.png';
import RemoteRiskAssessmentDetailImg from '@/assets/images/远程风险研判详情.png';
// 安全生产管控图片
import SafetyManagementIcon from '@/assets/images/全域测试床.png';
import SafetyManagementDetailImg from '@/assets/images/安全生产管控详情.png';
// 时空数据分析图片
import SpatialDataAnalysisIcon from '@/assets/images/时空数据分析.png';
import SpatialDataAnalysisDetailImg from '@/assets/images/时空数据分析详情.png';

// 新闻数据
import News1Img from '@/assets/images/news1.png';
import News2Img from '@/assets/images/news2.png';
import News3Img from '@/assets/images/news3.png';
import News4Img from '@/assets/images/news4.png';
import News5Img from '@/assets/images/news5.png';

// 资质证书图片
// 专业资质
import Cert1Img from '@/assets/images/发起人工智能智库网络（AITC）.png';
import Cert2Img from '@/assets/images/全国信标委煤炭行业数字化转型专题组组长单位.png';
import Cert3Img from '@/assets/images/全国信标委视频大模型标准工作组行业应用专题组联合组长单位.png';
import Cert4Img from '@/assets/images/人工智能产业联盟能源行业推进组副组长单位.png';
import Cert5Img from '@/assets/images/获得数字化转型成熟度模型（DTMM）4级认证.png';
import Cert6Img from '@/assets/images/获得软件能力成熟度模型（CMMI）5级认证.png';

// 行业引领
import Lead1Img from '@/assets/images/入选能源行业大模型首批创新应用启航计划.png';
import Lead2Img from '@/assets/images/参编发布蓝皮书《大模型基准测试体研究报告（2024年）》.png';
import Lead3Img from '@/assets/images/牵头制订行业标准《大模型应用成熟度评估方法》.png';
import Lead4Img from '@/assets/images/第六届全球智博会发布矿山视巡V1.0获得十大产品金奖.png';
import Lead5Img from '@/assets/images/全国数据要素大赛北京分赛二等奖.png';


export default {
  name: 'CoreCapability',
  data() {
    return {
      currentBannerIndex: 0,
      currentCapabilityIndex: 0,
      currentApplicationIndex: 0,
      currentNewsIndex: 0,
      currentQualificationTabIndex: 0,
      newsContainer: null,
      visibleItems: 0,
      solstoneLogo: SolstoneLogo,
      initialized: false,
      // 轮播定时器
      bannerAutoplayInterval: null,
      capabilityAutoplayInterval: null,
      applicationAutoplayInterval: null,
      newsAutoplayInterval: null,
      // 用于跟踪哪些轮播应该自动播放
      bannerShouldAutoplay: true,
      capabilityShouldAutoplay: true,
      applicationShouldAutoplay: true,
      newsShouldAutoplay: true,
      bannerData: [
        { 
          title: '太阳石矿山大模型', 
          subtitle: '深耕煤炭行业技术积累，聚合专业数据与先进架构',
          description: '铸就安全可信认知基石，驱动矿山智能化新未来',
          image: BannerImg1
        },
        { 
          title: '矿山人工智能解决方案', 
          subtitle: '融合AI算法与行业机理，构建全域矿山智能决策中枢',
          description: '重塑生产管理模式，引领矿业向无人化、低碳化深度变革',
          image: BannerImg2
        },
        { 
          title: '多智能体矿山技术赋能', 
          subtitle: '多源异构数据实时解析，分布式智能体自主响应与协作',
          description: '突破传统作业壁垒，打造全要素互联的矿山智能生态体系',
          image: BannerImg3
        }
      ],
      capabilityData: [
        { 
          title: '行业数据标注体系', 
          icon: DataLabelIcon,
          // detailTitle: '工程煤矿业务全覆盖模型实现自主可控 引领煤炭智能化',
          // detailInfo: [
          //   '涵盖：矿井安全生产管理全流程',
          //   '数据规模：煤矿专业文档3000万'
          // ],
          description: '煤科总院面向矿山行业打造了一套全流程数据标注解决方案，构建首套数据知识标签体系，为行业生态伙伴提供了标准化、易用性强的数据标注工具，形成一系列高质量标注数据集，取得矿山行业首张数据知识产权登记证书，形成了"基座研发-数据标注-应用赋能"的良性闭环。',
          detailImage: DataLabelDetailImg
        },
        { 
          title: '太阳石矿山大模型基座', 
          icon: ModelIcon,
          // detailTitle: '工程煤矿业务全覆盖模型实现自主可控 引领煤炭智能化',
          // detailInfo: [
          //   '涵盖：矿井安全生产管理全流程',
          //   '数据规模：煤矿专业文档3000万'
          // ],
          description: '太阳石矿山大模型，是中国煤炭科工集团煤炭科学研究总院研发的百亿级参数大模型，汇聚煤炭行业海量的多模态数据，包括安全监测数据集500亿条、视觉图像数据集300万张、包括20本期刊与200亿字技术文献的专业学术期刊数据，具备面向行业场景可靠认知能力，提供可信安全的高效认知服务。',
          detailImage: ModelDetailImg
        },
        { 
          title: '大小模型协同推理架构', 
          icon: ModelIcon,
          // detailTitle: '工程煤矿业务全覆盖模型实现自主可控 引领煤炭智能化',
          // detailInfo: [
          //   '涵盖：矿井安全生产管理全流程',
          //   '数据规模：煤矿专业文档3000万'
          // ],
          description: '构建面向煤炭行业应用的大小模型协同推理架构，依托太阳石矿山大模型基座，融合煤炭行业知识与多模态数据，以大小模型深度融合、多智能体协同调度决策为核心，从行业用户意图识别切入，通过混合检索、协同推理、智能体反思讨论等环节保障推理质量，应用RAG、Agent、Text2SQL等应用架构及技术，支撑行业推理应用落地，兼顾安全加固、私有化部署等应用安全需求，为煤炭行业智能化应用注入核心技术动能。',
          detailImage: LargeSmallModelDetailImg
        },
        { 
          title: '行业认知能力测试床', 
          icon: ModelIcon,
          // detailTitle: '工程煤矿业务全覆盖模型实现自主可控 引领煤炭智能化',
          // detailInfo: [
          //   '涵盖：矿井安全生产管理全流程',
          //   '数据规模：煤矿专业文档3000万'
          // ],
          description: '行业认知能力测试床，是由中国煤炭科工集团煤炭科学研究总院研发的面向煤炭行业垂直大模型的专业测试体系，聚焦覆盖煤炭实际生产全流程的10个工作场景及40+细分维度，从生产实际出发构建8项大模型待测试能力即16项具体测试任务，使用10余项测试指标衡量行业大模型的专业能力，实现对行业大模型的专业性、应用落地性、安全性等能力的测试，促进煤炭行业大模型专业化构建与良性发展。',
          detailImage: TestbedDetailImg
        }
      ],
      applicationData: [
        { 
          title: '行业知识服务', 
          icon: IndustryKnowledgeIcon,
          // detailTitle: '智能问答，精准高效\n懂你所问，答你所求',
          description: '煤炭行业作为国民经济的重要支柱产业，涉及地质勘探、开采设计、安全生产、设备管理、政策法规等复杂环节。在数字化转型的浪潮下，行业面临知识获取效率低、信息碎片化、专业门槛高、安全规范更新快等痛点。传统信息检索方式依赖人工经验，存在耗时长、准确性不足、跨领域知识整合难等问题。\n矿山百通是基于百亿级参数大模型——太阳石大模型打造的垂直领域知识服务引擎，深度融合煤炭行业专业知识与AI技术，构建覆盖全场景的智能知识中枢，助力从业者突破信息壁垒，实现知识价值的高效转化。矿山百通搭载了海量高价值煤炭知识库，核心功能包括智能问答引擎、AI伴读与深度交互、辅助写作与知识创造，重新定义煤炭行业知识交互模式，让知识流动更智能，让煤炭行业更高效。',
          detailImage: IndustryKnowledgeDetailImg
        },
        { 
          title: '行标合规验证', 
          icon: StandardValidationIcon,
          // detailTitle: '智能预警，防患未然',
          description: '行标合规验证致力于为煤炭行业企业提供精准、高效的文档合规检查支持。它严格依据煤炭行业相关法律法规以及各类标准规范，运用先进的智能体技术，对企业内部文档展开全方位的解析、深度分析与对比研判。从文件导入伊始，到验证结果输出，全程实现自动化操作，精准识别哪些文档内容通过验证，哪些未通过，并详细阐述判断理由，助力企业快速、准确地完成大量繁琐的文档阅读与分析工作，有效提升合规管理效率，为企业稳健发展筑牢合规根基。',
          detailImage: StandardValidationDetailImg
        },
        { 
          title: '远程风险研判', 
          icon: RemoteRiskAssessmentIcon,
          // detailTitle: '全面风险管控，保障安全生产',
          description: '远程风险研判应用具备高风险作业自动监控、安全隐患提前识别与安全报警辅助研判等能力，通过海量信息精准筛查，多方信息关联整合，多模态数据联合分析、智能中枢高效规划等先进技术，助力监察人员自动研判及核查煤矿安全报警，提前发现安全风险隐患，提升安全监督检查工作的整体效率。',
          detailImage: RemoteRiskAssessmentDetailImg
        },
        { 
          title: '安全生产管控', 
          icon: SafetyManagementIcon,
          // detailTitle: '智能文档管理，高效知识沉淀',
          description: '煤炭行业安全生产涉及传感器监测、设备巡检、人员行为规范、环境风险预警等数十个关键环节，具有场景复杂（井下环境多粉尘、低光照）、风险动态变化（地质条件与设备状态实时波动）、管理颗粒度细（需精确到单个矿工动作）等特点。传统管理模式依赖人工巡查与事后追溯，存在实时监控盲区、风险识别滞后、判断标准主观等问题。\n基于对煤炭生产场景的深度理解，构建覆盖"人-机-环-管"全要素的智能管控体系，通过自主研发的多模态数据分析技术与煤炭领域的专用视觉大模型，实现从被动响应到主动预防的安全生产管理模式升级。煤炭生产全场景数据融合底座，搭载煤炭视觉大模型引擎，实现智能管控系统从实时预警、报警研判、溯源管理、预案联动的闭环，用AI之眼守护矿井安全，让每一条规范执行可感知、每一处风险暴露可量化、每一次管理决策可追溯。',
          detailImage: SafetyManagementDetailImg
        },
        { 
          title: '时空数据分析', 
          icon: SpatialDataAnalysisIcon,
          // detailTitle: '规范检查，标准化管理',
          description: '在煤炭开采领域，复杂的地质环境与多样的安全隐患为生产带来巨大挑战。随着煤矿智能化的推进，矿山生产过程中的时空数据量呈指数级增长，深度挖掘这些数据的价值成为提升生产安全与效率的核心。\n太阳石矿山大模型汇集海量的多源数据时空数据，研发自主可控的AI算法，全面覆盖采、掘、机、运、通等典型场景。它能够精准识别矿山异常事件，并通过关联分析和因果推断构建孤立异常事件间的联系，形成系统性、场景级的异常感知与理解能力。同时，能够实时评估安全风险态势，优化资源调度与应急响应机制，保障设备与人员在复杂生产与高风险条件下的高效协同作业，全方位提升矿山生产的安全性与效率，为矿山智能化注入强劲动力。',
          detailImage: SpatialDataAnalysisDetailImg
        }
      ],
      newsData: [
        { 
          title: '首张矿山行业数据知识产权登记证书落地煤科总院', 
          image: News1Img,
          link: 'https://mp.weixin.qq.com/s/QNXQogPtfYFT3EubApio-A'
        },
        { 
          title: '煤科总院受邀参加中国人工智能产业发展联盟第十三次全会', 
          image: News2Img,
          link: 'https://mp.weixin.qq.com/s/xl_5TXxKdaMKOjIFRVIcJg'
        },
        { 
          title: '煤科总院"太阳石矿山大模型"通过中国信通院安全认证', 
          image: News3Img,
          link: 'https://mp.weixin.qq.com/s/BTfDxkBEyDOaahMr3JYQjQ'
        },
        { 
          title: '煤科总院矿山人工智能研究院参加2024世界人工智能大会', 
          image: News4Img,
          link: 'https://mp.weixin.qq.com/s/0MCgr_e1WmSfDxr_BN56gA'
        },
        { 
          title: '煤科总院"太阳石矿山大模型"入选2024煤炭科技十大新闻', 
          image: News5Img,
          link: 'https://mp.weixin.qq.com/s/dqQuIzUJ_-DDw3nYpGJqUg'
        }
      ],
      qualificationData: [
        { title: '发起人工智能智库网络（AITC）', image: Cert1Img },
        { title: '全国信标委煤炭行业数字化转型专题组组长单位', image: Cert2Img },
        { title: '全国信标委视频大模型标准工作组行业应用专题组联合组长单位', image: Cert3Img },
        { title: '人工智能产业联盟能源行业推进组副组长单位', image: Cert4Img },
        { title: '获得数字化转型成熟度模型（DTMM）4级认证', image: Cert5Img },
        { title: '获得软件能力成熟度模型（CMMI）5级认证', image: Cert6Img }
      ],
      leadershipData: [
        { title: '入选能源行业大模型首批创新应用启航计划', image: Lead1Img },
        { title: '参编发布蓝皮书《大模型基准测试体研究报告（2024年）》', image: Lead2Img },
        { title: '牵头制订行业标准《大模型应用成熟度评估方法》', image: Lead3Img },
        { title: '第六届全球智博会发布矿山视巡V1.0获得十大产品金奖', image: Lead4Img },
        { title: '全国"数据要素×"大赛北京分赛二等奖', image: Lead5Img }
      ]
    }
  },
  computed: {
    currentCapability() {
      return this.capabilityData[this.currentCapabilityIndex];
    },
    currentApplication() {
      return this.applicationData[this.currentApplicationIndex];
    },
    currentQualificationData() {
      return this.currentQualificationTabIndex === 0 ? this.qualificationData : this.leadershipData;
    },
    canPrev() {
    return this.currentNewsIndex > 0;
    },
    canNext() {
      return this.currentNewsIndex < this.newsData.length - this.visibleItems;
    }
  },
  methods: {
    // Banner轮播恢复辅助方法
    resumeBannerAutoplay() {
      this.bannerShouldAutoplay = true;
      this.startBannerAutoplay();
    },
    
    // 核心能力轮播恢复辅助方法
    resumeCapabilityAutoplay() {
      this.capabilityShouldAutoplay = true;
      this.startCapabilityAutoplay();
    },
    
    // 场景应用轮播恢复辅助方法
    resumeApplicationAutoplay() {
      this.applicationShouldAutoplay = true;
      this.startApplicationAutoplay();
    },
    
    // 新闻轮播恢复辅助方法
    resumeNewsAutoplay() {
      this.newsShouldAutoplay = true;
      this.startNewsAutoplay();
    },
    
    setCurrentBanner(index) {
      this.currentBannerIndex = index;
      // 点击时停止自动轮播
      this.stopBannerAutoplay();
      this.bannerShouldAutoplay = false;
      // 然后在20秒后恢复自动轮播
      setTimeout(() => {
        this.resumeBannerAutoplay();
      }, 20000);
    },
    nextBanner() {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.bannerData.length;
    },
    startBannerAutoplay() {
      // 检查是否应该启动轮播
      if (!this.bannerShouldAutoplay) return;
      
      // 清除可能存在的定时器以防重复
      if (this.bannerAutoplayInterval) {
        clearInterval(this.bannerAutoplayInterval);
      }
      this.bannerAutoplayInterval = setInterval(() => {
        this.nextBanner();
      }, 3000); 
    },
    stopBannerAutoplay() {
      if (this.bannerAutoplayInterval) {
        clearInterval(this.bannerAutoplayInterval);
        this.bannerAutoplayInterval = null;
      }
    },
    calculateVisibleItems() {
      if (!this.newsContainer) return;
      
      const itemWidth = 300 + 50; // 300px宽 + 50px间距
      this.visibleItems = Math.floor(this.newsContainer.offsetWidth / itemWidth);
      // 只在初始化时执行一次，确保默认只显示3个完整的卡片
      if (!this.initialized && this.visibleItems > 0) {
        this.visibleItems = 3; // 固定显示3个卡片
        this.initialized = true;
      }
    },
    prevNews() {
      if (!this.canPrev) return;
      if (this.currentNewsIndex === 0) {
        this.currentNewsIndex = this.newsData.length - this.visibleItems;
      } else {
        this.currentNewsIndex--;
      }
      // 暂停自动轮播
      this.stopNewsAutoplay();
      this.newsShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeNewsAutoplay();
      }, 20000);
    },
    nextNews() {
      if (!this.canNext) return;
      if (this.currentNewsIndex >= this.newsData.length - this.visibleItems) {
        this.currentNewsIndex = 0;
      } else {
        this.currentNewsIndex++;
      }
      // 暂停自动轮播
      this.stopNewsAutoplay();
      this.newsShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeNewsAutoplay();
      }, 20000);
    },
    startNewsAutoplay() {
      // 检查是否应该启动轮播
      if (!this.newsShouldAutoplay) return;
      
      // 清除可能存在的定时器以防重复
      if (this.newsAutoplayInterval) {
        clearInterval(this.newsAutoplayInterval);
      }
      this.newsAutoplayInterval = setInterval(() => {
        if (this.canNext) {
          this.nextNews();
        } else {
          this.currentNewsIndex = 0;
        }
      }, 4500); 
    },
    stopNewsAutoplay() {
      if (this.newsAutoplayInterval) {
        clearInterval(this.newsAutoplayInterval);
        this.newsAutoplayInterval = null;
      }
    },
    prevCapability() {
      this.currentCapabilityIndex = (this.currentCapabilityIndex - 1 + this.capabilityData.length) % this.capabilityData.length;
      // 暂停自动轮播
      this.stopCapabilityAutoplay();
      this.capabilityShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeCapabilityAutoplay();
      }, 20000);
    },
    nextCapability() {
      this.currentCapabilityIndex = (this.currentCapabilityIndex + 1) % this.capabilityData.length;
      // 暂停自动轮播
      this.stopCapabilityAutoplay();
      this.capabilityShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeCapabilityAutoplay();
      }, 20000);
    },
    startCapabilityAutoplay() {
      // 检查是否应该启动轮播
      if (!this.capabilityShouldAutoplay) return;
      
      // 清除可能存在的定时器以防重复
      if (this.capabilityAutoplayInterval) {
        clearInterval(this.capabilityAutoplayInterval);
      }
      this.capabilityAutoplayInterval = setInterval(() => {
        this.nextCapability();
      }, 3500); 
    },
    stopCapabilityAutoplay() {
      if (this.capabilityAutoplayInterval) {
        clearInterval(this.capabilityAutoplayInterval);
        this.capabilityAutoplayInterval = null;
      }
    },
    setCurrentCapability(index) {
      this.currentCapabilityIndex = index;
      // 暂停自动轮播
      this.stopCapabilityAutoplay();
      this.capabilityShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeCapabilityAutoplay();
      }, 20000);
    },
    setCurrentApplication(index) {
      this.currentApplicationIndex = index;
      // 暂停自动轮播
      this.stopApplicationAutoplay();
      this.applicationShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeApplicationAutoplay();
      }, 20000);
    },
    prevApplication() {
      this.currentApplicationIndex = (this.currentApplicationIndex - 1 + this.applicationData.length) % this.applicationData.length;
      // 暂停自动轮播
      this.stopApplicationAutoplay();
      this.applicationShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeApplicationAutoplay();
      }, 20000);
    },
    nextApplication() {
      this.currentApplicationIndex = (this.currentApplicationIndex + 1) % this.applicationData.length;
      // 暂停自动轮播
      this.stopApplicationAutoplay();
      this.applicationShouldAutoplay = false;
      // 20秒后恢复
      setTimeout(() => {
        this.resumeApplicationAutoplay();
      }, 20000);
    },
    startApplicationAutoplay() {
      // 检查是否应该启动轮播
      if (!this.applicationShouldAutoplay) return;
      
      // 清除可能存在的定时器以防重复
      if (this.applicationAutoplayInterval) {
        clearInterval(this.applicationAutoplayInterval);
      }
      this.applicationAutoplayInterval = setInterval(() => {
        this.nextApplication();
      }, 4000);
    },
    stopApplicationAutoplay() {
      if (this.applicationAutoplayInterval) {
        clearInterval(this.applicationAutoplayInterval);
        this.applicationAutoplayInterval = null;
      }
    },
    openNewsLink(item) {
      if (item.link) {
        try {
          // 使用 _blank 在新标签页中打开链接
          const newWindow = window.open(item.link, '_blank');
          
          // 如果浏览器阻止了弹出窗口，newWindow 将为 null
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            console.warn('弹出窗口被阻止，请检查浏览器设置');
            // 可以在这里添加一个提示，告诉用户允许弹出窗口
          }
        } catch (error) {
          console.error('打开链接时出错:', error);
        }
      } else {
        console.info('该新闻项目没有关联链接');
      }
    },
    setQualificationTab(index) {
      this.currentQualificationTabIndex = index;
    }
  },
  mounted() {
    // 初始化自动轮播,确保状态一致性
    this.bannerShouldAutoplay = true;
    this.capabilityShouldAutoplay = true;
    this.applicationShouldAutoplay = true;
    this.newsShouldAutoplay = true;
    
    // 每个轮播的初始启动
    this.startBannerAutoplay();
    this.startCapabilityAutoplay();
    this.startApplicationAutoplay();
    this.startNewsAutoplay();
    
    // 设置容器引用
    this.$nextTick(() => {
      this.newsContainer = document.querySelector('.news-items');
      this.calculateVisibleItems();
    });
    
    window.addEventListener('resize', this.calculateVisibleItems);
  },
  beforeDestroy() {
    // 清除所有轮播定时器和标志
    this.stopBannerAutoplay();
    this.stopCapabilityAutoplay();
    this.stopApplicationAutoplay();
    this.stopNewsAutoplay();
    
    // 清除标志位
    this.bannerShouldAutoplay = false;
    this.capabilityShouldAutoplay = false;
    this.applicationShouldAutoplay = false;
    this.newsShouldAutoplay = false;
    
    window.removeEventListener('resize', this.calculateVisibleItems);
  },
}
</script>

<style scoped>
.core-capability-page {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #eef2f7;
  color: #333;
}

/* 通用样式 */
.section-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
  position: relative;
  padding-bottom: 15px;
  display: inline-block;
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

.section-subtitle {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 40px;
}

section {
  padding: 60px 0 0;
  position: relative;
  background-color: #eef2f7;
}

/* section:nth-child(odd) {
  background-color: #fff;
}

section:nth-child(even) {
  background-color: #eef2f7;
}
 */
/* Banner样式 */
.banner-section {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  padding: 0;
}

.banner-carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-slides {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.8s ease;
}

.banner-slide {
  position: relative;
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.banner-content {
  position: relative;
  color: white;
  z-index: 2;
  padding: 0 20px;
  max-width: 600px;
  margin-left: 10%;
}

.banner-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0,0,0,0.3), transparent);
  z-index: 1;
}

.banner-title {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
  color: #ffffff;
}

.banner-title h1 {
  margin: 0;
  padding: 0;
  line-height: 1.2;
  font-size: 36px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.banner-content h2 {
  font-size: 20px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.banner-content p {
  font-size: 16px;
  line-height: 1.6;
  margin-top: 15px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 60px;
}

.icon {
  width: 60px;
  height: 60px;
  display: block;
  border-radius: 50%;
  object-fit: contain;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.banner-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.banner-indicators span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-indicators span:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.banner-indicators span.active {
  background-color: white;
  width: 30px;
  border-radius: 6px;
}

.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}

/* 核心能力样式 */
.capability-section {
  text-align: center;
}

.capability-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.capability-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  max-width: 90%;
}

.capability-card {
  text-align: center;
  padding: 20px 15px;
  width: 210px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.capability-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.capability-card.active {
  background-color: #4a6bff;
  box-shadow: 0 8px 20px rgba(74, 107, 255, 0.3);
  color: white;
}

.card-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.capability-card.active .card-icon {
  background-color: white;
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.card-icon img {
  max-width: 80%;
  max-height: 80%;
}

.capability-card h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 0;
  transition: color 0.3s ease;
}

.capability-detail {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  background-color: white;
  border-radius: 16px;
  margin-top: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.8s ease;
  overflow: hidden;
  min-height: 350px;
  height: 400px;
}

.detail-left {
  width: 45%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-right {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
  /*box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);*/
  height: 350px;
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.detail-image:hover {
  transform: scale(1.03);
}

.detail-description {
  text-align: left;
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  max-height: 320px;
  overflow-y: auto;
}

.detail-description::-webkit-scrollbar,
.application-detail .detail-description::-webkit-scrollbar {
  width: 6px;
}

.detail-description::-webkit-scrollbar-track,
.application-detail .detail-description::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.detail-description::-webkit-scrollbar-thumb,
.application-detail .detail-description::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.detail-description::-webkit-scrollbar-thumb:hover,
.application-detail .detail-description::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 场景应用样式 */
.application-section {
  text-align: center;
}

.application-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 40px; */
}

.carousel-nav {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 15px;
  color: #4a6bff;
  font-weight: bold;
  font-size: 20px;
  z-index: 2;
}

.carousel-nav:hover {
  background-color: #4a6bff;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(74, 107, 255, 0.3);
}

.application-items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 20px;
  max-width: 90%;
  padding-top: 15px;
}

.application-item {
  min-width: 120px;
  text-align: center;
  padding: 20px 15px;
  width: 160px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-top: 8px;
}

.application-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.application-item.active {
  background-color: #4a6bff;
  box-shadow: 0 8px 20px rgba(74, 107, 255, 0.3);
  color: white;
}

.item-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.application-item.active .item-icon {
  background-color: white;
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.item-icon img {
  max-width: 80%;
  max-height: 80%;
}

.application-item h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 0;
  transition: color 0.3s ease;
}

.application-detail {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  background-color: white;
  border-radius: 16px;
  margin-top: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.8s ease;
  overflow: hidden;
  min-height: 350px;
  height: 450px;
  align-items: center;
}

.application-detail .detail-left {
  padding: 0;
  width: 40%;
  display: flex;
  flex-direction: column;
}

.application-detail .detail-left h3 {
  font-size: 22px;
  margin-bottom: 25px;
  white-space: pre-line;
  line-height: 1.5;
  color: #333;
}

.application-detail .detail-description {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-line;
  color: #555;
  max-height: 350px;
  overflow-y: auto;
  flex: 1;
}

.application-detail .detail-right {
  width: 55%;
  min-height: 300px;
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  /*box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);*/
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: auto 0;
}

.detail-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
}

.qa-demo {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  height: 100%;
}

.qa-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.qa-icon {
  min-width: 36px;
  height: 36px;
  background-color: #4a6bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 15px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(74, 107, 255, 0.3);
}

/* 新闻与活动样式 */
.news-section {
  text-align: center;
}

.news-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto 0;
}

/* 控制箭头 */
.news-nav {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin: 0 15px;
  transition: all 0.3s ease;
  color: #4a6bff;
  font-weight: bold;
  font-size: 20px;
  z-index: 2;
}

.news-nav:hover {
  background-color: #4a6bff;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(74, 107, 255, 0.3);
}

.news-nav.disabled{
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.news-items {
  display: flex;
  overflow: hidden;
  gap: 30px;
  padding: 10px 0;
  margin: 0 auto;
  position: relative;
  width: 80%;
  height: 320px;
  flex: 1;
}

.news-items-container {
  display: flex;
  gap: 30px;
  transition: transform 0.8s ease;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 15px;
}

.news-item {
  width: 300px;
  min-width: 300px;
  flex: 0 0 300px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.news-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.news-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.news-item:hover .news-image img {
  transform: scale(1.1);
}

.news-item h3 {
  padding: 15px 20px 10px;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px 15px;
}

.news-link-hint {
  color: #4a6bff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.news-item:hover .news-link-hint {
  transform: translateX(5px);
}

/* 资质与行业引领样式 */
.qualification-section {
  padding: 60px 0 0;
  text-align: center;
}

.qualification-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.tab {
  padding: 12px 30px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 50px;
  border: none;
  background-color: white;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  color: #555;
}

.tab:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.tab.active {
  background-color: #4a6bff;
  color: white;
  box-shadow: 0 8px 20px rgba(74, 107, 255, 0.3);
}

.qualification-content {
  position: relative;
  width: 90%;
  margin: 0 auto;
}

.qualification-items {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  padding: 20px;
}

.qualification-item {
  width: 200px;
  text-align: center;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.qualification-item:hover {
  transform: translateY(-10px);
}

.qualification-item p {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  margin-top: 15px;
  color: #444;
}

.qualification-image {
  width: 100%;
  height: 130px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.qualification-image:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.qualification-image img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

/* 响应式调整 */
@media (max-width: 768px) {
  /* 隐藏左右切换箭头 */
  .capability-carousel .carousel-nav,
  .application-carousel .carousel-nav,
  .news-carousel .news-nav {
    display: none !important;
  }

  /* 去掉 active 高亮 */
  .capability-card.active, .capability-card:hover {
    background-color: white !important;
    color: #333 !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    transform: none !important;
  }

  .application-item.active, .application-item:hover {
    background-color: white !important;
    color: #333 !important;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
    transform: none !important;
  }

  .capability-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 15px;
  }

  .capability-card {
    flex: 1 1 45%;
    max-width: 45%;
  }

  .application-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 15px;
    padding: 10px 0;
  }
  .application-item {
    flex: 1 1 45%;
    max-width: 45%;
  }

  .news-items {
    overflow: visible;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0;
    margin: 0 auto;
    width: 100%;
    height: auto;
  }
  .news-items-container {
    transform: none !important;
    position: static !important;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px;
    padding: 0;
  }
  .news-item {
    flex: 1 1 100%;
    max-width: 100%;
    margin-bottom: 20px;
    height: auto;
  }

  .news-image {
    height: 180px;
  }


  .capability-card, .application-item {
    width: 160px;
  }
  
  .capability-detail, .application-detail {
    flex-direction: column;
    padding: 20px;
    height: auto;
    min-height: 500px;
  }
  
  .detail-left, .detail-right, 
  .application-detail .detail-left, 
  .application-detail .detail-right {
    width: 100%;
    height: auto;
  }
  
  .detail-right {
    margin-top: 20px;
    height: 250px;
  }
  
  .application-detail .detail-right {
    height: 250px;
  }
  
  .detail-description,
  .application-detail .detail-description {
    max-height: 220px;
  }
  
  .news-items {
    width: 70%;
  }
  
  .qualification-item {
    flex: 1 1 45%;
    max-width: 45%;
  }
  
  .banner-title {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    margin: 10px 0;
  }
  
  .banner-content {
    margin-left: 5%;
  }
  
  .banner-title h1 {
    font-size: 26px;
  }
}
</style> 