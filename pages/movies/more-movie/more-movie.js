var app = getApp();
var utils = require('../../../utils/utils.js');
Page({
  data:{
    totalCount: 0,
    isEmpty: true
  },
  onLoad:function(options){
    var categoryTitle = options.categoryTitle;
    this.setData({
      categoryTitle: categoryTitle
    });
    var requestUrl = '';
    var baseUrl = app.globalData.doubanBase;
    switch(categoryTitle){
      case '正在上映的电影-北京':
        requestUrl = baseUrl + '/v2/movie/in_theaters';
        break;
      case '即将上映的电影':
        requestUrl = baseUrl + '/v2/movie/coming_soon';
        break;
      case '豆瓣电影Top250':
        requestUrl = baseUrl + '/v2/movie/top250';
        break;
      
    }
    this.setData({
      requestUrl: requestUrl
    });
    utils.getMoviesListData(requestUrl, this.processData);
  },
  processData:function(data){
    var movies = [];
    for(var index in data.subjects){
      var movie = data.subjects[index];
      var title = movie.title;
      if(title.length > 6){
        title = title.substring(0, 6) + '...';
      }
      
      var coverImg = movie.images.large;
      var average = movie.rating.average;
      var stars = utils.processStars(movie.rating.stars);
      var movieId = movie.id;
      var temp = {
        title: title,
        coverImg: coverImg,
        average: average,
        stars: stars,
        movieId: movieId
      }
      movies.push(temp);
      
    }
    var totalMovies = [];
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
    }else{
      totalMovies = movies;
      this.setData({
        isEmpty: false
      });
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },
  onScrollLower:function(){
    var requestUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20';
    utils.getMoviesListData(requestUrl, this.processData);
    wx.showNavigationBarLoading();
  },
  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.categoryTitle
    })
  },
  onMovieDetailTap: function(event){
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  }
})