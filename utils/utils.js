function processStars(stars) {
    var starsCount = stars.substring(0, 1);
    var starsArr = [];
    for (var i = 0; i < 5; i++) {
        if (i < starsCount) {
            starsArr.push(1);
        } else {
            starsArr.push(0);
        }
    }
    return starsArr;
}


function getMoviesListData(url, callback) {
    var thisE = this;
    wx.request({
        url: url,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            "Content-Type": "json"
        }, // 设置请求的 header
        success: function (res) {
            callback(res.data);
        }
    })
}

function processCasts(casts) {
    var castsString = "";
    for (var idx in casts) {
        castsString = castsString + casts[idx].name + " / ";
    }
    return castsString.substring(0, castsString.length - 2);
}

function processCastsInfo(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
module.exports = {
    processStars: processStars,
    getMoviesListData: getMoviesListData,
    processCasts: processCasts,
    processCastsInfo: processCastsInfo

};