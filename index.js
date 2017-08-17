$(document).ready(function() {
  var url = 'https://api.themoviedb.org/3/',
  search = 'search/movie?query=',
  popular = 'movie/popular?',
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
        generateResults(data, $('#search-results'));
        searchDiv.show();
        loading.hide();
      },
      error: function(e) {
        console.log(e.message);
      }
    });
    $('#movie').val('');
  });

  // A function that GETs 20 of the most popular movies
  function getPopular() {
    $.ajax({
      type: 'GET',
      url: url + popular + key + lang,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(data) {
        generateResults(data, $('#popular-results'));
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  }

  // Reusable generate result function
  function generateResults(object, listElement) {
    var results = object.results;
    $.each(results, function(key, value) {
      var result = "<li class='list-group-item' id='"+ value.id + "''><a href='#'>" + value.title + "</a></li>";
      listElement.append(result);
    });
  }
})
