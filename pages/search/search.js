// pages/search/search.js
const app = getApp(); // 【新增】

Page({
	data: {
		theme: 'light', // 【新增】
		searchHistory: [],
		hotData: [
			{ title: "宝宝巴士", icon: "icon-jiantouUp", color: "text-orange" },
			{ title: "孟鹤堂", icon: "icon-jiantouUp", color: "text-red" },
			{ title: "三体", icon: "icon-jiantouDown", color: "text-green" },
			{ title: "龙王殿", icon: "icon-jiantouUp", color: "text-red" },
			{ title: "儿童恐龙故事", icon: "icon-jiantouDown", color: "text-red" },
			{ title: "儿童版三国演义", icon: "icon-jiantouUp", color: "text-red" },
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