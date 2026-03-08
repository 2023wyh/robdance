// pages/classification/classification.js
const app = getApp(); // 【新增】获取全局应用实例

Page({
  data: {
    theme: 'light', // 【新增】主题变量
    tabs: [
      { name: "会员专区", type: "vip" },
      { name: "视频课", type: "video" },
      { name: "直播课", type: "live" },
      { name: "线下课", type: "offline" },
      { name: "舞种", type: "dance" }
    ],
    currentTab: "vip",
    phoneHeight: 1334, 
    courseList: [],
    danceStyles: [
      "猫蝶富贵", "中国舞", "民间舞", "芭蕾", "街舞", "汉族民俗", "地方民间"
    ],
    selectedDanceStyle: "",
    keyword: ""
  },

  onLoad() {
    // 动态计算 phoneHeight（rpx）
    try {
      const sys = wx.getSystemInfoSync();
      const phoneHeight = Math.floor(sys.windowHeight * 750 / sys.windowWidth);
      this.setData({ phoneHeight });
    } catch (err) {
      console.warn('getSystemInfoSync failed', err);
    }

    // THEME & 数据源
    this.THEME = "luanjing-core";
    this.themeData = {
      "luanjing-core": {
        vip: [
          {
            id: 1001,
            title: "猫蝶富贵 — 非遗独舞精粹（会员专享）",
            danceStyle: "猫蝶富贵",
            category: "视频课",
            price: "会员免费",
            cover: "/image/course/mdfg_vip1.jpg",
            video: "/video/mdfg_intro.mp4",
            model3D: "/3d/mdfg_model.glb",
            analysisAvailable: true,
            sensorsCompatible: ["WearBandX", "WearBandY"],
            tags: ["非遗","艺考","AI对比"]
          },
          {
            id: 1002,
            title: "非遗舞蹈数字编目与3D复原（会员）",
            danceStyle: "猫蝶富贵",
            category: "视频课",
            price: "会员免费",
            cover: "/image/course/mdfg_vip2.jpg",
            video: "/video/3d_archive.mp4",
            model3D: "/3d/archive_sample.glb",
            analysisAvailable: true,
            sensorsCompatible: [],
            tags: ["3D建模","文创"]
          }
        ],
        video: [
          {
            id: 2001,
            title: "猫蝶富贵技术分解：基本步法与上肢动作",
            danceStyle: "猫蝶富贵",
            category: "视频课",
            price: "¥49",
            cover: "/image/course/tech_step.jpg",
            video: "/video/mdfg_steps.mp4",
            analysisAvailable: true,
            sensorsCompatible: ["WearBandX"]
          },
          {
            id: 2002,
            title: "艺考组合训练：非遗独舞考级套路",
            danceStyle: "中国舞",
            category: "视频课",
            price: "¥99",
            cover: "/image/course/exam_prep.jpg",
            video: "/video/exam_prep.mp4",
            analysisAvailable: false,
            sensorsCompatible: []
          }
        ],
        live: [
          {
            id: 3001,
            title: "名家直播解析：猫蝶富贵舞段实时点评",
            danceStyle: "猫蝶富贵",
            category: "直播课",
            price: "免费/付费",
            cover: "/image/course/live_md.jpg",
            liveInfo: { startAt: "2026-03-01 20:00", zone: "北京时间" },
            analysisAvailable: true
          }
        ],
        offline: [
          {
            id: 4001,
            title: "线下研习营：非遗舞蹈复现与传承训练（北京）",
            danceStyle: "猫蝶富贵",
            category: "线下课",
            price: "¥880",
            cover: "/image/course/offline_camp.jpg",
            location: "北京市朝阳区文化站",
            date: "2026-04-10"
          }
        ],
        dance: [
          {
            id: 5001,
            title: "猫蝶富贵：舞种简介与历史价值",
            danceStyle: "猫蝶富贵",
            category: "舞种介绍",
            cover: "/image/course/dance_md_intro.jpg",
            intro: "猫蝶富贵为某地非遗独舞，融合…（可扩展）",
            tags: ["非遗","传承","文创"]
          },
          {
            id: 5002,
            title: "中国舞分类与教学路径（通史）",
            danceStyle: "中国舞",
            category: "舞种介绍",
            cover: "/image/course/dance_chinese.jpg",
            intro: "中国舞是…"
          }
        ]
      }
    };

    // 把所有课程集合（扁平化）缓存
    this._cacheAllCoursesToStorage();

    // 初始加载 currentTab
    this.loadCourses(this.data.currentTab);
  },

  // 【新增】页面显示时同步主题与 TabBar 状态
  onShow() {
    console.log("当前全局主题是：", app.globalData.theme); 
    this.setData({
      theme: app.globalData.theme || 'light'
    });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1, // 分类页面对应的索引是 1
        theme: app.globalData.theme || 'light'
      });
    }
  },

  _cacheAllCoursesToStorage() {
    const theme = this.THEME || 'luanjing-core';
    const obj = this.themeData[theme] || {};
    const all = [];
    Object.keys(obj).forEach(key => {
      const arr = Array.isArray(obj[key]) ? obj[key] : [];
      arr.forEach(item => all.push(item));
    });
    try {
      wx.setStorageSync('courseList', all);
    } catch (err) {
      console.warn('setStorageSync courseList failed', err);
    }
    this._allCourses = all; 
  },

  // 顶部tab切换
  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    if (!type) return;
    this.setData({ currentTab: type, selectedDanceStyle: "" }, () => {
      this.loadCourses(type);
    });
  },

  // 选择舞种
  selectDanceStyle(e) {
    const style = e.currentTarget.dataset.style || "";
    const next = (this.data.selectedDanceStyle === style) ? "" : style;
    this.setData({ selectedDanceStyle: next }, () => {
      this.applyFilters();
    });
  },

  // 搜索触发
  onSearch(e) {
    const kw = (e.detail && e.detail.value) ? e.detail.value : (e.detail || "");
    this.setData({ keyword: kw }, () => this.applyFilters());
  },

  // 加载指定类别
  loadCourses(type) {
    const theme = this.THEME || 'luanjing-core';
    const map = (this.themeData[theme] && this.themeData[theme][type]) ? this.themeData[theme][type] : [];
    this._rawList = Array.isArray(map) ? map.slice() : [];
    this.applyFilters();
  },

  // 应用舞种/关键字过滤器
  applyFilters() {
    const style = this.data.selectedDanceStyle;
    const kw = (this.data.keyword || "").trim().toLowerCase();
    let list = this._rawList || [];

    if (style) {
      list = list.filter(item => String(item.danceStyle || "").toLowerCase() === String(style || "").toLowerCase());
    }
    if (kw) {
      list = list.filter(item => (String(item.title || "").toLowerCase().includes(kw) || (item.tags || []).join(" ").toLowerCase().includes(kw)));
    }

    this.setData({ courseList: list });
  },

  // 点击卡片跳转
  openCourseDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    const item = (this._allCourses || []).find(i => String(i.id) === String(id));
    if (item) {
      try { wx.setStorageSync('selectedCourse', item); } catch (err) { /* ignore */ }
    }
    wx.navigateTo({ url: `/pages/details/details?id=${id}` });
  },

  playInline(e) {
    wx.showToast({ title: '内嵌播放未实现（可定制）', icon: 'none' });
  }
});