$(document).ready(function() {
  var url = 'https://api.themoviedb.org/3/',
  search = 'search/movie?query=',
  popular = 'movie/popular?',
  input,
  movieName,
  key = 'api_key=5b19221d20b929615d236692cea743e4',
  lang = '&language=en-US&page=1';

  // Shows popular movies on page load
  getPopular();

  // Submit event to show search results
  $('button').click(function() {
    var input = $('#movie').val(),
    movieName = encodeURI(input);
    $.ajax({
      type: 'GET',
      url: url + search + input + '&' + key + lang,
      async: false,
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        generateResults(data, $('#search-results'));
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
      var result = "<li id='"+ key + "''><a href='#'>" + value.title + "</a></li>";
      listElement.append(result);
    });
  }
})
