var dataSource = require("../../data/post-data.js");
// 导入脚本文件只能用相对路径?

Page({
    data: {

    },
    detailTap: function(e){
        var postId = e.currentTarget.dataset.postid;
        wx.navigateTo({
          url: '/pages/post-detail/post-detail?id='+postId
        })
    },
    onLoad: function (options) {
        // 此处也可以使用 
        // this.data.post_data = dataSource.postDataList
        this.setData({
            post_data: dataSource.postDataList
        });
    },
    onSwiperTab: function(event){
        var postId = event.target.dataset.postId;
        wx.navigateTo({
          url: '/pages/post-detail/post-detail?id=' + postId
          
        })

    }
})