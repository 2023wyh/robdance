// pages/index/index.js
const app = getApp()
const myRequest = require('../../api/index.js');

Page({
	data: {
		theme: 'light', // 【新增】
		imgList: [
			'/image/swiper/ad1.jpg',
			// ... 其他图片
		],
		// ... 其他原有 data
		swiperCurrent: 0,
	},

	onLoad: function (options) {
		// 原有 onLoad 逻辑保持不变...
		const that = this
		myRequest.getData().then(res => {
			const { guess, hotRecommends } = res.data
			that.setData({
				showitem: true,
				guess: guess?.list?.slice(0, 3) || [],
				xiaoshuocontent: hotRecommends?.list?.[0]?.list || [],
				xiangshengcontent: hotRecommends?.list?.[2]?.list || [],
				tuokocontent: hotRecommends?.list?.[4]?.list || []
			})
		}).catch(err => {
			that.setData({ showitem: false })
		})
	},

	// 【新增/修改】重点：同步 TabBar 状态
	onShow: function () {
		this.setData({
			theme: app.globalData.theme
		})
		
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 0, // 首页对应的索引是 0
				theme: app.globalData.theme
			})
		}
	},

	// 原有方法保持不变 (swiperChange, goToBangDan, gotoDetails, onShareAppMessage 等)
	swiperChange: function (e) {
		this.setData({ swiperCurrent: e.detail.current })
	},
	// ...
})