// pages/user/user.js
const app = getApp()

Page({
	data: {
		// 【新增】主题字段，默认从全局获取
		theme: 'light', 
		timeout: [
			{ text: "不开启" },
			{ text: "播放当前声音关闭" },
			{ text: "播放2首声音关闭" },
			{ text: "播放3首声音关闭" },
			{ text: "播放4首声音关闭" },
			{ text: "10分钟后" },
			{ text: "20分钟后" },
			{ text: "30分钟后" },
		],
		activeIndex: 0,
		login: false,
		avatarUrl: "",
		nickName: "",
		phoneHeight: 0,
		show: false // 确保 show 也在 data 中初始化
	},

	onLoad() {
		const that = this;
		// 【新增】初始化页面主题
		this.setData({
			theme: app.globalData.theme || 'light'
		});

		// 获得设备信息
		wx.getSystemInfo({
			success(res) {
				that.setData({
					phoneHeight: res.windowHeight,
				})
			}
		})
	},
	
	onShow() {
		const that = this;

		// 【新增】同步自定义 TabBar 的选中状态和主题
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selected: 3, // 对应 app.json 中 list 的索引，"我的"是第4个，所以是3
				theme: app.globalData.theme // 同步全局主题到 TabBar
			})
		}

		// 【原有逻辑】检查登录状态
		if (!that.data.login) {
			wx.getStorage({
				key: 'userinfo',
				success(res) {
					if (res.data) {
						const userinfo = JSON.parse(res.data)
						that.setData({
							login: true,
							avatarUrl: userinfo.avatarUrl,
							nickName: userinfo.nickName
						})
					}
				}
			})
		}
	},

	// 【新增核心】切换夜间模式开关
	toggleTheme(e) {
		const isDark = e.detail.value;
		const newTheme = isDark ? 'dark' : 'light';

		// 1. 更新当前页面的主题变量（控制 wxml 中的 page-wrapper 类名）
		this.setData({ theme: newTheme });

		// 2. 更新全局变量，确保切换到其他 Tab 页面时也能识别
		app.globalData.theme = newTheme;

		// 3. 实时更新自定义 TabBar 组件的主题
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				theme: newTheme
			});
		}

		// 4. 持久化存储，下次冷启动时依然生效
		wx.setStorageSync('theme', newTheme);
	},

	// 【步骤1核心】获取用户头像临时路径
	onChooseAvatar(e) {
		const { avatarUrl } = e.detail;
		this.setData({
			avatarUrl: avatarUrl
		});
		
		if (this.data.login) {
			this.updateUserInfoCache();
		}
	},

	// 【步骤2核心】表单提交，执行登录逻辑
	onSubmitLogin(e) {
		const nickName = e.detail.value.nickname; 
		const avatarUrl = this.data.avatarUrl;

		if (!avatarUrl) {
			wx.showToast({ title: '请先点击上方获取头像', icon: 'none' });
			return;
		}
		if (!nickName) {
			wx.showToast({ title: '请点击输入框获取昵称', icon: 'none' });
			return;
		}

		const userInfo = {
			avatarUrl: avatarUrl,
			nickName: nickName
		}
		wx.setStorage({
			key: "userinfo",
			data: JSON.stringify(userInfo)
		})
		
		this.setData({
			login: true,
			nickName: nickName
		})
	},

	updateUserInfoCache() {
		const userInfo = {
			avatarUrl: this.data.avatarUrl,
			nickName: this.data.nickName
		};
		wx.setStorage({
			key: "userinfo",
			data: JSON.stringify(userInfo)
		});
	},

	phoneLogin() {
		wx.navigateTo({
			url: './phoneLogin/phoneLogin',
		});
	},

	gotoLogin() {
		this.setData({
			login: false,
			avatarUrl: '',
			nickName: ''
		})
		wx.removeStorage({ key: 'userinfo' })
	},

	openSwitch() {
		this.setData({ show: true })
	},

	close() {
		this.setData({ show: false })
	},

	chooseTimeOut(e) {
		this.setData({
			activeIndex: e.currentTarget.dataset.activeindex
		})
	}
})