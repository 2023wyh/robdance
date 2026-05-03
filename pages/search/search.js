// pages/search/search.js
const app = getApp(); // 【新增】

Page({
	data: {
		theme: 'light', // 【新增】
		searchHistory: [],
		hotData: [
			{ title: "猫蝶富贵", icon: "icon-jiantouUp", color: "text-red" },
			{ title: "古典舞身韵", icon: "icon-jiantouUp", color: "text-orange" },
			{ title: "少儿考级组合", icon: "icon-jiantouDown", color: "text-green" },
			{ title: "艺考舞蹈技巧", icon: "icon-jiantouUp", color: "text-red" },
			{ title: "桃李杯剧目", icon: "icon-jiantouDown", color: "text-red" },
			{ title: "非遗文化舞蹈", icon: "icon-jiantouUp", color: "text-red" },
		]
	},

	// 【新增】同步主题
	onShow() {
		this.setData({
			theme: app.globalData.theme || 'light'
		})
	},

	/**
	 * 搜索事件
	 */
	search(e){
		if(!e.detail.value.trim()) return;
		this.setData({
			searchHistory: [...new Set([e.detail.value, ...this.data.searchHistory])] // 去重并置顶
		})
	},

	/**
	 * 取消搜索事件
	 */
	cancelSearch(){
		wx.navigateBack({
			delta: 1,
		})
	},

	/**
	 * 清空历史记录
	 */
	clearHistory(){
		this.setData({
			searchHistory: []
		})
	}
})