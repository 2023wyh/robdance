Page({
  data: {
    mediaPath: '',
    mediaType: '', // 'image' 或 'video'
    recognizeResult: null,
    isRecognizing: false
  },

  onLoad(options) {
    // 页面加载时的逻辑
  },

  // 选择图片或视频
  chooseMedia() {
    wx.chooseMedia({
      count: 1, // 只能选择一个媒体
      mediaType: ['image', 'video'], // 允许选图或视频
      sourceType: ['album', 'camera'], // 允许相册或相机拍摄
      success: (res) => {
        const tempFile = res.tempFiles[0];
        const type = tempFile.fileType || res.type; // 兼容不同版本字段
        
        this.setData({
          mediaPath: tempFile.tempFilePath,
          mediaType: type,
          recognizeResult: null // 重新选择后清空结果
        });
      },
      fail: (err) => {
        console.log('选择媒体失败', err);
      }
    });
  },

  // 开始识别
  startRecognize() {
    if (!this.data.mediaPath || this.data.isRecognizing) return;

    this.setData({ isRecognizing: true });
    wx.showLoading({
      title: '上传并请求AI...',
      mask: true
    });

    if (this.data.mediaType === 'image') {
      wx.uploadFile({
        // 若在手机真机预览，请把 127.0.0.1 替换为电脑真实的局域网 IPv4 地址
        url: 'http://127.0.0.1:5000/api/analyze_pose', 
        filePath: this.data.mediaPath,
        name: 'file',
        success: (res) => {
          wx.hideLoading();
          if (res.statusCode === 200) {
            const data = JSON.parse(res.data);
            this.setData({
              isRecognizing: false,
              recognizeResult: data
            }, () => {
              // 在画布上渲染真实检测出的大小数据点
              this.drawSkeleton(data.keypoints);
            });
            wx.showToast({ title: 'AI 分析完成', icon: 'success' });
          } else {
            this.setData({ isRecognizing: false });
            let errInfo = '识别失败';
            try {
              errInfo = JSON.parse(res.data).error || errInfo;
            }catch(e) {}
            wx.showToast({ title: errInfo, icon: 'none' });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          this.setData({ isRecognizing: false });
          wx.showToast({ title: '网络失败：请确认Python后台是否启动并在同一网络', icon: 'none' });
          console.error('上传检测失败', err);
        }
      });
    } else {
      wx.hideLoading();
      this.setData({ isRecognizing: false });
      wx.showToast({ title: '体验版本暂时仅支持图像端到端分析，视频敬请期待', icon: 'none', duration: 3000 });
    }
  },

  // 绘制骨架 (基于真实图片的 aspectFit 画布缩放支持)
  drawSkeleton(keypointData) {
    const query = wx.createSelectorQuery();
    query.select('#skeletonCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          console.warn('获取Canvas节点失败');
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio;

        // 设置画布实际大小
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        // 清空画布
        ctx.clearRect(0, 0, res[0].width, res[0].height);

        const { points, connections, originalWidth, originalHeight } = keypointData;
        
        // 我们利用微信小程序图片 aspectFit 模式的特性：图片会在短边方向居中对齐，维持原宽高比缩放。
        const containerW = res[0].width;
        const containerH = res[0].height;
        
        // 如果后端传回了原图高度，正常使用，否则兼容 Mock 兜底
        const ow = originalWidth || 300;
        const oh = originalHeight || 400;

        const scale = Math.min(containerW / ow, containerH / oh);
        
        // 计算居中的偏移量
        const offsetX = (containerW - ow * scale) / 2;
        const offsetY = (containerH - oh * scale) / 2;
        
        // 绘制连线
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(3, 227, 252, 0.8)';
        connections.forEach(conn => {
          const p1 = points.find(pt => pt.id === conn[0]);
          const p2 = points.find(pt => pt.id === conn[1]);
          // API传回来的时候可能某些点置信度比较低（身体出界），我们只画高置信度的点连线
          if (p1 && p2 && ('visibility' in p1 ? p1.visibility > 0.5 : true) && ('visibility' in p2 ? p2.visibility > 0.5 : true)) {
            ctx.beginPath();
            ctx.moveTo(p1.x * scale + offsetX, p1.y * scale + offsetY);
            ctx.lineTo(p2.x * scale + offsetX, p2.y * scale + offsetY);
            ctx.stroke();
          }
        });

        // 绘制点
        points.forEach(pt => {
          if ('visibility' in pt && pt.visibility < 0.5) return; // 隐藏低可信度的点

          const x = pt.x * scale + offsetX;
          const y = pt.y * scale + offsetY;

          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, 2 * Math.PI); // 圆点比例缩小
          ctx.fillStyle = '#ff520f';
          ctx.fill();
          
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#fff';
          ctx.stroke();
        });
      });
  }
});
