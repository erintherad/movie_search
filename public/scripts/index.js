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

// *** EVENT LISTENERS *** //

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
  $(".list").on("click", ".card", function(event){
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


// *** HELPER FUNCTIONS *** //

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

  // Function that builds movie details
  function generateMovieDetails(data) {
    var dateArr = data.release_date.split('-');
    var dateStr = "Released on " + getMonthName(dateArr[1]) + " " + dateArr[2] + ", " + dateArr[0];
    var image = checkForMissingImage(data.backdrop_path);
    var title = "<h2>" + data.title + "</h2>";
    var description = "<img src='" + image + "'>" +
                      "<p>" + data.overview + "</p>" +
                      "<p>" + dateStr + "</p>";
    $('#movieTitle').append(title);
    $('#movieDetail').append(description);
  }

  // Function that checks for missing images and replaces with a placeholder
  function checkForMissingImage(imageVal) {
    if (imageVal != null) {
      return config.imageUrl + "/" + imageVal;
    } else {
      return "/assets/missing.png"
    }
  }

  // Function that grabs the name of a month based from a number
  function getMonthName(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[monthNumber - 1];
  }

  // Reusable generate result function
  function generateListResults(object, listElement) {
    var results = object.results;
    $.each(results, function(key, value) {
      var image = checkForMissingImage(value.backdrop_path);
      var result = "<li class='card col-md-3' id='" + value.id + "''>" +
                   "<a href='#' data-toggle='modal' data-target='#detailModal'>" +
                   "<img src='" + image + "' class='img-fluid'>" +
                   "<h4 class='card-title'>" + value.title + "</h4></a></li>";
      listElement.append(result);
    });
  }
})