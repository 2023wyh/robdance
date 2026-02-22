// pages/index/bangdan/bangdan.js
const app = getApp() // 【新增】
let myRequest = require('../../../api/index.js')
let resut;

Page({
	data: {
		theme: 'light', // 【新增】
		showCover: false,
		currentTab: 0,
		navTitle: [
			{ title: '经典必听' },
			{ title: '优质专辑' },
			{ title: '有声小说' },
			{ title: '儿童教育' },
			{ title: '人文历史' },
			{ title: '最潮外语' },
			{ title: '商业财经' },
			{ title: '热门新闻' }
		],
		list: [] // 初始化一下 list
	},

	onLoad: function (options) {
		let that = this;
		myRequest.getData().then(res => {
			resut = res;
			that.setData({
				list: res.data.hotRecommends.list[0].list
			})
		})
	},

	// 【新增】同步主题
	onShow: function () {
		this.setData({
			theme: app.globalData.theme
		})
	},

	// 原有逻辑保持不变...
	handleClick(e) {
		let currentTab = e.currentTarget.dataset.index;
		this.setData({
			currentTab,
			list: resut.data.hotRecommends.list[currentTab].list
		})
	},
	pullDown: function () {
		this.setData({ showCover: true })
	},
	closeCover: function () {
		this.setData({ showCover: false })
	},
	coverCheck: function (e) {
		let currentTab = e.currentTarget.dataset.index;
		this.setData({
			currentTab,
			list: resut.data.hotRecommends.list[currentTab].list
		})
		this.closeCover()
	}
})