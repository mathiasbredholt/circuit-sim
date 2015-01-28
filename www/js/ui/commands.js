define(["jquery", "underscore", "components/component"], function($, _, Component) {
  function UpdateList(result) {

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
    init: function(socket) {
      var lastInput = "";
      
      socket.on("searchResult", function(data) {
        UpdateList(data);
        console.log(data);
      })
      
      $("#commandInput").keyup(function(e) {
        var input = $(this).val();
        if (input != lastInput) {
//          UpdateList();
          socket.emit("search", input);
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
//          Component.create(_.find(library, { name: selected.html() }));
        }
      })

    }
  }
})
