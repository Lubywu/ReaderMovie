var app = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data: {

  },
  onLoad: function (options) {
    var movidId = options.id;
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movidId;
    utils.getMoviesListData(url, this.processData);

  },
  processData: function (data) {
    var director = {};
    if (data.directors) {
      if (data.directors.avatars) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.id = data.directors[0].id;
      director.name = data.directors[0].name;
    }
    var movie = {
      director: director,
      movieImg : data.images.large,
      country : data.countries[0],
      title : data.title,
      originalTitle : data.original_title,
      wishCount : data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: utils.processStars(data.rating.stars),
      average: data.rating.average,
      casts: utils.processCasts(data.casts),
      castsInfo: utils.processCastsInfo(data.casts),
      summary: data.summary 
    }

    this.setData({
      movie: movie
    });
  },
  viewMovieImg: function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [src]
    })
  }
})