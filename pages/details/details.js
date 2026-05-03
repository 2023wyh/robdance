// pages/details/details.js
const app = getApp(); // 【新增】获取实例

Page({
	data: {
		theme: 'light', // 【新增】
		performance: [],
		performanceInfo: [],
		imgurl: ''
	},

	onLoad(options) {
		const title = options.title && options.title !== 'undefined' ? options.title : "经典舞蹈剧目";
		const fallbackImg = "/image/course/mdfg_vip1.jpg";
		const imageUrl = options.url && options.url !== 'undefined' && options.url !== '' ? options.url : fallbackImg;
		
		let dynamicPerformance = [];
		if (title.includes("猫蝶富贵")) {
			dynamicPerformance = [
				{ name: "猫蝶富贵：非遗历史渊源", year: "2023", count: "10.2万", time: "15:20" },
				{ name: "动作精讲：上肢与下肢配合", year: "2023", count: "5.6万", time: "22:15" },
				{ name: "猫蝶富贵考级要点解析", year: "2024", count: "3.1万", time: "18:40" },
				{ name: "名家评价：情感与动作融合", year: "2024", count: "8.9万", time: "10:30" }
			];
		} else if (title.includes("古典") || title.includes("唐宫") || title.includes("青绿")) {
			dynamicPerformance = [
				{ name: "古典舞身韵入门", year: "2022", count: "15.8万", time: "45:00" },
				{ name: "气韵生动组合练习", year: "2023", count: "9.2万", time: "30:15" },
				{ name: "水袖技巧基础展示", year: "2023", count: "12.1万", time: "28:40" },
				{ name: "名家评价：中国古典舞发展", year: "2024", count: "6.5万", time: "20:10" }
			];
		} else if (title.includes("少儿") || title.includes("考级") || title.includes("基本功")) {
			dynamicPerformance = [
				{ name: "少儿基本功安全训练", year: "2023", count: "25.4万", time: "40:00" },
				{ name: "考级一级组合示范", year: "2023", count: "30.1万", time: "25:30" },
				{ name: "课堂趣味律动热身", year: "2024", count: "18.7万", time: "15:45" },
				{ name: "教师评价与打分标准", year: "2024", count: "11.2万", time: "12:20" }
			];
		} else {
			dynamicPerformance = [
				{ name: "舞蹈背景与历史脉络", year: "2023", count: "8.8万", time: "12:30" },
				{ name: "基础动作慢速拆解", year: "2023", count: "5.5万", time: "18:45" },
				{ name: "舞台演出实录", year: "2024", count: "12.3万", time: "05:50" },
				{ name: "专业舞者深度评价", year: "2024", count: "6.7万", time: "14:20" }
			];
		}

		this.setData({
			performanceInfo: [{
				imgurl: imageUrl,
				title: title,
				author: "国家级非遗传承人",
				num1: "12.5万",
				num2: dynamicPerformance.length
			}],
			performance: dynamicPerformance,
			imgurl: imageUrl,
		});
	},

	// 【新增】同步主题
	onShow() {
		this.setData({
			theme: app.globalData.theme || 'light'
		})
	}
})