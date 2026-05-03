Component({
	options: {
		addGlobalClass: true
	},
	properties: {
		title: {
			type: String,
			value: ''
		},
		showList: {
			type: Array,
			value: () => []
		}
	},
	methods: {
		gotoDetails(e) {
      const url = e.currentTarget.dataset.coverimg;
      const title = e.currentTarget.dataset.title;
      wx.navigateTo({
        // 页面传参
        url: '/pages/details/details?url=' + url + '&title=' + title,
      })
    },
		gotoMore() {
			wx.switchTab({
				url: '/pages/classification/classification'
			});
		}
	},
});