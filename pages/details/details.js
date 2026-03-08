// pages/details/details.js
const app = getApp(); // 【新增】获取实例

Page({
	data: {
		theme: 'light', // 【新增】
		performance: [
			{ name: "《人在江湖》郭德纲 于谦", year: "2年前", count: "5601.9万", time: "34:36" },
			// ... 保持原有数据
		],
		performanceInfo: [],
		imgurl: ''
	},

	onLoad(options) {
		// 原有逻辑保持不变
		this.setData({
			performanceInfo: [{
				imgurl: options.url + '=5&upload_type=album&device_type=ios&name=medium&magick=png',
				title: options.title,
				author: "某某某",
				num1: "767.6万",
				num2: "257"
			}],
			imgurl: options.url + '=5&upload_type=album&device_type=ios&name=medium&magick=png',
		});
	},

	// 【新增】同步主题
	onShow() {
		this.setData({
			theme: app.globalData.theme || 'light'
		})
	}
})