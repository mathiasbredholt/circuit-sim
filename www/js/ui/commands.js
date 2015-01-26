define(["jquery", "underscore"], function($, _) {
  return {
    load: function(library) {
      var components = _.pluck(library["components"], "name");

      $("#commandInput").keyup(function() {
        var input = $(this).val();
        var result = _.filter(components, function(str) { return str.toLowerCase().search(input) != -1 });

        var results = $("#searchResult");
        results.empty();

        for (i = 0; i < result.length; i++) {
          var elem = $("<p>")
          .addClass("commandItem")
          .html(result[i]);
          results.append(elem);
        }
      });

      $(document).keydown(function(e) {

        if (e.which == 32) {
          e.preventDefault();
          $("#commandInput")[0].blur();

          $("#rightmenu").toggleClass("slide");
//           $("#rightmenu")[0].addEventListener('webkitTransitionEnd', function() {
//             $("#commandInput")[0].focus();
//           }, false);
        }
      })
    }
  }
})
