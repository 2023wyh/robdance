// pages/user/phoneLogin/phoneLogin.js
const app = getApp(); // 【新增】

Page({
	data: {
		theme: 'light', // 【新增】主题变量
		height: 400
	},
	onLoad(options) {
		const that = this;
		wx.getSystemInfo({
			success(res) {
				that.setData({
					height: res.screenHeight
				})
			}
		})
	},
	// 【新增】同步全局主题状态
	onShow() {
		this.setData({
			theme: app.globalData.theme || 'light'
		});
	},
	login() {
		wx.showToast({
			title: '成功',
		})
	}
})