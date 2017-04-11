var postDataSource = require('../../data/post-data.js');
var app = getApp();
Page({
    data: {
        isPlay: false
    },
    onLoad: function (option) {
        var dataId = option.id;
        var g_isPlay = app.globalData.g_isPlay;
        var g_currentIsPlay = app.globalData.g_currentIsPlay;
        if(g_isPlay && g_currentIsPlay === dataId){
            this.setData({
                isPlay: true
            });
        }
        // 得到文章ID后做数据绑定，以便给tap事件使用
        this.data.currentId = dataId;
        var postData = postDataSource.postDataList[dataId];
        this.setData({
            postData: postData
        });
        // this.data.postData = postData; 好像不能用这个东西
        var collectedStatusList = wx.getStorageSync('collectedStatusList');
        if(collectedStatusList){
            var collectedStatus = collectedStatusList[dataId];
            //取出当前文章状态，然后做数据绑定
            this.setData({
                collected: collectedStatus
            });
        }else{
            // 不存在就新建状态集合，否则在下面点击收藏会报错
            var collectedStatusList = {};
            collectedStatusList[dataId] = false;
            wx.setStorageSync('collectedStatusList', collectedStatusList);
        }
        this.onMusicMonitor();
    },
    onColletionTap: function(event){
        // 借助data来存放得到的文章ID
        var dataId = this.data.currentId;
        // 得到状态集合，对相应数据取反操作
        var collectedStatusList = wx.getStorageSync('collectedStatusList');
        var status = collectedStatusList[dataId];
        // 点击收藏图标对状态取反
        status = !status;
        collectedStatusList[dataId] = status;
        this.showToast(collectedStatusList, status);
        
    },
    showToast(collectedStatusList, status){
        wx.showToast({
            title: status?'收藏成功':'取消收藏',
            duration: 1000,
            icon: "success"
        });
        wx.setStorageSync('collectedStatusList', collectedStatusList);
        this.setData({
            collected: status
        });
    },
    onMusicTap: function(event){
        var isPlay = this.data.isPlay;
        var dataId = this.data.currentId;
        var post_data = postDataSource.postDataList[dataId];
        if(isPlay){
            wx.pauseBackgroundAudio();
            this.setData({
                isPlay: false
            });
            app.globalData.g_isPlay = false;
            app.globalData.g_currentIsPlay = null;
        }else{
            wx.playBackgroundAudio({
              dataUrl: post_data.music.url,
              title: post_data.music.title,
              coverImgUrl: post_data.music.coverImg
            });
            this.setData({
                isPlay: true
            });
            app.globalData.g_isPlay = true;
            app.globalData.g_currentIsPlay = dataId;
            
        }

    },
    onMusicMonitor:function(){
        var thisE = this;
        wx.onBackgroundAudioPlay(function() {
            thisE.setData({
                isPlay: true
            });
            app.globalData.g_isPlay = true;
            app.globalData.g_currentIsPlay = dataId;
        });
        wx.onBackgroundAudioPause(function() {
            thisE.setData({
                isPlay: false
            });
            app.globalData.g_isPlay = false;
            app.globalData.g_currentIsPlay = null;
        });
        wx.onBackgroundAudioStop(function() {
            thisE.setData({
                isPlay: false
            });
            app.globalData.g_isPlay = false;
            app.globalData.g_currentIsPlay = null;
        });
    }
    // onShareTap:function(){
    //     wx.showActionSheet({
    //         itemList: [
    //             '转发给好友',
    //             '转发到朋友圈',
    //             '转发到QQ',
    //             '转发到微博'
    //         ],
    //         success: function(res){
    //             // res.calcel 是否点击了取消按钮
    //             // res.tabIndex 点击的按钮下标索引
    //             // if
    //             wx.showModal({
    //                 title: '分享',
    //                 content: '分享给好友?'
    //             });
    //         }
    //     });
    // }

})