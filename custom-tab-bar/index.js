Component({
  data: {
    selected: 0,
    theme: 'light',
    color: "#cdcdcd",
    selectedColor: "#ff520f",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/image/tabbar/home-icon.png",
        selectedIconPath: "/image/tabbar/home-selectIcon.png"
      },
      {
        pagePath: "/pages/classification/classification",
        text: "分类",
        iconPath: "/image/tabbar/fen-icon.png",
        selectedIconPath: "/image/tabbar/fen-selectIcon.png"
      },
      {
        pagePath: "/pages/collection/collection",
        text: "收藏",
        iconPath: "/image/tabbar/collection-icon.png",
        selectedIconPath: "/image/tabbar/collection-selectIcon.png"
      },
      {
        pagePath: "/pages/user/user",
        text: "我的",
        iconPath: "/image/tabbar/user-icon.png",
        selectedIconPath: "/image/tabbar/user-selectIcon.png"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
    }
  }
})