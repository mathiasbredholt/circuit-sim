define(["jquery", "underscore", "components/component"], function($, _, Component) {
  function UpdateList(components, input) {
    var result = _.filter(components, function(str) { return str.toLowerCase().search(input) != -1 });

    var results = $("#searchResult");
    results.empty();

    for (i = 0; i < result.length; i++) {
      var elem = $("<li>")
      .addClass("commandItem")
      .html(result[i])
      .hover(function() {
        $("#searchResult").removeClass("hover");
        $(this).addClass("hover");
      }, function() {
        $(this).removeClass("hover");
      });

      if (i == 0) {
        elem.addClass("hover");
      }

      results.append(elem);
    }
  }

  return {
    init: function(library) {
      var components = _.pluck(library["components"], "name");

      $("#commandInput").keyup(function(e) {
        var input = $(this).val();

        if (e.which != 38 && e.which != 40 && e.which != 13) {
          UpdateList(components, input);
        }
      })

      $(document).keydown(function(e) {

        if (e.which == 32) {
          e.preventDefault();
          $("#commandInput")[0].blur();

          $("#rightmenu").toggleClass("slide");
//                     $("#rightmenu")[0].addEventListener('webkitTransitionEnd', function() {
//                       $("#commandInput")[0].focus();
//                     }, false);
        }

        var selected = $("#searchResult").find(".hover");

        if (e.which == 38) {
          e.preventDefault();
          if (selected.prev().length) {
            selected
            .removeClass("hover")
            .prev().addClass("hover");
          }

        }

        if (e.which == 40) {
          e.preventDefault();
          if (selected.next().length) {
            selected
            .removeClass("hover")
            .next().addClass("hover");
          }
        }

        if (e.which == 13) {
          e.preventDefault();
          console.log(selected.html());
          Component.create(_.find(library["components"], { name: selected.html() }));
        }
      })

    }
  }
})
