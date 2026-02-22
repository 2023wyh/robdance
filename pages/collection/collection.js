// pages/collection/collection.js
const app = getApp()

Page({
  data: {
    theme: 'light', // 【新增】主题
    currentIndex: 0,
    height: 0,
    login: false,
    content: [
      { text: "我的收藏" },
      { text: "我的已购" },
      { text: "收听历史" },
      { text: "我的礼包" }
    ]
  },

  onLoad() {
    const that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
  },

  onShow() {
    const that = this
    // 【新增】同步主题和 TabBar 状态
    this.setData({
      theme: app.globalData.theme
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2, // 收藏页对应的索引是 2
        theme: app.globalData.theme
      })
    }

    // 原有登录检查逻辑
    if (!that.data.login) {
      wx.getStorage({
        key: 'userinfo',
        success(res) {
          that.setData({
            login: res.data ? true : false,
          })
        }
      })
    }
  },

  // 点击获取头像和昵称 (建议保留原有逻辑，仅适配样式)
  bindGetUserInfo(e) {
    const that = this;
    // 注意：wx.getUserInfo 在新版本中已受限，但这不影响主题修改
    wx.getUserInfo({
      success: function (res) {
        wx.setStorage({
          key: "userinfo",
          data: JSON.stringify(res.userInfo)
        })
        that.setData({
          login: true
        })
      }
    })
  },

  checkItem(e) {
    if (this.data.currentIndex === e.target.dataset.index) {
      return false;
    } else {
      this.setData({
        currentIndex: e.target.dataset.index
      })
    }
  },

  changeTab(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  }
})