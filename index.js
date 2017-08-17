$(document).ready(function() {
  var config = {
    searchUrl: 'https://api.themoviedb.org/3/search/movie?query=',
    popularUrl: 'https://api.themoviedb.org/3/movie/popular?api_key=5b19221d20b929615d236692cea743e4&language=en-US&page=1',
    imageUrl: 'https://image.tmdb.org/t/p/w500',
    movieUrl: 'https://api.themoviedb.org/3/movie/',
    apiKey: 'api_key=5b19221d20b929615d236692cea743e4&language=en-US&page=1'
  }

  var searchDiv = $('#searchDiv'),
      popularDiv = $('#popularDiv'),
      loading = $('#loading'),
      movieInput,
      movieName;

  // Sets page with correct show/hide logic
  getPopular();
  searchDiv.hide();
  loading.hide();

  // Submit event to show search results
  $('#searchButton').click(function(e) {
    popularDiv.hide();
    loading.show();
    $('#search-results').empty();
    var movieInput = $('#movie').val();
    movieName = encodeURI(movieInput);
    $.ajax({
      type: 'GET',
      url: config.searchUrl + movieInput + '&' + config.apiKey,
      dataType: 'json',
      success: function(data) {
        generateListResults(data, $('#search-results'));
        searchDiv.show();
        loading.hide();
      },
      error: function(e) {
        console.log(e.message);
      }
    });
    $('#movie').val('');
  });

  // Click event to show movie details page
  $(".list").on("click", ".list-group-item", function(event){
    $('#movieDetail, #movieTitle').empty();
    var movieId = this.id;
    $.ajax({
      type: 'GET',
      url: config.movieUrl + movieId + '?' + config.apiKey,
      dataType: 'json',
      success: function(data) {
        generateMovieDetails(data);
      },
      error: function(e) {
        console.log(e.message);
      }
    });
});

  // A function that GETs 20 of the most popular movies
  function getPopular() {
    $.ajax({
      type: 'GET',
      url: config.popularUrl,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(data) {
        generateListResults(data, $('#popular-results'));
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  }

  // Function that generates images for detail modal
  function generateImages(data) {

  }

  // Function that builds movie details
  function generateMovieDetails(data) {
    var dateArr = data.release_date.split('-');
    var dateStr = "Released on " + getMonthName(dateArr[1]) + " " + dateArr[2] + ", " + dateArr[0];
    var image = config.imageUrl + data.backdrop_path;
    var title = "<h2>" + data.title + "</h2>";
    var description = "<img src='" + image + "'>" +
                      "<p>" + data.overview + "</p>" +
                      "<p>" + dateStr + "</p>";
    $('#movieTitle').append(title);
    $('#movieDetail').append(description);
  }

  function getMonthName(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[monthNumber - 1];
  }

  // Reusable generate result function
  function generateListResults(object, listElement) {
    var results = object.results;
    $.each(results, function(key, value) {
      var result = "<li class='list-group-item' id='" + value.id + "''><a href='#' data-toggle='modal' data-target='#detailModal'>" + value.title + "</a></li>";
      listElement.append(result);
    });
  }
})
