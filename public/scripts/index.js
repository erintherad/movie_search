$(document).ready(function() {
  var config = {
    searchUrl: 'https://api.themoviedb.org/3/search/movie?query=',
    popularUrl: 'https://api.themoviedb.org/3/movie/popular?api_key=5b19221d20b929615d236692cea743e4&language=en-US&page=1',
    imageUrl: 'https://image.tmdb.org/t/p/w185',
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
    $('#search-results, #searchTerm').empty();
    var movieInput = $('#movie').val();
    $('#searchTerm').append(movieInput);
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
    var image = checkForMissingImage(data.poster_path);
    var title = "<h2>" + data.title + "</h2>";
    var description = "<img class='float-left movie-detail-img' src='" + image + "'>" +
                      "<select id='rating'>" +
                        "<option value='1'>1</option>" +
                        "<option value='2'>2</option>" +
                        "<option value='3'>3</option>" +
                        "<option value='4'>4</option>" +
                        "<option value='5'>5</option>" +
                        "<option value='6'>1</option>" +
                        "<option value='7'>2</option>" +
                        "<option value='8'>3</option>" +
                        "<option value='9'>4</option>" +
                        "<option value='10'>5</option>" +
                      "</select>" +
                      "<p>" + data.overview + "</p>" +
                      "<p>" + dateStr + "</p>";
    $('#movieTitle').append(title);
    $('#movieDetail').append(description);
    showStars(7);
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
      var image = checkForMissingImage(value.poster_path);
      var result = "<li class='card' id='" + value.id + "''>" +
                   "<div class='card-block'><a href='#' data-toggle='modal' data-target='#detailModal'>" +
                   "<img src='" + image + "' class='card-img-top'>" +
                   "<h4 class='card-title movie-title'>" + value.title + "</h4></a></li></div>";
      listElement.append(result);
    });
  }

function showStars(rating) {
  $('#rating').barrating({
      theme: 'fontawesome-stars-o',
      readOnly: true,
      initialRating: rating,
      hoverState: false
    });
  }
});
