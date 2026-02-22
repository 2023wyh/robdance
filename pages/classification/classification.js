// pages/classification/classification.js
const app = getApp() // 【新增】获取应用实例
const { ificationContent } = require('../../utils/data.js')

Page({
  data: {
    theme: 'light', // 【新增】
    activeIndex: 0,
    VerticalNavTop: 0,
    TabCur: 0,
    ificationTitle: [
      { title: "有声书" }, { title: "畅销书" }, { title: "儿童" },
      { title: "相声评书" }, { title: "情感生活" }, { title: "人文" },
      { title: "历史" }, { title: "国学书院" }, { title: "音乐" },
      { title: "英语" }, { title: "教育培训" }, { title: "健康养生" },
      { title: "广播剧" }, { title: "戏曲" }
    ],
    ificationContent: ificationContent
  },

  onLoad() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        const height = (res.windowHeight * 2);
        that.setData({
          phoneHeight: height,
        })
      }
    })
  },

  // 【新增】同步主题和 TabBar 状态
  onShow() {
    this.setData({
      theme: app.globalData.theme
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1, // 分类页对应的索引是 1
        theme: app.globalData.theme
      })
    }
  },

  showActive(e) {
    const index = parseInt(e.detail.scrollTop / 116);
    this.setData({
      activeIndex: index
    })
  },

  change(e) {
    const { index, id } = e.currentTarget.dataset
    this.setData({
      VerticalNavTop: (index - 1) * 50,
      activeIndex: index,
      TabCur: id,
    })
  },
})