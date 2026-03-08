//app.js
App({
	onLaunch: function () {
    // 【新增】夜间模式初始化
    const savedTheme = wx.getStorageSync('theme') || 'light';
    this.globalData.theme = savedTheme;

		// 获取用户信息 (保留原有逻辑)
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					wx.getUserInfo({
						success: res => {
							this.globalData.userInfo = res.userInfo
							this.globalData.login = false
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
	globalData: {
		userInfo: null,
    theme: 'light' // 【新增】默认主题
	}
})