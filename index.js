$(document).ready(function() {
  var url = 'https://api.themoviedb.org/3',
  search = '/search/movie?query=',
  popular = '/movie/popular?',
  movie = '/movie/',
  movieInput,
  movieName,
  key = 'api_key=5b19221d20b929615d236692cea743e4',
  lang = '&language=en-US&page=1',
  searchDiv = $('#searchDiv'),
  popularDiv = $('#popularDiv'),
  loading = $('#loading');

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
      url: url + search + movieInput + '&' + key + lang,
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
      url: url + movie + movieId + '?' + key + lang,
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
      url: url + popular + key + lang,
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
    console.log('function called')
    var result = data.title;
    console.log(data.title);
    $('#movieDetail').append(result);
  }

  // Reusable generate result function
  function generateListResults(object, listElement) {
    var results = object.results;
    $.each(results, function(key, value) {
      var result = "<li class='list-group-item' id='"+ value.id + "''><a href='#' data-toggle='modal' data-target='#detailModal'>" + value.title + "</a></li>";
      listElement.append(result);
    });
  }
})
