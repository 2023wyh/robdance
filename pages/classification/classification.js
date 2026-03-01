Page({
  data: {
    // 顶部tab（最后一个为"舞种"展示页/入口）
    tabs: [
      { name: "会员专区", type: "vip" },
      { name: "视频课", type: "video" },
      { name: "直播课", type: "live" },
      { name: "线下课", type: "offline" },
      { name: "舞种", type: "dance" }
    ],
    currentTab: "vip",

    // 可选：页面中用于控制滚动高度的 rpx 值，onLoad 会动态覆盖
    phoneHeight: 1334,

    // 当前显示的课程列表
    courseList: [],

    // 可选舞种筛选器（会在页面中横向展示）
    danceStyles: [
      "猫蝶富贵", "中国舞", "民间舞", "芭蕾", "街舞", "汉族民俗", "地方民间"
    ],
    selectedDanceStyle: "",

    // 搜索关键字
    keyword: ""
  },

  onLoad() {
    // 1) 动态计算 phoneHeight（rpx）以保证布局兼容
    try {
      const sys = wx.getSystemInfoSync();
      const phoneHeight = Math.floor(sys.windowHeight * 750 / sys.windowWidth);
      this.setData({ phoneHeight });
    } catch (err) {
      console.warn("getSystemInfoSync failed, keep default phoneHeight", err);
    }

    // 2) THEME & 数据源（把下面 themeData 替换为真实内容 / 接口结果）
    //    我已根据你提供的项目主题准备了示例课程项（包含 AI/3D/可穿戴 信息）
    this.THEME = "luanjing-core"; // 你可以改为其他主题 key

    this.themeData = {
      // 样例主题：鸾镜顾影 / 非遗舞蹈数字化学习
      "luanjing-core": {
        vip: [
          {
            id: 1001,
            title: "猫蝶富贵 — 非遗独舞精粹（会员专享）",
            danceStyle: "猫蝶富贵",
            category: "视频课",
            price: "会员免费",
            cover: "/image/course/mdfg_cover1.jpg",
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
            cover: "/image/course/3d_archive.jpg",
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
          // 舞种页：可以列出每个舞种的代表课程或介绍
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

    // 3) 初始加载 currentTab 对应的数据
    this.loadCourses(this.data.currentTab);
  },

  // 切 tab
  switchTab(e) {
    const type = e.currentTarget.dataset.type;
    if (!type) return;
    this.setData({ currentTab: type, selectedDanceStyle: "" }, () => {
      this.loadCourses(type);
    });
  },

  // 选择舞种（横向筛选条）
  selectDanceStyle(e) {
    const style = e.currentTarget.dataset.style || "";
    // 切换选中状态：再次点同一舞种清除筛选
    const next = (this.data.selectedDanceStyle === style) ? "" : style;
    this.setData({ selectedDanceStyle: next }, () => {
      // 重新过滤当前 tab 列表
      this.applyFilters();
    });
  },

  // 基础加载：读取 themeData 中对应 tab 的数组
  loadCourses(type) {
    const theme = this.THEME || "luanjing-core";
    const map = (this.themeData[theme] && this.themeData[theme][type]) ? this.themeData[theme][type] : [];
    // 直接设置（后续会走 applyFilters 进行舞种/关键字过滤）
    this._rawList = Array.isArray(map) ? map.slice() : [];
    this.applyFilters();
  },

  // 统一把 selectedDanceStyle / keyword 应用到 _rawList，得到 courseList
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

  // 搜索回调：如果你的 <search> 组件会触发自定义事件，请把关键字传到这里
  onSearch(e) {
    const kw = e.detail && e.detail.value ? e.detail.value : "";
    this.setData({ keyword: kw }, () => this.applyFilters());
  },

  // 点击卡片：跳详情或播放（这里默认跳详情）
  openCourseDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    // 建议 details 页面通过接口或本地缓存获取完整课程信息。
    wx.navigateTo({ url: `/pages/details/details?id=${id}` });
  },

  // 如果需要内嵌播放（不跳详情），可以增加 playInline(e) 方法，在课程卡中绑定
  playInline(e) {
    // 示例：打开一个 video 组件或弹窗播放。实现留给你选择
  }
});
