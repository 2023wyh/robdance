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
		navList: [
			{ icon: '/image/nav-icon/bangdan.png', events: 'goToBangDan', text: '榜单' },
			{ icon: '/image/nav-icon/gushi.png', events: 'gotoDetails', text: '看剧目' },
			{ icon: '/image/nav-icon/diantai.png', events: 'gotoDetails', text: '学舞蹈' },
			{ icon: '/image/nav-icon/xiaoshuo.png', events: 'goToPose', text: '姿态识别' }
		],
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

	// 补充之前丢失的方法
	goToBangDan: function() {
		wx.navigateTo({
			url: '/pages/index/bangdan/bangdan'
		})
	},
	gotoMore: function() {
		wx.switchTab({
			url: '/pages/classification/classification'
		});
	},
	gotoDetails: function(e) {
		const url = e.currentTarget.dataset.coverimg || '';
		const title = e.currentTarget.dataset.title || '';
		wx.navigateTo({
			url: '/pages/details/details?url=' + url + '&title=' + title
		})
	},
	goToPose: function() {
		wx.navigateTo({
			url: '/pages/pose/pose'
		})
	},
	swiperChange: function (e) {
		this.setData({ swiperCurrent: e.detail.current })
	},
	// ...
})