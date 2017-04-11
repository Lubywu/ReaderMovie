var app = getApp();
var utils = require('../../utils/utils.js');
Page({
  data: {
    isContainerShow: true,
    isSearchPanelShow: false,
    searchResult: {},
    inTheaters: {},
    comingSoon: {},
    top250: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    var baseUrl = app.globalData.doubanBase;
    var inTheaters = baseUrl + '/v2/movie/in_theaters?count=3';
    var comingSoon = baseUrl + '/v2/movie/coming_soon?count=3';
    var top250 = baseUrl + '/v2/movie/top250?count=3';
    this.getMoviesListData(inTheaters, 'inTheaters');
    this.getMoviesListData(comingSoon, 'comingSoon');
    this.getMoviesListData(top250, 'top250');

  },
  getMoviesListData: function (url, type) {
    var thisE = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      }, // 设置请求的 header
      success: function (res) {
        var data = res.data;
        thisE.processData(data, type);

      }
    })
  },
  onMoreMoviesTap: function (e) {
    var categoryTitle = e.target.dataset.categoryTitle;
    wx.navigateTo({
      url: 'more-movie/more-movie?categoryTitle=' + categoryTitle
    })
  },
  onBindFocusTap: function (event) {
    wx.setNavigationBarTitle({
      title: '电影搜索'
    });
    this.setData({
      isContainerShow: false,
      isSearchPanelShow: true,
      totalCount: 0
    });
  },
  onConfirmTap: function (event) {
    var keywords = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + keywords;
    this.setData({
      requestUrl: searchUrl
    });
    this.getMoviesListData(searchUrl, 'searchResult');
  },
  cancelSearch: function () {
    wx.setNavigationBarTitle({
      title: '视频'
    });
    this.setData({
      isContainerShow: true,
      isSearchPanelShow: false,
      keywords: ''
    });
    this.setData({
      searchResult: {}
    });
  },
  processData: function (data, type) {
    var movies = [];
    for (var index in data.subjects) {
      var movie = data.subjects[index];
      var title = movie.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + '...';
      }
      var categoryTitle = data.title;// 电影分类标题：最近上映、即将上映、top250
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

    var renderData = {};
    if (this.data.isSearchPanelShow) {
      var totalMovies = [];

      if (!this.data.isEmpty) {
        totalMovies = this.data.movies.concat(movies);
      } else {
        totalMovies = movies;
        this.setData({
          isEmpty: false
        });
      }
      this.setData({
        movies: totalMovies
      });
      renderData[type] = {
        movies: totalMovies
      }
      this.data.totalCount += 20;
      wx.hideNavigationBarLoading();
    } else {
      renderData[type] = {
        categoryTitle: categoryTitle,
        movies: movies
      };
    }
    this.setData(renderData);


  },
  onScrollLower: function () {
    var requestUrl = this.data.requestUrl + '&start=' + this.data.totalCount + '&count=20';
    this.getMoviesListData(requestUrl, 'searchResult');
    wx.showNavigationBarLoading();
  },
  onMovieDetailTap: function(event){
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    })
  }


})