// 拦截原来的喜马拉雅 API，返回猫蝶富贵及舞蹈相关的模拟数据
function getData() {
  return new Promise((resolve) => {
    resolve({
      data: {
        guess: {
          list: [
            { intro: "猫蝶富贵：非遗舞蹈完整呈现", coverMiddle: "/image/course/mdfg_vip1.jpg" },
            { intro: "古典舞身韵：气韵生动组合", coverMiddle: "/image/course/tech_step.jpg" },
            { intro: "少儿民族舞：欢腾的节日", coverMiddle: "/image/course/dance_md_intro.jpg" }
          ]
        },
        hotRecommends: {
          list: [
            { // 对应原来的 index 0 (现为：舞蹈剧目)
              list: [
                { title: "猫蝶富贵经典选段", trackTitle: "感受非遗魅力", tracks: 12, albumCoverUrl290: "/image/course/mdfg_vip1.jpg" },
                { title: "唐宫夜宴", trackTitle: "再现大唐盛世", tracks: 5, albumCoverUrl290: "/image/course/dance_chinese.jpg" },
                { title: "只此青绿", trackTitle: "宋代美学巅峰", tracks: 8, albumCoverUrl290: "/image/course/mdfg_vip2.jpg" }
              ]
            },
            { list: [] }, // index 1
            { // 对应原来的 index 2 (现为：分解动作)
              list: [
                { title: "猫蝶富贵步法精讲", trackTitle: "核心步伐训练", tracks: 20, albumCoverUrl290: "/image/course/tech_step.jpg" },
                { title: "古典舞手位大全", trackTitle: "基本功必备", tracks: 15, albumCoverUrl290: "/image/course/exam_prep.jpg" },
                { title: "毯子功技巧进阶", trackTitle: "高难度动作拆解", tracks: 10, albumCoverUrl290: "/image/course/live_md.jpg" }
              ]
            },
            { list: [] }, // index 3
            { // 对应原来的 index 4 (现为：非遗展示)
              list: [
                { title: "寻访猫蝶富贵", trackTitle: "背后的文化故事", tracks: 3, albumCoverUrl290: "/image/course/dance_md_intro.jpg" },
                { title: "英歌舞纪录片", trackTitle: "岭南文化瑰宝", tracks: 1, albumCoverUrl290: "/image/course/offline_camp.jpg" },
                { title: "苗族芦笙舞采集", trackTitle: "原生态舞蹈之美", tracks: 4, albumCoverUrl290: "/image/course/dance_chinese.jpg" }
              ]
            }
          ]
        }
      }
    });
  });
}

module.exports = {
  getData
}