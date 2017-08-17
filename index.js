$(document).ready(function() {
  var url = 'http://api.themoviedb.org/3/',
  mode = 'search/movie?query=',
  input,
  movieName,
  key = '&api_key=5b19221d20b929615d236692cea743e4';

  $('button').click(function() {
    var input = $('#movie').val(),
    movieName = encodeURI(input);
    $.ajax({
      type: 'GET',
      url: url + mode + input + key,
      async: false,
      jsonpCallback: 'testing',
      contentType: 'application/json',
      dataType: 'jsonp',
      success: function(json) {
        console.log(json);
      },
      error: function(e) {
        console.log(e.message);
      }
    });
  });
})
